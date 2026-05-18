import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockProject = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Project',
    description: 'Test description',
    notion_db_id: 'notion-db-123',
    created_at: new Date(),
    updated_at: new Date(),
    workflow_status: [
      { id: 'status-1', name: 'To Do', sort_ordr: 0 },
      { id: 'status-2', name: 'Done', sort_ordr: 1 },
    ],
    _count: { task: 5 },
  };

  beforeEach(async () => {
    const mockPrismaService = {
      project: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a project', async () => {
      (prismaService.project.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaService.project.create as jest.Mock).mockResolvedValue(
        mockProject,
      );

      const result = await service.create({
        title: 'Test Project',
        notionDbId: 'notion-db-123',
      });

      expect(result.title).toBe('Test Project');
      expect(result.notionDbId).toBe('notion-db-123');
    });

    it('should throw ConflictException if notionDbId already exists', async () => {
      (prismaService.project.findUnique as jest.Mock).mockResolvedValue(
        mockProject,
      );

      await expect(
        service.create({
          title: 'New Project',
          notionDbId: 'notion-db-123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      (prismaService.project.findMany as jest.Mock).mockResolvedValue([
        mockProject,
      ]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockProject.id);
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      (prismaService.project.findUnique as jest.Mock).mockResolvedValue(
        mockProject,
      );

      const result = await service.findOne(mockProject.id);

      expect(result.id).toBe(mockProject.id);
    });

    it('should throw NotFoundException when project not found', async () => {
      (prismaService.project.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      (prismaService.project.findUnique as jest.Mock).mockResolvedValue(
        mockProject,
      );
      (prismaService.project.update as jest.Mock).mockResolvedValue({
        ...mockProject,
        title: 'Updated Title',
      });

      const result = await service.update(mockProject.id, {
        title: 'Updated Title',
      });

      expect(result.title).toBe('Updated Title');
    });
  });

  describe('remove', () => {
    it('should delete a project', async () => {
      (prismaService.project.findUnique as jest.Mock).mockResolvedValue(
        mockProject,
      );
      (prismaService.project.delete as jest.Mock).mockResolvedValue(
        mockProject,
      );

      const result = await service.remove(mockProject.id);

      expect(result.success).toBe(true);
    });

    it('should throw NotFoundException when project not found', async () => {
      (prismaService.project.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
