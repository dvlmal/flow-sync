import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SyncQueueService } from './services/sync-queue.service';
import { NotionSyncService } from './services/notion-sync.service';
import { SyncLogService } from './services/sync-log.service';
import { DlqService } from './services/dlq.service';
import { SyncProcessor } from './processors/sync.processor';
import { SyncController } from './sync.controller';
import { NotionModule } from '../notion/notion.module';
import { SYNC_QUEUE_NAME, DLQ_QUEUE_NAME } from './constants/queue.constants';

/**
 * 동기화 모듈
 * - BullMQ 큐 관리
 * - Notion 동기화 Worker
 * - DLQ 처리
 */
@Module({
  imports: [
    // Sync Queue 등록
    BullModule.registerQueue({
      name: SYNC_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: {
          age: 24 * 60 * 60, // 24시간
          count: 1000,
        },
        removeOnFail: {
          age: 7 * 24 * 60 * 60, // 7일
        },
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
    // DLQ 등록
    BullModule.registerQueue({
      name: DLQ_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: false,
        removeOnFail: false,
      },
    }),
    // NotionService 사용을 위해 import
    NotionModule,
  ],
  controllers: [SyncController],
  providers: [
    SyncQueueService,
    NotionSyncService,
    SyncLogService,
    DlqService,
    SyncProcessor,
  ],
  exports: [SyncQueueService, SyncLogService],
})
export class SyncModule {}
