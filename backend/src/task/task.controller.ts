import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';

/**
 * Task CRUD API 컨트롤러
 */
@Controller('api/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * Task 생성
   * POST /api/tasks
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) dto: CreateTaskDto) {
    return this.taskService.create(dto);
  }

  /**
   * Task 목록 조회
   * GET /api/tasks?projectId=xxx&page=1&limit=20
   */
  @Get()
  async findAll(@Query(ValidationPipe) query: TaskQueryDto) {
    return this.taskService.findAll(query);
  }

  /**
   * Task 단건 조회
   * GET /api/tasks/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.findOne(id);
  }

  /**
   * Task 수정
   * PUT /api/tasks/:id
   */
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) dto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, dto);
  }

  /**
   * 프로젝트별 Task 통계
   * GET /api/tasks/stats/:projectId
   * Note: 동적 라우트보다 먼저 정의해야 함 (라우트 충돌 방지)
   */
  @Get('stats/:projectId')
  async getProjectStats(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.taskService.getProjectStats(projectId);
  }

  /**
   * Task 삭제 (Soft Delete)
   * DELETE /api/tasks/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.remove(id);
  }

  /**
   * 삭제된 Task 복원
   * POST /api/tasks/:id/restore
   */
  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.restore(id);
  }
}
