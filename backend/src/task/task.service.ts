import { Injectable, Logger, NotFoundException, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { TaskSyncPayload } from '../common/types/sync.types';

// SyncQueueService 타입 (선택적 의존성)
interface ISyncQueueService {
  addCreateJob(taskId: string, payload: TaskSyncPayload): Promise<any>;
  addUpdateJob(
    taskId: string,
    notionPageId: string,
    payload: TaskSyncPayload,
  ): Promise<any>;
  addDeleteJob(taskId: string, notionPageId: string): Promise<any>;
}

/**
 * Task 서비스
 * - PostgreSQL CRUD 작업
 * - Notion 동기화 큐 연동 (Redis 사용 가능 시)
 * - Last Write Wins 충돌 해결
 */
@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  private syncQueueService: ISyncQueueService | null = null;

  constructor(
    private readonly prisma: PrismaService,
    @Optional() syncQueue?: ISyncQueueService,
  ) {
    this.syncQueueService = syncQueue ?? null;
    if (!this.syncQueueService) {
      this.logger.warn('SyncQueueService not available - sync features disabled');
    }
  }

  /**
   * Task 생성
   * - DB에 저장 후 Sync Queue에 Job 등록
   * - notion_page_id는 null로 시작, 동기화 완료 후 Worker에서 업데이트
   */
  async create(dto: CreateTaskDto) {
    this.logger.log(`Creating task: ${dto.title}`);

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        content: dto.content,
        project_id: dto.projectId,
        status_id: dto.statusId,
        priority: dto.priority,
        start_date: dto.startDate ? new Date(dto.startDate) : null,
        end_date: dto.endDate ? new Date(dto.endDate) : null,
        assignees: dto.assignees ? dto.assignees : undefined,
        tags: dto.tags ? dto.tags.join(',') : null,
        notion_page_id: null, // 동기화 완료 전까지 null
      },
      include: {
        project: true,
        workflow_status: true,
      },
    });

    // Sync Queue에 CREATE Job 등록 (Redis 사용 가능 시)
    if (this.syncQueueService) {
      const syncPayload = this.buildSyncPayload(task);
      await this.syncQueueService.addCreateJob(task.id, syncPayload);
    }

    this.logger.log(`Task created: ${task.id}`);
    return this.formatTaskResponse(task);
  }

  /**
   * Task 목록 조회 (페이지네이션)
   * - Soft delete된 Task 제외
   */
  async findAll(query: TaskQueryDto) {
    const {
      projectId,
      statusId,
      priority,
      search,
      sortBy,
      sortOrder,
    } = query;

    // 명시적으로 숫자로 변환 (Query string은 항상 string으로 들어옴)
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      deleted_at: null, // Soft delete된 Task 제외
    };

    if (projectId) where.project_id = projectId;
    if (statusId) where.status_id = statusId;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy ?? 'created_at']: sortOrder ?? 'desc' },
        include: {
          project: true,
          workflow_status: true,
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks.map((task) => this.formatTaskResponse(task)),
      pagination: {
        page: page ?? 1,
        limit: limit ?? 20,
        total,
        totalPages: Math.ceil(total / (limit ?? 20)),
      },
    };
  }

  /**
   * Task 단건 조회
   * - Soft delete된 Task도 조회 가능 (상태 확인용)
   */
  async findOne(id: string, includeDeleted = false) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        workflow_status: true,
        sync_log: {
          orderBy: { synced_at: 'desc' },
          take: 5,
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task not found: ${id}`);
    }

    // Soft delete된 Task 접근 제한 (includeDeleted가 false인 경우)
    if (task.deleted_at && !includeDeleted) {
      throw new NotFoundException(`Task has been deleted: ${id}`);
    }

    return this.formatTaskResponse(task);
  }

  /**
   * Task 수정
   * - Last Write Wins 적용
   * - DB 업데이트 후 Sync Queue에 UPDATE Job 등록
   */
  async update(id: string, dto: UpdateTaskDto) {
    this.logger.log(`Updating task: ${id}`);

    const existing = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Task not found: ${id}`);
    }

    // LWW: 현재 시간으로 updated_at 설정
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
        project_id: dto.projectId,
        status_id: dto.statusId,
        priority: dto.priority,
        start_date: dto.startDate ? new Date(dto.startDate) : undefined,
        end_date: dto.endDate ? new Date(dto.endDate) : undefined,
        assignees: dto.assignees ? dto.assignees : undefined,
        tags: dto.tags ? dto.tags.join(',') : undefined,
        updated_at: new Date(), // LWW timestamp
      },
      include: {
        project: true,
        workflow_status: true,
      },
    });

    // Notion Page ID가 있으면 UPDATE Job 등록 (동기화 완료된 Task만, Redis 사용 가능 시)
    if (task.notion_page_id && this.syncQueueService) {
      const syncPayload = this.buildSyncPayload(task);
      await this.syncQueueService.addUpdateJob(
        task.id,
        task.notion_page_id,
        syncPayload,
      );
    }

    this.logger.log(`Task updated: ${task.id}`);
    return this.formatTaskResponse(task);
  }

  /**
   * Task 삭제 (Soft Delete)
   * - deleted_at 설정 후 Sync Queue에 DELETE Job 등록
   * - Sync 실패 시에도 복구 가능
   */
  async remove(id: string) {
    this.logger.log(`Soft deleting task: ${id}`);

    const existing = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Task not found: ${id}`);
    }

    // 이미 삭제된 Task인 경우
    if (existing.deleted_at) {
      throw new NotFoundException(`Task already deleted: ${id}`);
    }

    // Notion Page ID 백업 (삭제 후 동기화용)
    const notionPageId = existing.notion_page_id;

    // Soft Delete: deleted_at 설정
    await this.prisma.task.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    // Notion Page ID가 있으면 DELETE Job 등록 (동기화 완료된 Task만, Redis 사용 가능 시)
    if (notionPageId && this.syncQueueService) {
      await this.syncQueueService.addDeleteJob(id, notionPageId);
    }

    this.logger.log(`Task soft deleted: ${id}`);
    return { success: true, id };
  }

  /**
   * Task 영구 삭제 (Hard Delete)
   * - Sync 완료 후 또는 강제 삭제 시 사용
   */
  async hardDelete(id: string) {
    this.logger.log(`Hard deleting task: ${id}`);

    const existing = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Task not found: ${id}`);
    }

    await this.prisma.task.delete({
      where: { id },
    });

    this.logger.log(`Task hard deleted: ${id}`);
    return { success: true, id };
  }

  /**
   * 삭제된 Task 복원
   */
  async restore(id: string) {
    this.logger.log(`Restoring task: ${id}`);

    const existing = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Task not found: ${id}`);
    }

    if (!existing.deleted_at) {
      throw new NotFoundException(`Task is not deleted: ${id}`);
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: { deleted_at: null },
      include: {
        project: true,
        workflow_status: true,
      },
    });

    this.logger.log(`Task restored: ${id}`);
    return this.formatTaskResponse(task);
  }

  /**
   * 프로젝트별 Task 통계
   */
  async getProjectStats(projectId: string) {
    const [total, byStatus, byPriority] = await Promise.all([
      this.prisma.task.count({ where: { project_id: projectId } }),
      this.prisma.task.groupBy({
        by: ['status_id'],
        where: { project_id: projectId },
        _count: true,
      }),
      this.prisma.task.groupBy({
        by: ['priority'],
        where: { project_id: projectId },
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus,
      byPriority,
    };
  }

  /**
   * Task -> Notion 동기화 페이로드 빌드
   */
  private buildSyncPayload(task: any): TaskSyncPayload {
    return {
      title: task.title,
      content: task.content,
      status: task.workflow_status?.name,
      priority: task.priority,
      startDate: task.start_date?.toISOString().split('T')[0],
      endDate: task.end_date?.toISOString().split('T')[0],
      assignees: task.assignees as string[] | undefined,
      tags: task.tags ? task.tags.split(',') : undefined,
    };
  }

  /**
   * Task 응답 형식 포맷
   */
  private formatTaskResponse(task: any) {
    return {
      id: task.id,
      title: task.title,
      content: task.content,
      projectId: task.project_id,
      projectTitle: task.project?.title,
      statusId: task.status_id,
      statusName: task.workflow_status?.name,
      notionPageId: task.notion_page_id,
      priority: task.priority,
      startDate: task.start_date,
      endDate: task.end_date,
      assignees: (task.assignees as string[]) ?? [],
      tags: task.tags ? task.tags.split(',') : [],
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      deletedAt: task.deleted_at,
      syncLogs: task.sync_log,
    };
  }
}
