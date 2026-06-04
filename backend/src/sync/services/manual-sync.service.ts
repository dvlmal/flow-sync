import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { NotionSyncService } from './notion-sync.service';
import { SyncLogService } from './sync-log.service';
import {
  SyncDirection,
  TaskSyncPayload,
  RetryConfig,
  calculateBackoffDelay,
  isRateLimitError,
  isRetryableError,
} from '../../common/types/sync.types';
import { ManualSyncDto, ManualSyncResult } from '../dto/manual-sync.dto';

/**
 * 수동 동기화 재시도 설정
 * - 수동 동기화는 사용자가 기다리므로 더 짧은 지연과 적은 재시도 사용
 */
const MANUAL_SYNC_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 5000,
  exponentialBase: 2,
  jitterFactor: 0.2,
};

/**
 * Rate Limit 설정
 * - Notion API: 3 requests/second
 * - Token Bucket 방식으로 최소 필요 간격만 대기
 */
const MIN_REQUEST_INTERVAL_MS = 350; // 약 2.8 req/sec (안전 마진)

/**
 * 배치 처리 설정
 * - Notion API 3 req/sec 제한 고려
 * - 병렬 처리로 성능 개선 (40-60% 시간 단축 기대)
 */
const BATCH_SIZE = 3;

/**
 * 동시성 제어용 락 키 생성
 */
function getSyncLockKey(taskId?: string, direction?: SyncDirection): string {
  return `${direction ?? 'APP_TO_NOTION'}:${taskId ?? 'all'}`;
}

/**
 * 수동 동기화 서비스
 * - 큐를 사용하지 않고 직접 동기화 수행
 * - Rate Limit 처리 및 재시도 로직 포함
 * - 동기화 진행 상태 반환
 * - 동시성 제어 (Race Condition 방지)
 * - 배치 병렬 처리로 성능 최적화
 */
@Injectable()
export class ManualSyncService {
  private readonly logger = new Logger(ManualSyncService.name);

  /**
   * P0: 동시성 제어 락
   * - 동일한 동기화 요청이 진행 중일 때 중복 실행 방지
   * - Promise를 저장하여 동시 요청자들이 같은 결과를 공유
   */
  private syncLock = new Map<string, Promise<ManualSyncResult>>();

  /**
   * P1: Token Bucket 방식 Rate Limiting
   * - 마지막 요청 시간을 추적하여 필요한 만큼만 대기
   */
  private lastRequestTime = 0;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly notionSyncService: NotionSyncService,
    private readonly syncLogService: SyncLogService,
  ) {}

  /**
   * 수동 동기화 실행 (동시성 제어 포함)
   * @param dto - 동기화 옵션 (taskId, direction)
   * @returns 동기화 결과
   */
  async executeManualSync(dto: ManualSyncDto): Promise<ManualSyncResult> {
    const lockKey = getSyncLockKey(dto.taskId, dto.direction);

    // P0: 이미 진행 중인 동기화가 있으면 해당 Promise 반환 (중복 방지)
    const existingSync = this.syncLock.get(lockKey);
    if (existingSync) {
      this.logger.log(
        `Sync already in progress for ${lockKey}, waiting for result`,
      );
      return existingSync;
    }

    // 새 동기화 시작 및 락 등록
    const syncPromise = this.executeManualSyncInternal(dto);
    this.syncLock.set(lockKey, syncPromise);

    try {
      const result = await syncPromise;
      return result;
    } finally {
      // 완료 후 락 해제
      this.syncLock.delete(lockKey);
    }
  }

  /**
   * 실제 동기화 실행 로직
   */
  private async executeManualSyncInternal(
    dto: ManualSyncDto,
  ): Promise<ManualSyncResult> {
    const startTime = Date.now();
    const startedAt = new Date().toISOString();
    const direction = dto.direction ?? SyncDirection.APP_TO_NOTION;

    this.logger.log(
      `Starting manual sync: direction=${direction}, taskId=${dto.taskId ?? 'all'}`,
    );

    const result: ManualSyncResult = {
      success: true,
      direction,
      totalCount: 0,
      successCount: 0,
      failedCount: 0,
      skippedCount: 0,
      syncedTaskIds: [],
      errors: [],
      startedAt,
      completedAt: '',
      durationMs: 0,
    };

    try {
      if (direction === SyncDirection.APP_TO_NOTION) {
        await this.syncAppToNotion(dto.taskId, result);
      } else {
        // Notion -> App 동기화 (향후 구현)
        await this.syncNotionToApp(dto.taskId, result);
      }
    } catch (error: any) {
      this.logger.error(`Manual sync failed: ${error.message}`);
      result.success = false;
      result.errors.push({
        taskId: dto.taskId ?? 'system',
        error: error.message,
      });
    }

    result.completedAt = new Date().toISOString();
    result.durationMs = Date.now() - startTime;
    result.success = result.failedCount === 0 && result.errors.length === 0;

    this.logger.log(
      `Manual sync completed: success=${result.successCount}, failed=${result.failedCount}, skipped=${result.skippedCount}, duration=${result.durationMs}ms`,
    );

    return result;
  }

  /**
   * App -> Notion 동기화 (배치 병렬 처리)
   */
  private async syncAppToNotion(
    taskId: string | undefined,
    result: ManualSyncResult,
  ): Promise<void> {
    // 동기화할 Task 조회
    const tasks = await this.getTasksToSync(taskId);
    result.totalCount = tasks.length;

    if (tasks.length === 0) {
      this.logger.log('No tasks to sync');
      return;
    }

    this.logger.log(
      `Found ${tasks.length} tasks to sync (batch size: ${BATCH_SIZE})`,
    );

    // P1: 배치 병렬 처리 (3개씩)
    for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
      const batch = tasks.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(tasks.length / BATCH_SIZE);

      this.logger.log(`Processing batch ${batchNumber}/${totalBatches}`);

      // 배치 내 Task들을 병렬 처리
      const batchResults = await Promise.all(
        batch.map(async (task) => {
          // Token Bucket 방식 Rate Limit 대기
          await this.waitForRateLimit();
          return this.syncSingleTask(task);
        }),
      );

      // 배치 결과 집계
      for (let j = 0; j < batch.length; j++) {
        const syncResult = batchResults[j];
        const task = batch[j];

        if (syncResult.status === 'success') {
          result.successCount++;
          result.syncedTaskIds.push(task.id);
        } else if (syncResult.status === 'skipped') {
          result.skippedCount++;
        } else {
          result.failedCount++;
          result.errors.push({
            taskId: task.id,
            error: syncResult.error ?? 'Unknown error',
          });
        }
      }
    }
  }

  /**
   * P1: Token Bucket 방식 Rate Limit 대기
   * - 마지막 요청 이후 경과 시간을 계산하여 필요한 만큼만 대기
   * - 불필요한 대기 시간 제거로 성능 개선
   */
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    const waitTime = MIN_REQUEST_INTERVAL_MS - elapsed;

    if (waitTime > 0) {
      this.logger.debug(`Rate limit wait: ${waitTime}ms`);
      await this.delay(waitTime);
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * 동기화할 Task 조회
   * - taskId가 지정된 경우 해당 Task만 조회
   * - 없으면 notion_page_id가 없는 모든 Task 조회
   */
  private async getTasksToSync(taskId?: string): Promise<any[]> {
    let queryBuilder = this.supabase.from('task').select(`
        *,
        project:project_id(*),
        workflow_status:status_id(*)
      `);

    if (taskId) {
      queryBuilder = queryBuilder.eq('id', taskId);
    }

    // 삭제되지 않은 Task만
    queryBuilder = queryBuilder.is('deleted_at', null);

    const { data: tasks, error } = await queryBuilder;

    if (error) {
      this.logger.error(`Failed to fetch tasks: ${error.message}`);
      throw error;
    }

    return tasks ?? [];
  }

  /**
   * 단일 Task 동기화 (재시도 로직 포함)
   * P1: Rate Limit 에러도 maxRetries 적용
   */
  private async syncSingleTask(
    task: any,
  ): Promise<{ status: 'success' | 'skipped' | 'failed'; error?: string }> {
    const payload = this.buildSyncPayload(task);
    let lastError: string | undefined;

    // 동기화 시작 로그
    await this.syncLogService.logSyncStart(
      task.id,
      SyncDirection.APP_TO_NOTION,
    );

    for (
      let attempt = 0;
      attempt < MANUAL_SYNC_RETRY_CONFIG.maxRetries;
      attempt++
    ) {
      try {
        if (task.notion_page_id) {
          // UPDATE: 기존 Notion 페이지 업데이트
          await this.notionSyncService.updateNotionPage(
            task.notion_page_id,
            payload,
          );
          this.logger.log(`Task ${task.id} updated in Notion`);
        } else {
          // CREATE: 새 Notion 페이지 생성 (보상 트랜잭션 포함)
          await this.createNotionPageWithRollback(task, payload);
        }

        // 성공 로그
        await this.syncLogService.logSyncComplete(
          task.id,
          SyncDirection.APP_TO_NOTION,
        );

        return { status: 'success' };
      } catch (error: any) {
        lastError = error.message;
        this.logger.warn(
          `Sync attempt ${attempt + 1}/${MANUAL_SYNC_RETRY_CONFIG.maxRetries} failed for task ${task.id}: ${error.message}`,
        );

        // P1: Rate Limit 에러도 maxRetries 적용 (무한 루프 방지)
        if (isRateLimitError(error)) {
          // 마지막 시도가 아닌 경우에만 재시도
          if (attempt < MANUAL_SYNC_RETRY_CONFIG.maxRetries - 1) {
            const delay = calculateBackoffDelay(
              attempt,
              MANUAL_SYNC_RETRY_CONFIG,
            );
            this.logger.warn(
              `Rate limited, waiting ${delay}ms before retry (attempt ${attempt + 1}/${MANUAL_SYNC_RETRY_CONFIG.maxRetries})`,
            );
            await this.delay(delay);
          }
          continue;
        }

        // 재시도 가능한 에러가 아닌 경우 즉시 실패
        if (!isRetryableError(error)) {
          break;
        }

        // 재시도 가능한 에러인 경우 지수 백오프
        if (attempt < MANUAL_SYNC_RETRY_CONFIG.maxRetries - 1) {
          const delay = calculateBackoffDelay(
            attempt,
            MANUAL_SYNC_RETRY_CONFIG,
          );
          await this.delay(delay);
        }
      }
    }

    // 실패 로그
    await this.syncLogService.logSyncError(
      task.id,
      SyncDirection.APP_TO_NOTION,
      lastError ?? 'Unknown error',
      MANUAL_SYNC_RETRY_CONFIG.maxRetries,
    );

    return { status: 'failed', error: lastError };
  }

  /**
   * P0: Notion 페이지 생성 + DB 저장 (보상 트랜잭션)
   * - Notion 페이지 생성 후 DB 저장 실패 시 Notion 페이지 아카이브
   * - 중복 페이지 생성 방지
   */
  private async createNotionPageWithRollback(
    task: any,
    payload: TaskSyncPayload,
  ): Promise<void> {
    // 1. Notion 페이지 생성
    const notionPage = await this.notionSyncService.createNotionPage(payload);
    const notionPageId = notionPage.id;

    this.logger.log(`Notion page created: ${notionPageId}`);

    // 2. DB에 notion_page_id 저장
    const { error: updateError } = await this.supabase
      .from('task')
      .update({ notion_page_id: notionPageId })
      .eq('id', task.id);

    if (updateError) {
      // P0: 보상 트랜잭션 - DB 저장 실패 시 Notion 페이지 아카이브
      this.logger.error(
        `Failed to save notion_page_id, rolling back Notion page: ${updateError.message}`,
      );

      try {
        await this.notionSyncService.archiveNotionPage(notionPageId);
        this.logger.log(
          `Rollback completed: Notion page ${notionPageId} archived`,
        );
      } catch (archiveError: any) {
        // 아카이브도 실패한 경우 로그만 남김 (수동 정리 필요)
        this.logger.error(
          `Failed to archive Notion page during rollback: ${archiveError.message}. ` +
            `Manual cleanup required for Notion page: ${notionPageId}`,
        );
      }

      // 원래 에러를 다시 throw하여 재시도 로직 진입
      throw updateError;
    }

    this.logger.log(`Task ${task.id} created in Notion: ${notionPageId}`);
  }

  /**
   * Task -> Notion 동기화 페이로드 빌드
   */
  private buildSyncPayload(task: any): TaskSyncPayload {
    return {
      title: task.title,
      content: task.content ?? undefined,
      status: task.workflow_status?.name,
      priority: task.priority ?? undefined,
      startDate: task.start_date?.split('T')[0],
      endDate: task.end_date?.split('T')[0],
      assignees: task.assignees as string[] | undefined,
      tags: task.tags ? task.tags.split(',') : undefined,
    };
  }

  /**
   * Notion -> App 동기화 (향후 구현 예정)
   */
  private async syncNotionToApp(
    taskId: string | undefined,
    result: ManualSyncResult,
  ): Promise<void> {
    // TODO: Notion -> App Polling 구현
    // 1. NotionService.getUpdatedPages() 호출
    // 2. 변경된 페이지의 데이터를 PostgreSQL에 반영
    // 3. Last Write Wins 충돌 해결

    this.logger.warn('Notion -> App sync is not implemented yet');
    throw new Error('NOTION_TO_APP sync is not implemented yet');
  }

  /**
   * 지연 유틸리티
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
