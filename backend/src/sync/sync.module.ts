import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SyncQueueService } from './services/sync-queue.service';
import { NotionSyncService } from './services/notion-sync.service';
import { SyncLogService } from './services/sync-log.service';
import { DlqService } from './services/dlq.service';
import { ManualSyncService } from './services/manual-sync.service';
import { SyncProcessor } from './processors/sync.processor';
import { SyncController } from './sync.controller';
import { NotionModule } from '../notion/notion.module';
import { SYNC_QUEUE_NAME, DLQ_QUEUE_NAME } from './constants/queue.constants';
import { SYNC_QUEUE_SERVICE } from '../common/constants/injection-tokens';

/**
 * 동기화 모듈 (Global)
 * - BullMQ 큐 관리
 * - Notion 동기화 Worker
 * - DLQ 처리
 * - Global 모듈로 설정하여 다른 모듈에서 SyncQueueService 사용 가능
 */
@Global()
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
    ManualSyncService,
    SyncProcessor,
    // TaskService에서 injection token으로 주입받을 수 있도록 alias 제공
    {
      provide: SYNC_QUEUE_SERVICE,
      useExisting: SyncQueueService,
    },
  ],
  exports: [
    SyncQueueService,
    SyncLogService,
    ManualSyncService,
    SYNC_QUEUE_SERVICE,
  ],
})
export class SyncModule {}
