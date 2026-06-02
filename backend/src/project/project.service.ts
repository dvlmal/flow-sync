import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

/**
 * Project 서비스
 * - Supabase CRUD 작업
 * - Notion Database 연동 관리
 */
@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Project 생성
   */
  async create(dto: CreateProjectDto) {
    this.logger.log(`Creating project: ${dto.title}`);

    // Notion DB ID 중복 체크
    const { data: existing } = await this.supabase.client
      .from('project')
      .select('id')
      .eq('notion_db_id', dto.notionDbId)
      .single();

    if (existing) {
      throw new ConflictException(
        `Project with Notion Database ID already exists: ${dto.notionDbId}`,
      );
    }

    const { data: project, error } = await this.supabase.client
      .from('project')
      .insert({
        title: dto.title,
        description: dto.description,
        notion_db_id: dto.notionDbId,
      })
      .select('*')
      .single();

    if (error) {
      this.logger.error(`Failed to create project: ${error.message}`);
      throw error;
    }

    this.logger.log(`Project created: ${project.id}`);
    return this.findOne(project.id);
  }

  /**
   * Project 목록 조회
   */
  async findAll() {
    const { data: projects, error } = await this.supabase.client
      .from('project')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error(`Failed to fetch projects: ${error.message}`);
      throw error;
    }

    // 각 프로젝트별로 workflow_status와 task count 조회
    const result = await Promise.all(
      (projects ?? []).map(async (project) => {
        const [statusesResult, taskCountResult] = await Promise.all([
          this.supabase.client
            .from('workflow_status')
            .select('*')
            .eq('project_id', project.id)
            .order('sort_ordr', { ascending: true }),
          this.supabase.client
            .from('task')
            .select('id', { count: 'exact', head: true })
            .eq('project_id', project.id)
            .is('deleted_at', null),
        ]);

        return this.formatProjectResponse(
          project,
          statusesResult.data ?? [],
          taskCountResult.count ?? 0,
        );
      }),
    );

    return result;
  }

  /**
   * Project 단건 조회
   */
  async findOne(id: string) {
    const { data: project, error } = await this.supabase.client
      .from('project')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !project) {
      throw new NotFoundException(`Project not found: ${id}`);
    }

    const [statusesResult, taskCountResult] = await Promise.all([
      this.supabase.client
        .from('workflow_status')
        .select('*')
        .eq('project_id', id)
        .order('sort_ordr', { ascending: true }),
      this.supabase.client
        .from('task')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', id)
        .is('deleted_at', null),
    ]);

    return this.formatProjectResponse(
      project,
      statusesResult.data ?? [],
      taskCountResult.count ?? 0,
    );
  }

  /**
   * Notion DB ID로 Project 조회
   */
  async findByNotionDbId(notionDbId: string) {
    const { data: project, error } = await this.supabase.client
      .from('project')
      .select('*')
      .eq('notion_db_id', notionDbId)
      .single();

    if (error || !project) {
      throw new NotFoundException(
        `Project not found with Notion DB ID: ${notionDbId}`,
      );
    }

    const [statusesResult, taskCountResult] = await Promise.all([
      this.supabase.client
        .from('workflow_status')
        .select('*')
        .eq('project_id', project.id)
        .order('sort_ordr', { ascending: true }),
      this.supabase.client
        .from('task')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', project.id)
        .is('deleted_at', null),
    ]);

    return this.formatProjectResponse(
      project,
      statusesResult.data ?? [],
      taskCountResult.count ?? 0,
    );
  }

  /**
   * Project 수정
   */
  async update(id: string, dto: UpdateProjectDto) {
    this.logger.log(`Updating project: ${id}`);

    // 존재 여부 확인
    await this.findOne(id);

    const { error } = await this.supabase.client
      .from('project')
      .update({
        title: dto.title,
        description: dto.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      this.logger.error(`Failed to update project: ${error.message}`);
      throw error;
    }

    this.logger.log(`Project updated: ${id}`);
    return this.findOne(id);
  }

  /**
   * Project 삭제
   * - Cascade로 연결된 Task, WorkflowStatus도 삭제됨
   */
  async remove(id: string) {
    this.logger.log(`Deleting project: ${id}`);

    // 존재 여부 확인
    await this.findOne(id);

    const { error } = await this.supabase.client.from('project').delete().eq('id', id);

    if (error) {
      this.logger.error(`Failed to delete project: ${error.message}`);
      throw error;
    }

    this.logger.log(`Project deleted: ${id}`);
    return { success: true, id };
  }

  /**
   * Project 응답 형식 포맷
   */
  private formatProjectResponse(
    project: any,
    statuses: any[],
    taskCount: number,
  ) {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      notionDbId: project.notion_db_id,
      workflowStatuses: statuses.map((status) => ({
        id: status.id,
        name: status.name,
        sortOrder: status.sort_ordr,
        notionOptionId: status.notion_option_id,
      })),
      taskCount,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    };
  }
}
