import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateWorkflowStatusDto } from './dto/create-workflow-status.dto';
import { UpdateWorkflowStatusDto } from './dto/update-workflow-status.dto';

/**
 * WorkflowStatus 서비스
 * - Kanban 상태 칼럼 관리
 * - Notion Status 옵션과 매핑
 */
@Injectable()
export class WorkflowStatusService {
  private readonly logger = new Logger(WorkflowStatusService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * WorkflowStatus 생성
   */
  async create(dto: CreateWorkflowStatusDto) {
    this.logger.log(
      `Creating workflow status: ${dto.name} for project ${dto.projectId}`,
    );

    // 프로젝트 존재 여부 확인
    const { data: project } = await this.supabase
      .from('project')
      .select('id')
      .eq('id', dto.projectId)
      .single();

    if (!project) {
      throw new NotFoundException(`Project not found: ${dto.projectId}`);
    }

    // 같은 프로젝트 내 이름 중복 체크
    const { data: existing } = await this.supabase
      .from('workflow_status')
      .select('id')
      .eq('project_id', dto.projectId)
      .eq('name', dto.name)
      .single();

    if (existing) {
      throw new ConflictException(
        `Workflow status with name '${dto.name}' already exists in this project`,
      );
    }

    // sortOrder가 지정되지 않으면 마지막 순서로 설정
    let sortOrder = dto.sortOrder;
    if (sortOrder === undefined) {
      const { data: lastStatus } = await this.supabase
        .from('workflow_status')
        .select('sort_ordr')
        .eq('project_id', dto.projectId)
        .order('sort_ordr', { ascending: false })
        .limit(1)
        .single();

      sortOrder = (lastStatus?.sort_ordr ?? -1) + 1;
    }

    const { data: status, error } = await this.supabase
      .from('workflow_status')
      .insert({
        project_id: dto.projectId,
        name: dto.name,
        sort_ordr: sortOrder,
        notion_option_id: dto.notionOptionId,
        color: dto.color ?? 'gray',
      })
      .select('*')
      .single();

    if (error) {
      this.logger.error(`Failed to create workflow status: ${error.message}`);
      throw error;
    }

    this.logger.log(`Workflow status created: ${status.id}`);
    return this.findOne(status.id);
  }

  /**
   * 전체 WorkflowStatus 목록 조회
   */
  async findAll() {
    const { data: statuses, error } = await this.supabase
      .from('workflow_status')
      .select('*')
      .order('project_id', { ascending: true })
      .order('sort_ordr', { ascending: true });

    if (error) {
      this.logger.error(
        `Failed to fetch all workflow statuses: ${error.message}`,
      );
      throw error;
    }

    return (statuses ?? []).map((status) =>
      this.formatStatusResponse(status, 0),
    );
  }

  /**
   * 프로젝트별 WorkflowStatus 목록 조회
   * N+1 쿼리 문제 해결: 단일 쿼리로 task count 계산
   */
  async findByProject(projectId: string) {
    const { data: statuses, error } = await this.supabase
      .from('workflow_status')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_ordr', { ascending: true });

    if (error) {
      this.logger.error(`Failed to fetch workflow statuses: ${error.message}`);
      throw error;
    }

    if (!statuses || statuses.length === 0) {
      return [];
    }

    // 단일 쿼리로 모든 status의 task count를 한 번에 조회
    const statusIds = statuses.map((s) => s.id);
    const { data: taskCounts, error: countError } = await this.supabase
      .from('task')
      .select('status_id')
      .in('status_id', statusIds)
      .is('deleted_at', null);

    if (countError) {
      this.logger.error(`Failed to fetch task counts: ${countError.message}`);
      throw countError;
    }

    // status_id별 task count 집계
    const countMap = new Map<string, number>();
    (taskCounts ?? []).forEach((task) => {
      const currentCount = countMap.get(task.status_id) ?? 0;
      countMap.set(task.status_id, currentCount + 1);
    });

    // 결과 매핑
    return statuses.map((status) =>
      this.formatStatusResponse(status, countMap.get(status.id) ?? 0),
    );
  }

  /**
   * WorkflowStatus 단건 조회
   */
  async findOne(id: string) {
    const { data: status, error } = await this.supabase
      .from('workflow_status')
      .select('*, project:project_id(*)')
      .eq('id', id)
      .single();

    if (error || !status) {
      throw new NotFoundException(`Workflow status not found: ${id}`);
    }

    const { count } = await this.supabase
      .from('task')
      .select('id', { count: 'exact', head: true })
      .eq('status_id', id)
      .is('deleted_at', null);

    return this.formatStatusResponse(status, count ?? 0);
  }

  /**
   * WorkflowStatus 수정
   */
  async update(id: string, dto: UpdateWorkflowStatusDto) {
    this.logger.log(`Updating workflow status: ${id}`);

    const { data: existing, error: findError } = await this.supabase
      .from('workflow_status')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      throw new NotFoundException(`Workflow status not found: ${id}`);
    }

    // 이름 변경 시 중복 체크
    if (dto.name && dto.name !== existing.name) {
      const { data: duplicate } = await this.supabase
        .from('workflow_status')
        .select('id')
        .eq('project_id', existing.project_id)
        .eq('name', dto.name)
        .neq('id', id)
        .single();

      if (duplicate) {
        throw new ConflictException(
          `Workflow status with name '${dto.name}' already exists in this project`,
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.sortOrder !== undefined) updateData.sort_ordr = dto.sortOrder;
    if (dto.notionOptionId !== undefined)
      updateData.notion_option_id = dto.notionOptionId;
    if (dto.color !== undefined) updateData.color = dto.color;

    const { error } = await this.supabase
      .from('workflow_status')
      .update(updateData)
      .eq('id', id);

    if (error) {
      this.logger.error(`Failed to update workflow status: ${error.message}`);
      throw error;
    }

    this.logger.log(`Workflow status updated: ${id}`);
    return this.findOne(id);
  }

  /**
   * WorkflowStatus 순서 일괄 변경
   */
  async reorder(projectId: string, statusIds: string[]) {
    this.logger.log(`Reordering workflow statuses for project: ${projectId}`);

    // 각 status의 sort_ordr를 업데이트
    await Promise.all(
      statusIds.map((id, index) =>
        this.supabase
          .from('workflow_status')
          .update({ sort_ordr: index })
          .eq('id', id),
      ),
    );

    return this.findByProject(projectId);
  }

  /**
   * WorkflowStatus 삭제
   * 참조 무결성 검사: 해당 status를 사용하는 task가 있으면 삭제 거부
   */
  async remove(id: string) {
    this.logger.log(`Deleting workflow status: ${id}`);

    const { data: existing } = await this.supabase
      .from('workflow_status')
      .select('id, name')
      .eq('id', id)
      .single();

    if (!existing) {
      throw new NotFoundException(`Workflow status not found: ${id}`);
    }

    // 참조 무결성 검사: 해당 status를 사용하는 task가 있는지 확인
    const { count: taskCount, error: countError } = await this.supabase
      .from('task')
      .select('id', { count: 'exact', head: true })
      .eq('status_id', id)
      .is('deleted_at', null);

    if (countError) {
      this.logger.error(
        `Failed to check task references: ${countError.message}`,
      );
      throw countError;
    }

    if (taskCount && taskCount > 0) {
      throw new ConflictException(
        `Cannot delete workflow status '${existing.name}': ${taskCount} task(s) are using this status. Please move or delete the tasks first.`,
      );
    }

    const { error } = await this.supabase
      .from('workflow_status')
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error(`Failed to delete workflow status: ${error.message}`);
      throw error;
    }

    this.logger.log(`Workflow status deleted: ${id}`);
    return { success: true, id };
  }

  /**
   * WorkflowStatus 응답 형식 포맷
   */
  private formatStatusResponse(status: any, taskCount: number) {
    return {
      id: status.id,
      projectId: status.project_id,
      projectTitle: status.project?.title,
      name: status.name,
      sortOrder: status.sort_ordr,
      notionOptionId: status.notion_option_id,
      color: status.color ?? 'gray',
      taskCount,
    };
  }
}
