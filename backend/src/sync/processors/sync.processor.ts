import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  SyncJobData,
  SyncOperation,
  SyncDirection,
  isRateLimitError,
  isRetryableError,
  calculateBackoffDelay,
} from '../../common/types/sync.types';
import {
  SYNC_QUEUE_NAME,
  DEFAULT_RETRY_CONFIG,
} from '../constants/queue.constants';
import { NotionSyncService } from '../services/notion-sync.service';
import { SyncLogService } from '../services/sync-log.service';
import { DlqService } from '../services/dlq.service';
import { wrapToSyncError } from '../../common/exceptions/sync.exceptions';

/**
 * 동기화 Job Processor (Worker)
 * - BullMQ Worker로 Sync Queue의 Job 처리
 * - Notion API 호출 및 재시도 로직 구현
 * - Rate Limit 대응 (지수 백오프 + 지터)
 */
@Processor(SYNC_QUEUE_NAME, {
  concurrency: 2, // Notion Rate Limit (3/sec) 고려
  limiter: {
    max: 3, // 초당 최대 3개
    duration: 1000,
  },
})
export class SyncProcessor extends WorkerHost {
  private readonly logger = new Logger(SyncProcessor.name);
  private readonly retryConfig = DEFAULT_RETRY_CONFIG;

  constructor(
    private readonly notionSyncService: NotionSyncService,
    private readonly syncLogService: SyncLogService,
    private readonly dlqService: DlqService,
  ) {
    super();
  }

  /**
   * Job 처리 메인 로직
   */
  async process(job: Job<SyncJobData>): Promise<any> {
    const { data } = job;
    this.logger.log(
      `Processing sync job: ${data.operation} for task ${data.taskId} (attempt ${job.attemptsMade + 1})`,
    );

    try {
      // 동기화 로그 생성/업데이트
      await this.syncLogService.logSyncStart(
        data.taskId,
        SyncDirection.APP_TO_NOTION,
      );

      let result: any;

      switch (data.operation) {
        case SyncOperation.CREATE:
          result = await this.notionSyncService.createNotionPage(data.payload);
          break;

        case SyncOperation.UPDATE:
          if (!data.notionPageId) {
            throw new Error('notionPageId is required for UPDATE operation');
          }
          result = await this.notionSyncService.updateNotionPage(
            data.notionPageId,
            data.payload,
          );
          break;

        case SyncOperation.DELETE:
          if (!data.notionPageId) {
            throw new Error('notionPageId is required for DELETE operation');
          }
          result = await this.notionSyncService.archiveNotionPage(
            data.notionPageId,
          );
          break;

        default:
          throw new Error(`Unknown operation: ${data.operation}`);
      }

      // 성공 로그 기록 (트랜잭션으로 Task + SyncLog 함께 업데이트)
      await this.syncLogService.completeSyncWithTransaction(
        data.taskId,
        SyncDirection.APP_TO_NOTION,
        data.operation === SyncOperation.CREATE ? result?.id : undefined,
      );

      this.logger.log(
        `Sync job completed: ${data.operation} for task ${data.taskId}`,
      );

      return {
        success: true,
        notionPageId: result?.id,
        operation: data.operation,
      };
    } catch (error) {
      // 커스텀 SyncError로 래핑
      const syncError = wrapToSyncError(error);

      this.logger.error(
        `Sync job failed: ${data.operation} for task ${data.taskId} - ${syncError.message} [${syncError.errorCode}]`,
      );

      // 에러 로그 기록
      await this.syncLogService.logSyncError(
        data.taskId,
        SyncDirection.APP_TO_NOTION,
        `[${syncError.errorCode}] ${syncError.message}`,
        job.attemptsMade + 1,
      );

      // Rate Limit 에러는 특별 처리
      if (isRateLimitError(error)) {
        const delay = calculateBackoffDelay(job.attemptsMade, this.retryConfig);
        this.logger.warn(
          `Rate limited. Will retry after ${delay}ms (attempt ${job.attemptsMade + 1})`,
        );
        throw error; // BullMQ가 재시도 처리
      }

      // 재시도 가능한 에러이고 최대 재시도 미만인 경우
      if (
        syncError.isRetryable &&
        job.attemptsMade < this.retryConfig.maxRetries - 1
      ) {
        throw error; // BullMQ가 재시도 처리
      }

      // 최대 재시도 도달 또는 재시도 불가능한 에러 - DLQ로 이동
      if (
        job.attemptsMade >= this.retryConfig.maxRetries - 1 ||
        !syncError.isRetryable
      ) {
        await this.moveToDlq(job, syncError.message);
      }

      throw error;
    }
  }

  /**
   * Job을 DLQ로 이동
   */
  private async moveToDlq(
    job: Job<SyncJobData>,
    failureReason: string,
  ): Promise<void> {
    try {
      await this.dlqService.moveToDeadLetterQueue(job, failureReason);
      this.logger.warn(
        `Job ${job.id} moved to DLQ after ${job.attemptsMade + 1} attempts`,
      );
    } catch (dlqError) {
      this.logger.error(
        `Failed to move job ${job.id} to DLQ: ${dlqError.message}`,
      );
    }
  }

  /**
   * Job 완료 이벤트 핸들러
   */
  @OnWorkerEvent('completed')
  onCompleted(job: Job<SyncJobData>) {
    this.logger.log(
      `Job ${job.id} completed: ${job.data.operation} for task ${job.data.taskId}`,
    );
  }

  /**
   * Job 실패 이벤트 핸들러
   * - DLQ 이동은 process 메서드에서 처리되므로 여기서는 로깅만 수행
   */
  @OnWorkerEvent('failed')
  onFailed(job: Job<SyncJobData>, error: Error) {
    const syncError = wrapToSyncError(error);

    this.logger.error(
      `Job ${job.id} failed after ${job.attemptsMade} attempts: ${syncError.message} [${syncError.errorCode}]`,
    );

    // 알림 로직 추가 가능 (Slack, Email 등)
    // TODO: 알림 서비스 연동
  }

  /**
   * Worker 에러 이벤트 핸들러
   */
  @OnWorkerEvent('error')
  onError(error: Error) {
    this.logger.error(`Worker error: ${error.message}`);
  }
}
