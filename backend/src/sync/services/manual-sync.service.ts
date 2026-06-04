import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { NotionSyncService } from './notion-sync.service';
import { NotionService } from '../../notion/notion.service';
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
 * Notion 페이지 파싱 결과 타입
 */
interface ParsedNotionTask {
  notionPageId: string;
  title: string;
  content: string | null;
  status: string | null;
  priority: string | null;
  startDate: string | null;
  endDate: string | null;
  tags: string | null;
  assignees: string[];
  lastEditedTime: Date;
}

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
 * - Mutex로 보호되어 동시성 문제 해결
 */
const MIN_REQUEST_INTERVAL_MS = 350; // 약 2.8 req/sec (안전 마진)

/**
 * 배치 처리 설정
 * - Notion API 3 req/sec 제한 고려
 * - Controlled Concurrency로 rate limit 준수하면서 병렬화
 */
const BATCH_SIZE = 3;

/**
 * Notion->App 동기화는 DB 작업만 수행하므로 더 큰 배치 가능
 * - Notion API 호출 없이 Supabase만 사용
 */
const DB_BATCH_SIZE = 10;

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
   * P1: Mutex 보호 Rate Limiting
   * - 마지막 요청 시간을 추적하여 필요한 만큼만 대기
   * - Mutex로 보호하여 동시성 이슈 해결
   */
  private lastRequestTime = 0;
  private rateLimitMutex: Promise<void> = Promise.resolve();

  // Notion Status -> App Status 역매핑
  private readonly reverseStatusMapping: Record<string, string> = {
    '시작 전': '시작 전',
    '진행 중': '진행 중',
    완료: '완료',
    'Not started': '시작 전',
    'In progress': '진행 중',
    Done: '완료',
  };

  constructor(
    private readonly supabase: SupabaseService,
    private readonly notionSyncService: NotionSyncService,
    private readonly notionService: NotionService,
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
   * P1: Mutex 보호 Rate Limit 대기
   * - Mutex로 순차적 접근 보장하여 동시성 이슈 해결
   * - 마지막 요청 이후 경과 시간을 계산하여 필요한 만큼만 대기
   * - Promise.all 내에서도 rate limit 정확히 준수
   */
  private async waitForRateLimit(): Promise<void> {
    // Mutex 체이닝: 이전 대기가 완료된 후 현재 대기 시작
    const previousMutex = this.rateLimitMutex;
    let resolveMutex: () => void;
    this.rateLimitMutex = new Promise((resolve) => {
      resolveMutex = resolve;
    });

    try {
      // 이전 요청의 rate limit 대기 완료 대기
      await previousMutex;

      const now = Date.now();
      const elapsed = now - this.lastRequestTime;
      const waitTime = MIN_REQUEST_INTERVAL_MS - elapsed;

      if (waitTime > 0) {
        this.logger.debug(`Rate limit wait: ${waitTime}ms`);
        await this.delay(waitTime);
      }

      this.lastRequestTime = Date.now();
    } finally {
      // 다음 요청이 진행할 수 있도록 해제
      resolveMutex!();
    }
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
   * Notion -> App 동기화
   * - Notion에서 모든 페이지 또는 특정 페이지 조회
   * - Notion 속성을 App DB 형식으로 변환
   * - notion_page_id로 기존 Task 매칭 (있으면 UPDATE, 없으면 CREATE)
   * - Last Write Wins 충돌 해결
   */
  private async syncNotionToApp(
    notionPageId: string | undefined,
    result: ManualSyncResult,
  ): Promise<void> {
    // 1. Notion 페이지 조회
    let notionPages: any[];

    if (notionPageId) {
      // 특정 페이지만 조회
      try {
        await this.waitForRateLimit();
        const page = await this.notionService.getPage(notionPageId);
        notionPages = [page];
      } catch (error: any) {
        this.logger.error(
          `Failed to fetch Notion page ${notionPageId}: ${error.message}`,
        );
        result.errors.push({
          taskId: notionPageId,
          error: `Failed to fetch Notion page: ${error.message}`,
        });
        result.failedCount++;
        return;
      }
    } else {
      // 전체 페이지 조회
      try {
        await this.waitForRateLimit();
        notionPages = await this.notionService.queryDatabase();
      } catch (error: any) {
        this.logger.error(`Failed to query Notion database: ${error.message}`);
        throw error;
      }
    }

    result.totalCount = notionPages.length;

    if (notionPages.length === 0) {
      this.logger.log('No Notion pages to sync');
      return;
    }

    this.logger.log(
      `Found ${notionPages.length} Notion pages to sync (batch size: ${DB_BATCH_SIZE})`,
    );

    // 2. 캐시 병렬 로드 (독립적인 쿼리들이므로 병렬 실행으로 ~50% 시간 단축)
    const [workflowStatusCache, defaultProjectId, existingTasksMap] =
      await Promise.all([
        this.loadWorkflowStatusCache(),
        this.getDefaultProjectId(),
        this.loadExistingTasksMap(),
      ]);

    // 3. 배치 병렬 처리 (Notion API 호출 없이 DB 작업만 수행)
    // - Notion->App은 이미 조회된 데이터를 DB에 저장하므로 rate limit 불필요
    // - DB_BATCH_SIZE로 더 큰 배치 사용 가능
    for (let i = 0; i < notionPages.length; i += DB_BATCH_SIZE) {
      const batch = notionPages.slice(i, i + DB_BATCH_SIZE);
      const batchNumber = Math.floor(i / DB_BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(notionPages.length / DB_BATCH_SIZE);

      this.logger.log(`Processing Notion batch ${batchNumber}/${totalBatches}`);

      // 배치 내 페이지들을 병렬 처리 (DB 작업만 수행하므로 rate limit 불필요)
      const batchResults = await Promise.all(
        batch.map((notionPage) =>
          this.syncSingleNotionPage(
            notionPage,
            workflowStatusCache,
            existingTasksMap,
            defaultProjectId,
          ),
        ),
      );

      // 배치 결과 집계
      for (const syncResult of batchResults) {
        if (syncResult.status === 'success') {
          result.successCount++;
          result.syncedTaskIds.push(syncResult.taskId!);
        } else if (syncResult.status === 'skipped') {
          result.skippedCount++;
        } else {
          result.failedCount++;
          result.errors.push({
            taskId: syncResult.notionPageId ?? 'unknown',
            error: syncResult.error ?? 'Unknown error',
          });
        }
      }
    }
  }

  /**
   * 단일 Notion 페이지 동기화
   */
  private async syncSingleNotionPage(
    notionPage: any,
    workflowStatusCache: Map<string, { id: string; name: string }>,
    existingTasksMap: Map<string, any>,
    defaultProjectId: string | null,
  ): Promise<{
    status: 'success' | 'skipped' | 'failed';
    taskId?: string;
    notionPageId?: string;
    error?: string;
  }> {
    const notionPageId = notionPage.id;
    let lastError: string | undefined;

    // 동기화 시작 로그
    await this.syncLogService.logSyncStart(
      notionPageId,
      SyncDirection.NOTION_TO_APP,
    );

    for (
      let attempt = 0;
      attempt < MANUAL_SYNC_RETRY_CONFIG.maxRetries;
      attempt++
    ) {
      try {
        // 1. Notion 페이지 파싱
        const parsedTask = this.parseNotionPage(notionPage);

        // 2. 기존 Task 확인
        const existingTask = existingTasksMap.get(notionPageId);

        // 3. Last Write Wins 충돌 해결
        if (existingTask) {
          const appUpdatedAt = new Date(existingTask.updated_at);
          const notionUpdatedAt = parsedTask.lastEditedTime;

          if (appUpdatedAt >= notionUpdatedAt) {
            this.logger.debug(
              `Skipping Notion page ${notionPageId}: App data is newer`,
            );
            await this.syncLogService.logSyncComplete(
              notionPageId,
              SyncDirection.NOTION_TO_APP,
            );
            return { status: 'skipped', taskId: existingTask.id, notionPageId };
          }
        }

        // 4. Status 매핑 (workflow_status_id 찾기)
        let statusId: string | null = null;
        if (parsedTask.status) {
          const mappedStatusName =
            this.reverseStatusMapping[parsedTask.status] ?? parsedTask.status;
          const statusEntry = workflowStatusCache.get(mappedStatusName);
          if (statusEntry) {
            statusId = statusEntry.id;
          } else {
            this.logger.warn(
              `Status "${parsedTask.status}" not found in workflow_status table`,
            );
          }
        }

        // 5. Task 데이터 구성
        const taskData: Record<string, any> = {
          title: parsedTask.title,
          content: parsedTask.content,
          status_id: statusId,
          priority: parsedTask.priority,
          start_date: parsedTask.startDate,
          end_date: parsedTask.endDate,
          tags: parsedTask.tags,
          assignees: parsedTask.assignees,
          notion_page_id: notionPageId,
          updated_at: parsedTask.lastEditedTime.toISOString(),
        };

        let taskId: string;

        if (existingTask) {
          // UPDATE
          const { error } = await this.supabase
            .from('task')
            .update(taskData)
            .eq('id', existingTask.id);

          if (error) {
            throw new Error(`Failed to update task: ${error.message}`);
          }

          taskId = existingTask.id;
          this.logger.log(
            `Task ${taskId} updated from Notion page ${notionPageId}`,
          );
        } else {
          // CREATE
          taskData.project_id = defaultProjectId;
          taskData.created_at = new Date().toISOString();

          const { data: newTask, error } = await this.supabase
            .from('task')
            .insert(taskData)
            .select('id')
            .single();

          if (error) {
            throw new Error(`Failed to create task: ${error.message}`);
          }

          taskId = newTask.id;
          this.logger.log(
            `Task ${taskId} created from Notion page ${notionPageId}`,
          );

          // 새로 생성된 Task를 캐시에 추가
          existingTasksMap.set(notionPageId, { id: taskId, ...taskData });
        }

        // 성공 로그
        await this.syncLogService.logSyncComplete(
          notionPageId,
          SyncDirection.NOTION_TO_APP,
        );

        return { status: 'success', taskId, notionPageId };
      } catch (error: any) {
        lastError = error.message;
        this.logger.warn(
          `Notion sync attempt ${attempt + 1}/${MANUAL_SYNC_RETRY_CONFIG.maxRetries} failed for page ${notionPageId}: ${error.message}`,
        );

        // Rate Limit 에러 처리
        if (isRateLimitError(error)) {
          if (attempt < MANUAL_SYNC_RETRY_CONFIG.maxRetries - 1) {
            const delay = calculateBackoffDelay(
              attempt,
              MANUAL_SYNC_RETRY_CONFIG,
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
      notionPageId,
      SyncDirection.NOTION_TO_APP,
      lastError ?? 'Unknown error',
      MANUAL_SYNC_RETRY_CONFIG.maxRetries,
    );

    return { status: 'failed', notionPageId, error: lastError };
  }

  /**
   * Notion 페이지를 Task 형식으로 파싱
   */
  private parseNotionPage(notionPage: any): ParsedNotionTask {
    const properties = notionPage.properties || {};

    // Title: Task Name (title 타입)
    const title =
      this.extractTitleFromProperty(properties['Task Name']) || 'Untitled';

    // Status: status 타입
    const status = this.extractStatusFromProperty(properties['Status']);

    // Priority: select 타입
    const priority = this.extractSelectFromProperty(properties['Priority']);

    // Due Date: date 타입 (start, end)
    const { startDate, endDate } = this.extractDateFromProperty(
      properties['Due Date'],
    );

    // Tags: multi_select 타입 -> 쉼표 구분 문자열
    const tags = this.extractMultiSelectAsString(properties['Tags']);

    // Description: rich_text 타입
    const content = this.extractRichTextFromProperty(properties['Description']);

    // Assignees: rich_text 타입 -> 쉼표로 분리하여 배열
    const assigneesText = this.extractRichTextFromProperty(
      properties['Assignees'],
    );
    const assignees = assigneesText
      ? assigneesText
          .split(',')
          .map((a) => a.trim())
          .filter((a) => a.length > 0)
      : [];

    // last_edited_time
    const lastEditedTime = new Date(notionPage.last_edited_time);

    return {
      notionPageId: notionPage.id,
      title,
      content,
      status,
      priority,
      startDate,
      endDate,
      tags,
      assignees,
      lastEditedTime,
    };
  }

  /**
   * title 타입 속성에서 plain_text 추출
   */
  private extractTitleFromProperty(property: any): string | null {
    if (!property || property.type !== 'title') return null;
    const titleArray = property.title || [];
    if (titleArray.length === 0) return null;
    return titleArray.map((t: any) => t.plain_text || '').join('');
  }

  /**
   * status 타입 속성에서 name 추출
   */
  private extractStatusFromProperty(property: any): string | null {
    if (!property || property.type !== 'status') return null;
    return property.status?.name || null;
  }

  /**
   * select 타입 속성에서 name 추출
   */
  private extractSelectFromProperty(property: any): string | null {
    if (!property || property.type !== 'select') return null;
    return property.select?.name || null;
  }

  /**
   * date 타입 속성에서 start, end 추출
   */
  private extractDateFromProperty(property: any): {
    startDate: string | null;
    endDate: string | null;
  } {
    if (!property || property.type !== 'date' || !property.date) {
      return { startDate: null, endDate: null };
    }
    return {
      startDate: property.date.start || null,
      endDate: property.date.end || null,
    };
  }

  /**
   * multi_select 타입을 쉼표 구분 문자열로 변환
   */
  private extractMultiSelectAsString(property: any): string | null {
    if (!property || property.type !== 'multi_select') return null;
    const items = property.multi_select || [];
    if (items.length === 0) return null;
    return items.map((item: any) => item.name).join(',');
  }

  /**
   * rich_text 타입에서 plain_text 추출
   */
  private extractRichTextFromProperty(property: any): string | null {
    if (!property || property.type !== 'rich_text') return null;
    const richTextArray = property.rich_text || [];
    if (richTextArray.length === 0) return null;
    return richTextArray.map((rt: any) => rt.plain_text || '').join('');
  }

  /**
   * workflow_status 캐시 로드
   */
  private async loadWorkflowStatusCache(): Promise<
    Map<string, { id: string; name: string }>
  > {
    const { data: statuses, error } = await this.supabase
      .from('workflow_status')
      .select('id, name');

    if (error) {
      this.logger.error(
        `Failed to load workflow_status cache: ${error.message}`,
      );
      return new Map();
    }

    const cache = new Map<string, { id: string; name: string }>();
    for (const status of statuses ?? []) {
      cache.set(status.name, { id: status.id, name: status.name });
    }

    this.logger.debug(`Loaded ${cache.size} workflow statuses`);
    return cache;
  }

  /**
   * 기본 프로젝트 ID 조회 (신규 Task 생성 시 사용)
   */
  private async getDefaultProjectId(): Promise<string | null> {
    const { data: projects, error } = await this.supabase
      .from('project')
      .select('id')
      .is('deleted_at', null)
      .limit(1);

    if (error || !projects || projects.length === 0) {
      this.logger.warn('No default project found');
      return null;
    }

    return projects[0].id;
  }

  /**
   * 기존 Task 맵 로드 (notion_page_id -> task)
   */
  private async loadExistingTasksMap(): Promise<Map<string, any>> {
    const { data: tasks, error } = await this.supabase
      .from('task')
      .select('id, notion_page_id, updated_at')
      .is('deleted_at', null);

    if (error) {
      this.logger.error(`Failed to load existing tasks map: ${error.message}`);
      return new Map();
    }

    const map = new Map<string, any>();
    for (const task of tasks ?? []) {
      // notion_page_id가 있는 task만 맵에 추가
      if (task.notion_page_id) {
        map.set(task.notion_page_id, task);
      }
    }

    this.logger.debug(`Loaded ${map.size} existing tasks with notion_page_id`);
    return map;
  }

  /**
   * 지연 유틸리티
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
