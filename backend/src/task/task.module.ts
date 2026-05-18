import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

/**
 * Task 모듈
 * - Task CRUD API
 * - Sync Queue 연동 (선택적, Redis 사용 가능 시)
 */
@Module({
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
