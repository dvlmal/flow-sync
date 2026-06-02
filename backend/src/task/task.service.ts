import { Injectable, Logger, NotFoundException, Optional } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
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
 * - Supabase CRUD 작업
 * - Notion 동기화 큐 연동 (Redis 사용 가능 시)
 * - Last Write Wins 충돌 해결
 */
@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  private syncQueueService: ISyncQueueService | null = null;

  constructor(
    private readonly supabase: SupabaseService,
    @Optional() syncQueue?: ISyncQueueService,
  ) {
    this.syncQueueService = syncQueue ?? null;
    if (!this.syncQueueService) {
      this.logger.warn(
        'SyncQueueService not available - sync features disabled',
      );
    }
  }

  /**
   * Task 생성
   */
  async create(dto: CreateTaskDto) {
    this.logger.log(`Creating task: ${dto.title}`);

    const { data: task, error } = await this.supabase
      .from('task')
      .insert({
        title: dto.title,
        content: dto.content,
        project_id: dto.projectId,
        status_id: dto.statusId,
        priority: dto.priority,
        start_date: dto.startDate,
        end_date: dto.endDate,
        assignees: dto.assignees,
        tags: dto.tags ? dto.tags.join(',') : null,
        notion_page_id: null,
      })
      .select('*')
      .single();

    if (error) {
      this.logger.error(`Failed to create task: ${error.message}`);
      throw error;
    }

    // 관계 데이터 조회
    const taskWithRelations = await this.findOneInternal(task.id);

    // Sync Queue에 CREATE Job 등록
    if (this.syncQueueService) {
      const syncPayload = this.buildSyncPayload(taskWithRelations);
      await this.syncQueueService.addCreateJob(task.id, syncPayload);
    }

    this.logger.log(`Task created: ${task.id}`);
    return this.formatTaskResponse(taskWithRelations);
  }

  /**
   * Task 목록 조회 (페이지네이션)
   */
  async findAll(query: TaskQueryDto) {
    const { projectId, statusId, priority, search, sortBy, sortOrder } = query;

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const offset = (page - 1) * limit;

    let queryBuilder = this.supabase
      .from('task')
      .select(
        `
        *,
        project:project_id(*),
        workflow_status:status_id(*)
      `,
        { count: 'exact' },
      )
      .is('deleted_at', null);

    if (projectId) queryBuilder = queryBuilder.eq('project_id', projectId);
    if (statusId) queryBuilder = queryBuilder.eq('status_id', statusId);
    if (priority) queryBuilder = queryBuilder.eq('priority', priority);
    if (search) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${search}%,content.ilike.%${search}%`,
      );
    }

    queryBuilder = queryBuilder
      .order(sortBy ?? 'created_at', { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    const { data: tasks, error, count } = await queryBuilder;

    if (error) {
      this.logger.error(`Failed to fetch tasks: ${error.message}`);
      throw error;
    }

    const total = count ?? 0;

    return {
      data: (tasks ?? []).map((task) => this.formatTaskResponse(task)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Task 단건 조회
   */
  async findOne(id: string, includeDeleted = false) {
    const task = await this.findOneInternal(id, includeDeleted);
    return this.formatTaskResponse(task);
  }

  /**
   * Task 수정
   */
  async update(id: string, dto: UpdateTaskDto) {
    this.logger.log(`Updating task: ${id}`);

    // 존재 여부 확인
    const existing = await this.findOneInternal(id);

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.projectId !== undefined) updateData.project_id = dto.projectId;
    if (dto.statusId !== undefined) updateData.status_id = dto.statusId;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.startDate !== undefined) updateData.start_date = dto.startDate;
    if (dto.endDate !== undefined) updateData.end_date = dto.endDate;
    if (dto.assignees !== undefined) updateData.assignees = dto.assignees;
    if (dto.tags !== undefined) updateData.tags = dto.tags.join(',');

    const { error } = await this.supabase
      .from('task')
      .update(updateData)
      .eq('id', id);

    if (error) {
      this.logger.error(`Failed to update task: ${error.message}`);
      throw error;
    }

    const task = await this.findOneInternal(id);

    // Notion Page ID가 있으면 UPDATE Job 등록
    if (existing.notion_page_id && this.syncQueueService) {
      const syncPayload = this.buildSyncPayload(task);
      await this.syncQueueService.addUpdateJob(
        task.id,
        existing.notion_page_id,
        syncPayload,
      );
    }

    this.logger.log(`Task updated: ${id}`);
    return this.formatTaskResponse(task);
  }

  /**
   * Task 삭제 (Soft Delete)
   */
  async remove(id: string) {
    this.logger.log(`Soft deleting task: ${id}`);

    const existing = await this.findOneInternal(id);

    if (existing.deleted_at) {
      throw new NotFoundException(`Task already deleted: ${id}`);
    }

    const notionPageId = existing.notion_page_id;

    const { error } = await this.supabase
      .from('task')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      this.logger.error(`Failed to delete task: ${error.message}`);
      throw error;
    }

    if (notionPageId && this.syncQueueService) {
      await this.syncQueueService.addDeleteJob(id, notionPageId);
    }

    this.logger.log(`Task soft deleted: ${id}`);
    return { success: true, id };
  }

  /**
   * Task 영구 삭제 (Hard Delete)
   */
  async hardDelete(id: string) {
    this.logger.log(`Hard deleting task: ${id}`);

    await this.findOneInternal(id, true);

    const { error } = await this.supabase.from('task').delete().eq('id', id);

    if (error) {
      this.logger.error(`Failed to hard delete task: ${error.message}`);
      throw error;
    }

    this.logger.log(`Task hard deleted: ${id}`);
    return { success: true, id };
  }

  /**
   * 삭제된 Task 복원
   */
  async restore(id: string) {
    this.logger.log(`Restoring task: ${id}`);

    const existing = await this.findOneInternal(id, true);

    if (!existing.deleted_at) {
      throw new NotFoundException(`Task is not deleted: ${id}`);
    }

    const { error } = await this.supabase
      .from('task')
      .update({ deleted_at: null })
      .eq('id', id);

    if (error) {
      this.logger.error(`Failed to restore task: ${error.message}`);
      throw error;
    }

    const task = await this.findOneInternal(id);
    this.logger.log(`Task restored: ${id}`);
    return this.formatTaskResponse(task);
  }

  /**
   * 프로젝트별 Task 통계
   */
  async getProjectStats(projectId: string) {
    const { data: tasks, error } = await this.supabase
      .from('task')
      .select('status_id, priority')
      .eq('project_id', projectId)
      .is('deleted_at', null);

    if (error) {
      this.logger.error(`Failed to get project stats: ${error.message}`);
      throw error;
    }

    const total = tasks?.length ?? 0;

    // status_id별 그룹핑
    const byStatus = (tasks ?? []).reduce(
      (acc, task) => {
        const key = task.status_id ?? 'null';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // priority별 그룹핑
    const byPriority = (tasks ?? []).reduce(
      (acc, task) => {
        const key = task.priority ?? 'null';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total,
      byStatus: Object.entries(byStatus).map(([status_id, count]) => ({
        status_id: status_id === 'null' ? null : status_id,
        _count: count,
      })),
      byPriority: Object.entries(byPriority).map(([priority, count]) => ({
        priority: priority === 'null' ? null : priority,
        _count: count,
      })),
    };
  }

  /**
   * 내부 조회 (관계 포함)
   */
  private async findOneInternal(id: string, includeDeleted = false) {
    let queryBuilder = this.supabase
      .from('task')
      .select(
        `
        *,
        project:project_id(*),
        workflow_status:status_id(*)
      `,
      )
      .eq('id', id);

    if (!includeDeleted) {
      queryBuilder = queryBuilder.is('deleted_at', null);
    }

    const { data: task, error } = await queryBuilder.single();

    if (error || !task) {
      throw new NotFoundException(`Task not found: ${id}`);
    }

    return task;
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
      startDate: task.start_date?.split('T')[0],
      endDate: task.end_date?.split('T')[0],
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
      assignees: task.assignees ?? [],
      tags: task.tags ? task.tags.split(',') : [],
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      deletedAt: task.deleted_at,
    };
  }
}
