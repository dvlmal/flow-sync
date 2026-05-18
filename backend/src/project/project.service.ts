import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

/**
 * Project 서비스
 * - PostgreSQL CRUD 작업
 * - Notion Database 연동 관리
 */
@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Project 생성
   */
  async create(dto: CreateProjectDto) {
    this.logger.log(`Creating project: ${dto.title}`);

    // Notion DB ID 중복 체크
    const existing = await this.prisma.project.findUnique({
      where: { notion_db_id: dto.notionDbId },
    });

    if (existing) {
      throw new ConflictException(
        `Project with Notion Database ID already exists: ${dto.notionDbId}`,
      );
    }

    const project = await this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        notion_db_id: dto.notionDbId,
      },
      include: {
        workflow_status: {
          orderBy: { sort_ordr: 'asc' },
        },
        _count: {
          select: { task: true },
        },
      },
    });

    this.logger.log(`Project created: ${project.id}`);
    return this.formatProjectResponse(project);
  }

  /**
   * Project 목록 조회
   */
  async findAll() {
    const projects = await this.prisma.project.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        workflow_status: {
          orderBy: { sort_ordr: 'asc' },
        },
        _count: {
          select: { task: true },
        },
      },
    });

    return projects.map((project) => this.formatProjectResponse(project));
  }

  /**
   * Project 단건 조회
   */
  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        workflow_status: {
          orderBy: { sort_ordr: 'asc' },
        },
        _count: {
          select: { task: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project not found: ${id}`);
    }

    return this.formatProjectResponse(project);
  }

  /**
   * Notion DB ID로 Project 조회
   */
  async findByNotionDbId(notionDbId: string) {
    const project = await this.prisma.project.findUnique({
      where: { notion_db_id: notionDbId },
      include: {
        workflow_status: {
          orderBy: { sort_ordr: 'asc' },
        },
        _count: {
          select: { task: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(
        `Project not found with Notion DB ID: ${notionDbId}`,
      );
    }

    return this.formatProjectResponse(project);
  }

  /**
   * Project 수정
   */
  async update(id: string, dto: UpdateProjectDto) {
    this.logger.log(`Updating project: ${id}`);

    const existing = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Project not found: ${id}`);
    }

    const project = await this.prisma.project.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        updated_at: new Date(),
      },
      include: {
        workflow_status: {
          orderBy: { sort_ordr: 'asc' },
        },
        _count: {
          select: { task: true },
        },
      },
    });

    this.logger.log(`Project updated: ${project.id}`);
    return this.formatProjectResponse(project);
  }

  /**
   * Project 삭제
   * - Cascade로 연결된 Task, WorkflowStatus도 삭제됨
   */
  async remove(id: string) {
    this.logger.log(`Deleting project: ${id}`);

    const existing = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Project not found: ${id}`);
    }

    await this.prisma.project.delete({
      where: { id },
    });

    this.logger.log(`Project deleted: ${id}`);
    return { success: true, id };
  }

  /**
   * Project 응답 형식 포맷
   */
  private formatProjectResponse(project: any) {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      notionDbId: project.notion_db_id,
      workflowStatuses: project.workflow_status?.map((status: any) => ({
        id: status.id,
        name: status.name,
        sortOrder: status.sort_ordr,
        notionOptionId: status.notion_option_id,
      })),
      taskCount: project._count?.task ?? 0,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    };
  }
}
