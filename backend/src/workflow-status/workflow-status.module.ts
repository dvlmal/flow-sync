import { Module } from '@nestjs/common';
import { WorkflowStatusService } from './workflow-status.service';
import { WorkflowStatusController } from './workflow-status.controller';

/**
 * WorkflowStatus 모듈
 * - Kanban 상태 칼럼 CRUD API
 */
@Module({
  controllers: [WorkflowStatusController],
  providers: [WorkflowStatusService],
  exports: [WorkflowStatusService],
})
export class WorkflowStatusModule {}
