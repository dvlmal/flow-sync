import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { WorkflowStatusService } from './workflow-status.service';
import { CreateWorkflowStatusDto } from './dto/create-workflow-status.dto';
import { UpdateWorkflowStatusDto } from './dto/update-workflow-status.dto';

/**
 * WorkflowStatus CRUD API 컨트롤러
 */
@Controller('api/workflow-statuses')
export class WorkflowStatusController {
  constructor(private readonly workflowStatusService: WorkflowStatusService) {}

  /**
   * WorkflowStatus 생성
   * POST /api/workflow-statuses
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) dto: CreateWorkflowStatusDto) {
    return this.workflowStatusService.create(dto);
  }

  /**
   * 프로젝트별 WorkflowStatus 목록 조회
   * GET /api/workflow-statuses/project/:projectId
   */
  @Get('project/:projectId')
  async findByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.workflowStatusService.findByProject(projectId);
  }

  /**
   * WorkflowStatus 단건 조회
   * GET /api/workflow-statuses/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.workflowStatusService.findOne(id);
  }

  /**
   * WorkflowStatus 수정
   * PUT /api/workflow-statuses/:id
   */
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) dto: UpdateWorkflowStatusDto,
  ) {
    return this.workflowStatusService.update(id, dto);
  }

  /**
   * WorkflowStatus 순서 일괄 변경
   * PUT /api/workflow-statuses/project/:projectId/reorder
   */
  @Put('project/:projectId/reorder')
  async reorder(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: { statusIds: string[] },
  ) {
    return this.workflowStatusService.reorder(projectId, body.statusIds);
  }

  /**
   * WorkflowStatus 삭제
   * DELETE /api/workflow-statuses/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.workflowStatusService.remove(id);
  }
}
