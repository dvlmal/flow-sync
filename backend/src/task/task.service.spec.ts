import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { SyncQueueService } from '../sync/services/sync-queue.service';
import { CreateTaskDto, TaskPriority } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskService', () => {
  let service: TaskService;
  let prismaService: jest.Mocked<PrismaService>;
  let syncQueueService: jest.Mocked<SyncQueueService>;

  const mockTask = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    content: 'Test content',
    project_id: '123e4567-e89b-12d3-a456-426614174001',
    status_id: '123e4567-e89b-12d3-a456-426614174002',
    notion_page_id: 'notion-page-123',
    priority: 'High',
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-01-31'),
    assignees: '["user1", "user2"]',
    tags: 'tag1,tag2',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    project: { title: 'Test Project' },
    workflow_status: { name: 'In Progress' },
  };

  beforeEach(async () => {
    const mockPrismaService = {
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        groupBy: jest.fn(),
      },
    };

    const mockSyncQueueService = {
      addCreateJob: jest.fn().mockResolvedValue({ id: 'job-1' }),
      addUpdateJob: jest.fn().mockResolvedValue({ id: 'job-2' }),
      addDeleteJob: jest.fn().mockResolvedValue({ id: 'job-3' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SyncQueueService, useValue: mockSyncQueueService },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get(PrismaService);
    syncQueueService = module.get(SyncQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task and add sync job', async () => {
      const dto: CreateTaskDto = {
        title: 'New Task',
        content: 'Task content',
        priority: TaskPriority.HIGH,
      };

      const createdTask = {
        ...mockTask,
        title: dto.title,
        content: dto.content,
        notion_page_id: null, // 동기화 전까지 null
      };

      (prismaService.task.create as jest.Mock).mockResolvedValue(createdTask);

      const result = await service.create(dto);

      expect(prismaService.task.create).toHaveBeenCalled();
      expect(syncQueueService.addCreateJob).toHaveBeenCalled();
      expect(result.title).toBe(dto.title);
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const tasks = [mockTask];
      (prismaService.task.findMany as jest.Mock).mockResolvedValue(tasks);
      (prismaService.task.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by projectId', async () => {
      const projectId = '123e4567-e89b-12d3-a456-426614174001';
      (prismaService.task.findMany as jest.Mock).mockResolvedValue([mockTask]);
      (prismaService.task.count as jest.Mock).mockResolvedValue(1);

      await service.findAll({ projectId, page: 1, limit: 20 });

      expect(prismaService.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ project_id: projectId }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

      const result = await service.findOne(mockTask.id);

      expect(result.id).toBe(mockTask.id);
      expect(result.title).toBe(mockTask.title);
    });

    it('should throw NotFoundException when task not found', async () => {
      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a task and add sync job', async () => {
      const dto: UpdateTaskDto = { title: 'Updated Task' };

      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(mockTask);
      (prismaService.task.update as jest.Mock).mockResolvedValue({
        ...mockTask,
        title: dto.title,
      });

      const result = await service.update(mockTask.id, dto);

      expect(prismaService.task.update).toHaveBeenCalled();
      expect(syncQueueService.addUpdateJob).toHaveBeenCalled();
      expect(result.title).toBe(dto.title);
    });

    it('should throw NotFoundException when task not found', async () => {
      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { title: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not add sync job if notion_page_id is null', async () => {
      const taskWithNullNotionId = {
        ...mockTask,
        notion_page_id: null, // 아직 동기화되지 않은 Task
      };

      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(
        taskWithNullNotionId,
      );
      (prismaService.task.update as jest.Mock).mockResolvedValue(
        taskWithNullNotionId,
      );

      await service.update(taskWithNullNotionId.id, { title: 'Test' });

      expect(syncQueueService.addUpdateJob).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft delete a task and add sync job', async () => {
      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(mockTask);
      (prismaService.task.update as jest.Mock).mockResolvedValue({
        ...mockTask,
        deleted_at: new Date(),
      });

      const result = await service.remove(mockTask.id);

      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        data: { deleted_at: expect.any(Date) },
      });
      expect(syncQueueService.addDeleteJob).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should throw NotFoundException when task not found', async () => {
      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when task already deleted', async () => {
      const deletedTask = {
        ...mockTask,
        deleted_at: new Date(),
      };
      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(
        deletedTask,
      );

      await expect(service.remove(mockTask.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('restore', () => {
    it('should restore a soft deleted task', async () => {
      const deletedTask = {
        ...mockTask,
        deleted_at: new Date(),
      };
      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(
        deletedTask,
      );
      (prismaService.task.update as jest.Mock).mockResolvedValue({
        ...mockTask,
        deleted_at: null,
      });

      const result = await service.restore(mockTask.id);

      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        data: { deleted_at: null },
        include: expect.any(Object),
      });
      expect(result.deletedAt).toBeNull();
    });

    it('should throw NotFoundException when task not deleted', async () => {
      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

      await expect(service.restore(mockTask.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
