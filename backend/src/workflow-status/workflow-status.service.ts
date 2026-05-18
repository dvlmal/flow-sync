import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

  constructor(private readonly prisma: PrismaService) {}

  /**
   * WorkflowStatus 생성
   */
  async create(dto: CreateWorkflowStatusDto) {
    this.logger.log(
      `Creating workflow status: ${dto.name} for project ${dto.projectId}`,
    );

    // 프로젝트 존재 여부 확인
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project not found: ${dto.projectId}`);
    }

    // 같은 프로젝트 내 이름 중복 체크
    const existing = await this.prisma.workflow_status.findFirst({
      where: {
        project_id: dto.projectId,
        name: dto.name,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Workflow status with name '${dto.name}' already exists in this project`,
      );
    }

    // sortOrder가 지정되지 않으면 마지막 순서로 설정
    let sortOrder = dto.sortOrder;
    if (sortOrder === undefined) {
      const lastStatus = await this.prisma.workflow_status.findFirst({
        where: { project_id: dto.projectId },
        orderBy: { sort_ordr: 'desc' },
      });
      sortOrder = (lastStatus?.sort_ordr ?? -1) + 1;
    }

    const status = await this.prisma.workflow_status.create({
      data: {
        project_id: dto.projectId,
        name: dto.name,
        sort_ordr: sortOrder,
        notion_option_id: dto.notionOptionId,
      },
      include: {
        project: true,
        _count: {
          select: { task: true },
        },
      },
    });

    this.logger.log(`Workflow status created: ${status.id}`);
    return this.formatStatusResponse(status);
  }

  /**
   * 프로젝트별 WorkflowStatus 목록 조회
   */
  async findByProject(projectId: string) {
    const statuses = await this.prisma.workflow_status.findMany({
      where: { project_id: projectId },
      orderBy: { sort_ordr: 'asc' },
      include: {
        _count: {
          select: { task: true },
        },
      },
    });

    return statuses.map((status) => this.formatStatusResponse(status));
  }

  /**
   * WorkflowStatus 단건 조회
   */
  async findOne(id: string) {
    const status = await this.prisma.workflow_status.findUnique({
      where: { id },
      include: {
        project: true,
        _count: {
          select: { task: true },
        },
      },
    });

    if (!status) {
      throw new NotFoundException(`Workflow status not found: ${id}`);
    }

    return this.formatStatusResponse(status);
  }

  /**
   * WorkflowStatus 수정
   */
  async update(id: string, dto: UpdateWorkflowStatusDto) {
    this.logger.log(`Updating workflow status: ${id}`);

    const existing = await this.prisma.workflow_status.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Workflow status not found: ${id}`);
    }

    // 이름 변경 시 중복 체크
    if (dto.name && dto.name !== existing.name) {
      const duplicate = await this.prisma.workflow_status.findFirst({
        where: {
          project_id: existing.project_id,
          name: dto.name,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw new ConflictException(
          `Workflow status with name '${dto.name}' already exists in this project`,
        );
      }
    }

    const status = await this.prisma.workflow_status.update({
      where: { id },
      data: {
        name: dto.name,
        sort_ordr: dto.sortOrder,
        notion_option_id: dto.notionOptionId,
      },
      include: {
        project: true,
        _count: {
          select: { task: true },
        },
      },
    });

    this.logger.log(`Workflow status updated: ${status.id}`);
    return this.formatStatusResponse(status);
  }

  /**
   * WorkflowStatus 순서 일괄 변경
   */
  async reorder(projectId: string, statusIds: string[]) {
    this.logger.log(`Reordering workflow statuses for project: ${projectId}`);

    await this.prisma.$transaction(
      statusIds.map((id, index) =>
        this.prisma.workflow_status.update({
          where: { id },
          data: { sort_ordr: index },
        }),
      ),
    );

    return this.findByProject(projectId);
  }

  /**
   * WorkflowStatus 삭제
   * - 연결된 Task의 status_id는 null로 설정됨 (Cascade)
   */
  async remove(id: string) {
    this.logger.log(`Deleting workflow status: ${id}`);

    const existing = await this.prisma.workflow_status.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Workflow status not found: ${id}`);
    }

    await this.prisma.workflow_status.delete({
      where: { id },
    });

    this.logger.log(`Workflow status deleted: ${id}`);
    return { success: true, id };
  }

  /**
   * WorkflowStatus 응답 형식 포맷
   */
  private formatStatusResponse(status: any) {
    return {
      id: status.id,
      projectId: status.project_id,
      projectTitle: status.project?.title,
      name: status.name,
      sortOrder: status.sort_ordr,
      notionOptionId: status.notion_option_id,
      taskCount: status._count?.task ?? 0,
    };
  }
}
