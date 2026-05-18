import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SyncQueueService } from './services/sync-queue.service';
import { SyncLogService } from './services/sync-log.service';
import { DlqService } from './services/dlq.service';

/**
 * 동기화 관리 API 컨트롤러
 * - 큐 상태 모니터링
 * - DLQ 관리
 * - 동기화 이력 조회
 */
@Controller('api/sync')
export class SyncController {
  constructor(
    private readonly syncQueueService: SyncQueueService,
    private readonly syncLogService: SyncLogService,
    private readonly dlqService: DlqService,
  ) {}

  /**
   * 큐 상태 조회
   * GET /api/sync/queue/status
   */
  @Get('queue/status')
  async getQueueStatus() {
    return this.syncQueueService.getQueueStatus();
  }

  /**
   * 큐 일시 중지
   * POST /api/sync/queue/pause
   */
  @Post('queue/pause')
  @HttpCode(HttpStatus.OK)
  async pauseQueue() {
    await this.syncQueueService.pause();
    return { message: 'Queue paused' };
  }

  /**
   * 큐 재개
   * POST /api/sync/queue/resume
   */
  @Post('queue/resume')
  @HttpCode(HttpStatus.OK)
  async resumeQueue() {
    await this.syncQueueService.resume();
    return { message: 'Queue resumed' };
  }

  /**
   * 실패한 Job 전체 재시도
   * POST /api/sync/queue/retry-failed
   */
  @Post('queue/retry-failed')
  @HttpCode(HttpStatus.OK)
  async retryFailedJobs() {
    const count = await this.syncQueueService.retryAllFailedJobs();
    return { retriedCount: count };
  }

  /**
   * DLQ 상태 조회
   * GET /api/sync/dlq/status
   */
  @Get('dlq/status')
  async getDlqStatus() {
    return this.dlqService.getDlqStatus();
  }

  /**
   * DLQ 항목 목록 조회
   * GET /api/sync/dlq/entries?limit=50
   */
  @Get('dlq/entries')
  async getDlqEntries(@Query('limit') limit?: string) {
    return this.dlqService.getDlqEntries(limit ? parseInt(limit, 10) : 50);
  }

  /**
   * DLQ 항목 재시도
   * POST /api/sync/dlq/:jobId/retry
   */
  @Post('dlq/:jobId/retry')
  @HttpCode(HttpStatus.OK)
  async retryDlqEntry(@Param('jobId') jobId: string) {
    const success = await this.dlqService.retryDlqEntry(jobId);
    return { success };
  }

  /**
   * 재시도 가능한 모든 DLQ 항목 재처리
   * POST /api/sync/dlq/retry-all
   */
  @Post('dlq/retry-all')
  @HttpCode(HttpStatus.OK)
  async retryAllDlq() {
    return this.dlqService.retryAllRetryable();
  }

  /**
   * DLQ 항목 삭제
   * DELETE /api/sync/dlq/:jobId
   */
  @Delete('dlq/:jobId')
  async deleteDlqEntry(@Param('jobId') jobId: string) {
    const success = await this.dlqService.deleteDlqEntry(jobId);
    return { success };
  }

  /**
   * 오래된 DLQ 항목 정리
   * POST /api/sync/dlq/cleanup
   */
  @Post('dlq/cleanup')
  @HttpCode(HttpStatus.OK)
  async cleanupDlq() {
    const deletedCount = await this.dlqService.cleanupOldEntries();
    return { deletedCount };
  }

  /**
   * Task 동기화 이력 조회
   * GET /api/sync/history/:taskId
   */
  @Get('history/:taskId')
  async getSyncHistory(
    @Param('taskId') taskId: string,
    @Query('limit') limit?: string,
  ) {
    return this.syncLogService.getSyncHistory(
      taskId,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  /**
   * 동기화 실패 통계 조회
   * GET /api/sync/stats?hours=24
   */
  @Get('stats')
  async getFailureStats(@Query('hours') hours?: string) {
    const hoursNum = hours ? parseInt(hours, 10) : 24;
    const since = new Date(Date.now() - hoursNum * 60 * 60 * 1000);
    return this.syncLogService.getFailureStats(since);
  }
}
