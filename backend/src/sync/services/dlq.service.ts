import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import {
  SyncJobData,
  SyncStatus,
  DlqEntry,
  isRetryableError,
} from '../../common/types/sync.types';
import {
  SYNC_QUEUE_NAME,
  DLQ_QUEUE_NAME,
  TIME_CONSTANTS,
  JOB_RETENTION,
} from '../constants/queue.constants';

/**
 * Dead Letter Queue 서비스
 * - 실패한 동기화 Job 관리
 * - 수동/자동 재처리 메커니즘
 * - 모니터링 및 알림
 */
@Injectable()
export class DlqService {
  private readonly logger = new Logger(DlqService.name);

  constructor(
    @InjectQueue(SYNC_QUEUE_NAME)
    private readonly syncQueue: Queue<SyncJobData>,
    @InjectQueue(DLQ_QUEUE_NAME)
    private readonly dlqQueue: Queue<DlqEntry>,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 실패한 Job을 DLQ로 이동
   */
  async moveToDeadLetterQueue(
    job: Job<SyncJobData>,
    failureReason: string,
  ): Promise<void> {
    const dlqEntry: DlqEntry = {
      originalJob: job.data,
      failureReason,
      failedAt: new Date(),
      totalAttempts: job.attemptsMade,
      isRetryable: isRetryableError({ message: failureReason }),
    };

    await this.dlqQueue.add('dlq-entry', dlqEntry, {
      removeOnComplete: false, // DLQ는 수동 처리까지 보관
    });

    // DB에도 기록
    await this.prisma.sync_log.create({
      data: {
        task_id: job.data.taskId,
        direction: 'APP_TO_NOTION',
        sync_status: SyncStatus.IN_DLQ,
        error_message: failureReason.substring(0, 1000),
        retry_count: job.attemptsMade,
        synced_at: new Date(),
      },
    });

    this.logger.warn(
      `Job ${job.id} moved to DLQ: ${failureReason} (${job.attemptsMade} attempts)`,
    );
  }

  /**
   * DLQ 항목 재처리 시도
   * - DB에서 최신 Task 데이터를 조회하여 Payload 재구성 (데이터 롤백 방지)
   */
  async retryDlqEntry(dlqJobId: string): Promise<boolean> {
    try {
      const dlqJob = await this.dlqQueue.getJob(dlqJobId);
      if (!dlqJob) {
        this.logger.warn(`DLQ job not found: ${dlqJobId}`);
        return false;
      }

      const entry = dlqJob.data;
      const { taskId, operation } = entry.originalJob;

      // DB에서 최신 Task 데이터 조회 (과거 데이터로 인한 롤백 방지)
      const currentTask = await this.prisma.task.findUnique({
        where: { id: taskId },
        include: {
          project: true,
          workflow_status: true,
        },
      });

      // Task가 삭제된 경우
      if (!currentTask) {
        // DELETE 작업이 아닌 경우 DLQ에서 제거 (Task가 이미 삭제됨)
        if (operation !== 'DELETE') {
          this.logger.warn(`Task ${taskId} not found, removing DLQ entry`);
          await dlqJob.remove();
          return true;
        }
      }

      // 최신 데이터로 Payload 재구성
      const updatedPayload = currentTask
        ? {
            title: currentTask.title,
            content: currentTask.content ?? undefined,
            status: currentTask.workflow_status?.name,
            priority: currentTask.priority ?? undefined,
            startDate: currentTask.start_date?.toISOString().split('T')[0],
            endDate: currentTask.end_date?.toISOString().split('T')[0],
            assignees: currentTask.assignees as string[] | undefined,
            tags: currentTask.tags ? currentTask.tags.split(',') : undefined,
          }
        : entry.originalJob.payload;

      // 새 Job 생성 (최신 데이터 사용)
      const newJob = await this.syncQueue.add(
        operation,
        {
          ...entry.originalJob,
          payload: updatedPayload,
          notionPageId:
            currentTask?.notion_page_id ?? entry.originalJob.notionPageId,
          retryCount: 0, // 재시도 카운트 리셋
          createdAt: new Date(),
        },
        {
          attempts: JOB_RETENTION.DLQ_RETRY_ATTEMPTS,
        },
      );

      // DLQ Job 제거
      await dlqJob.remove();

      this.logger.log(
        `DLQ entry ${dlqJobId} requeued as ${newJob.id} with fresh data`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to retry DLQ entry ${dlqJobId}: ${error.message}`,
      );
      return false;
    }
  }

  /**
   * 모든 재시도 가능한 DLQ 항목 재처리
   */
  async retryAllRetryable(): Promise<{ success: number; failed: number }> {
    const jobs = await this.dlqQueue.getJobs(['waiting', 'delayed']);
    let success = 0;
    let failed = 0;

    for (const job of jobs) {
      if (job.data.isRetryable) {
        const result = await this.retryDlqEntry(job.id as string);
        if (result) {
          success++;
        } else {
          failed++;
        }
      }
    }

    this.logger.log(`Retried ${success} DLQ entries, ${failed} failed`);
    return { success, failed };
  }

  /**
   * DLQ 상태 조회
   */
  async getDlqStatus() {
    const [waiting, total] = await Promise.all([
      this.dlqQueue.getWaitingCount(),
      this.dlqQueue.getJobCounts(),
    ]);

    // DB에서 최근 DLQ 통계 (24시간)
    const recentDlqCount = await this.prisma.sync_log.count({
      where: {
        sync_status: SyncStatus.IN_DLQ,
        synced_at: {
          gte: new Date(Date.now() - TIME_CONSTANTS.ONE_DAY_MS),
        },
      },
    });

    return {
      queueCounts: total,
      waiting,
      recentDlqCount,
    };
  }

  /**
   * DLQ 항목 목록 조회
   */
  async getDlqEntries(limit = 50): Promise<
    Array<{
      jobId: string;
      entry: DlqEntry;
    }>
  > {
    const jobs = await this.dlqQueue.getJobs(['waiting', 'delayed'], 0, limit);

    return jobs.map((job) => ({
      jobId: job.id as string,
      entry: job.data,
    }));
  }

  /**
   * DLQ 항목 영구 삭제
   */
  async deleteDlqEntry(dlqJobId: string): Promise<boolean> {
    try {
      const job = await this.dlqQueue.getJob(dlqJobId);
      if (!job) {
        return false;
      }

      await job.remove();
      this.logger.log(`DLQ entry ${dlqJobId} deleted`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to delete DLQ entry ${dlqJobId}: ${error.message}`,
      );
      return false;
    }
  }

  /**
   * 오래된 DLQ 항목 정리 (7일 이상)
   */
  async cleanupOldEntries(): Promise<number> {
    const jobs = await this.dlqQueue.getJobs(['waiting', 'delayed']);
    const cutoffDate = new Date(
      Date.now() - TIME_CONSTANTS.SEVEN_DAYS_SEC * 1000,
    );
    let deletedCount = 0;

    for (const job of jobs) {
      if (new Date(job.data.failedAt) < cutoffDate) {
        await job.remove();
        deletedCount++;
      }
    }

    this.logger.log(`Cleaned up ${deletedCount} old DLQ entries`);
    return deletedCount;
  }
}
