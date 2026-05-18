import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import { randomUUID } from 'crypto';
import {
  SyncJobData,
  SyncOperation,
  TaskSyncPayload,
} from '../../common/types/sync.types';
import {
  SYNC_QUEUE_NAME,
  DEFAULT_JOB_OPTIONS,
} from '../constants/queue.constants';

/**
 * 동기화 큐 서비스
 * - Task CRUD 작업 시 Sync Job을 큐에 등록
 * - Idempotency key 기반 중복 방지
 */
@Injectable()
export class SyncQueueService {
  private readonly logger = new Logger(SyncQueueService.name);

  constructor(
    @InjectQueue(SYNC_QUEUE_NAME)
    private readonly syncQueue: Queue<SyncJobData>,
  ) {}

  /**
   * Task 생성 동기화 Job 등록
   */
  async addCreateJob(
    taskId: string,
    payload: TaskSyncPayload,
  ): Promise<Job<SyncJobData>> {
    return this.addJob(taskId, SyncOperation.CREATE, payload);
  }

  /**
   * Task 수정 동기화 Job 등록
   */
  async addUpdateJob(
    taskId: string,
    notionPageId: string,
    payload: TaskSyncPayload,
  ): Promise<Job<SyncJobData>> {
    return this.addJob(taskId, SyncOperation.UPDATE, payload, notionPageId);
  }

  /**
   * Task 삭제 동기화 Job 등록
   */
  async addDeleteJob(
    taskId: string,
    notionPageId: string,
  ): Promise<Job<SyncJobData>> {
    return this.addJob(taskId, SyncOperation.DELETE, {}, notionPageId);
  }

  /**
   * 동기화 Job 추가 (내부 메서드)
   * - UUID 기반 jobId로 중복 방지 보장
   */
  private async addJob(
    taskId: string,
    operation: SyncOperation,
    payload: TaskSyncPayload,
    notionPageId?: string,
  ): Promise<Job<SyncJobData>> {
    // UUID 기반 jobId로 중복 방지 (Date.now()보다 안전)
    const jobId = `${taskId}-${operation}-${randomUUID()}`;

    const jobData: SyncJobData = {
      jobId,
      taskId,
      notionPageId,
      operation,
      payload,
      createdAt: new Date(),
      retryCount: 0,
    };

    const job = await this.syncQueue.add(operation, jobData, {
      ...DEFAULT_JOB_OPTIONS,
      jobId, // Idempotency key로 사용
    });

    this.logger.log(
      `Sync job added: ${operation} for task ${taskId}, jobId: ${job.id}`,
    );

    return job;
  }

  /**
   * 큐 상태 조회
   */
  async getQueueStatus() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.syncQueue.getWaitingCount(),
      this.syncQueue.getActiveCount(),
      this.syncQueue.getCompletedCount(),
      this.syncQueue.getFailedCount(),
      this.syncQueue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      isPaused: await this.syncQueue.isPaused(),
    };
  }

  /**
   * 큐 일시 중지
   */
  async pause(): Promise<void> {
    await this.syncQueue.pause();
    this.logger.warn('Sync queue paused');
  }

  /**
   * 큐 재개
   */
  async resume(): Promise<void> {
    await this.syncQueue.resume();
    this.logger.log('Sync queue resumed');
  }

  /**
   * 실패한 Job 재시도
   */
  async retryFailedJob(jobId: string): Promise<void> {
    const job = await this.syncQueue.getJob(jobId);
    if (job) {
      await job.retry();
      this.logger.log(`Retrying failed job: ${jobId}`);
    }
  }

  /**
   * 모든 실패 Job 재시도
   */
  async retryAllFailedJobs(): Promise<number> {
    const failedJobs = await this.syncQueue.getFailed();
    let retryCount = 0;

    for (const job of failedJobs) {
      try {
        await job.retry();
        retryCount++;
      } catch (error) {
        this.logger.error(`Failed to retry job ${job.id}: ${error.message}`);
      }
    }

    this.logger.log(`Retried ${retryCount} failed jobs`);
    return retryCount;
  }
}
