import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServerlessManualSyncService } from './services/serverless-manual-sync.service';
import { ServerlessSyncLogService } from './services/serverless-sync-log.service';
import { ManualSyncDto } from './dto/manual-sync.dto';

/**
 * Serverless 동기화 API 컨트롤러
 * - BullMQ/Redis 없이 Vercel에서 작동
 * - 수동 동기화 및 동기화 로그 조회 기능 제공
 */
@Controller('api/sync')
export class ServerlessSyncController {
  constructor(
    private readonly manualSyncService: ServerlessManualSyncService,
    private readonly syncLogService: ServerlessSyncLogService,
  ) {}

  /**
   * 수동 동기화 실행
   * POST /api/sync/manual
   *
   * @param dto - 동기화 옵션
   * @param dto.taskId - 특정 Task ID (선택, 없으면 전체 동기화)
   * @param dto.direction - 동기화 방향 (선택, 기본값: APP_TO_NOTION)
   *
   * @returns 동기화 결과
   */
  @Post('manual')
  @HttpCode(HttpStatus.OK)
  async executeManualSync(@Body() dto: ManualSyncDto) {
    return this.manualSyncService.executeManualSync(dto);
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

  /**
   * 최근 동기화 로그 조회
   * GET /api/sync/logs?limit=50
   */
  @Get('logs')
  async getRecentLogs(@Query('limit') limit?: string) {
    return this.syncLogService.getRecentLogs(limit ? parseInt(limit, 10) : 50);
  }

  /**
   * Serverless 환경 정보 (큐 관련 기능 없음 안내)
   * GET /api/sync/queue/status
   */
  @Get('queue/status')
  async getQueueStatus() {
    return {
      message:
        'Queue functionality is not available in serverless environment',
      environment: 'vercel',
      availableFeatures: ['manual-sync', 'sync-history', 'sync-stats'],
      unavailableFeatures: [
        'queue-status',
        'queue-pause',
        'queue-resume',
        'dlq-management',
      ],
    };
  }

  /**
   * DLQ 상태 - Serverless 환경 안내
   * GET /api/sync/dlq/status
   */
  @Get('dlq/status')
  async getDlqStatus() {
    return {
      message: 'DLQ functionality is not available in serverless environment',
      environment: 'vercel',
      suggestion:
        'For DLQ management, please use a dedicated sync worker server',
    };
  }
}
