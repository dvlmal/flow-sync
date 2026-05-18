import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { SyncModule } from '../sync/sync.module';

/**
 * Task 모듈
 * - Task CRUD API
 * - Sync Queue 연동
 */
@Module({
  imports: [SyncModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
