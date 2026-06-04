import { Module } from '@nestjs/common';
import { NotionModule } from '../notion/notion.module';
import { ServerlessManualSyncService } from './services/serverless-manual-sync.service';
import { ServerlessNotionSyncService } from './services/serverless-notion-sync.service';
import { ServerlessSyncLogService } from './services/serverless-sync-log.service';
import { ServerlessSyncController } from './serverless-sync.controller';

/**
 * Serverless Sync 모듈
 * - BullMQ/Redis 의존성 없이 수동 동기화 기능 제공
 * - Vercel Serverless Functions에서 사용
 * - 직접 Notion API 호출 방식
 */
@Module({
  imports: [NotionModule],
  controllers: [ServerlessSyncController],
  providers: [
    ServerlessManualSyncService,
    ServerlessNotionSyncService,
    ServerlessSyncLogService,
  ],
  exports: [ServerlessManualSyncService, ServerlessSyncLogService],
})
export class ServerlessSyncModule {}
