import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';
import { SyncProcessor } from './sync.processor';
import { NotionSyncService } from '../services/notion-sync.service';
import { SyncLogService } from '../services/sync-log.service';
import { DlqService } from '../services/dlq.service';
import { SyncJobData, SyncOperation } from '../../common/types/sync.types';

describe('SyncProcessor', () => {
  let processor: SyncProcessor;
  let notionSyncService: jest.Mocked<NotionSyncService>;
  let syncLogService: jest.Mocked<SyncLogService>;
  let dlqService: jest.Mocked<DlqService>;

  const mockJobData: SyncJobData = {
    jobId: 'job-123',
    taskId: 'task-123',
    operation: SyncOperation.CREATE,
    payload: {
      title: 'Test Task',
      content: 'Test content',
      priority: 'High',
    },
    createdAt: new Date(),
    retryCount: 0,
  };

  const createMockJob = (
    data: Partial<SyncJobData> = {},
    attemptsMade = 0,
  ): Partial<Job<SyncJobData>> => ({
    id: 'job-id-1',
    data: { ...mockJobData, ...data },
    attemptsMade,
  });

  beforeEach(async () => {
    const mockNotionSyncService = {
      createNotionPage: jest.fn(),
      updateNotionPage: jest.fn(),
      archiveNotionPage: jest.fn(),
    };

    const mockSyncLogService = {
      logSyncStart: jest.fn().mockResolvedValue(undefined),
      logSyncComplete: jest.fn().mockResolvedValue(undefined),
      completeSyncWithTransaction: jest.fn().mockResolvedValue(undefined),
      logSyncError: jest.fn().mockResolvedValue(undefined),
      markAsDlq: jest.fn().mockResolvedValue(undefined),
    };

    const mockDlqService = {
      moveToDeadLetterQueue: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncProcessor,
        { provide: NotionSyncService, useValue: mockNotionSyncService },
        { provide: SyncLogService, useValue: mockSyncLogService },
        { provide: DlqService, useValue: mockDlqService },
      ],
    }).compile();

    processor = module.get<SyncProcessor>(SyncProcessor);
    notionSyncService = module.get(NotionSyncService);
    syncLogService = module.get(SyncLogService);
    dlqService = module.get(DlqService);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('process', () => {
    describe('CREATE operation', () => {
      it('should create Notion page and log success', async () => {
        const notionResult = { id: 'notion-page-123' };
        notionSyncService.createNotionPage.mockResolvedValue(notionResult);

        const job = createMockJob({ operation: SyncOperation.CREATE });
        const result = await processor.process(job as Job<SyncJobData>);

        expect(syncLogService.logSyncStart).toHaveBeenCalled();
        expect(notionSyncService.createNotionPage).toHaveBeenCalledWith(
          mockJobData.payload,
        );
        expect(syncLogService.completeSyncWithTransaction).toHaveBeenCalled();
        expect(result.success).toBe(true);
        expect(result.notionPageId).toBe('notion-page-123');
      });
    });

    describe('UPDATE operation', () => {
      it('should update Notion page', async () => {
        const notionResult = { id: 'notion-page-123' };
        notionSyncService.updateNotionPage.mockResolvedValue(notionResult);

        const job = createMockJob({
          operation: SyncOperation.UPDATE,
          notionPageId: 'notion-page-123',
        });
        const result = await processor.process(job as Job<SyncJobData>);

        expect(notionSyncService.updateNotionPage).toHaveBeenCalledWith(
          'notion-page-123',
          mockJobData.payload,
        );
        expect(result.success).toBe(true);
      });

      it('should throw error if notionPageId is missing', async () => {
        const job = createMockJob({
          operation: SyncOperation.UPDATE,
          notionPageId: undefined,
        });

        await expect(
          processor.process(job as Job<SyncJobData>),
        ).rejects.toThrow('notionPageId is required for UPDATE operation');
      });
    });

    describe('DELETE operation', () => {
      it('should archive Notion page', async () => {
        const notionResult = { id: 'notion-page-123' };
        notionSyncService.archiveNotionPage.mockResolvedValue(notionResult);

        const job = createMockJob({
          operation: SyncOperation.DELETE,
          notionPageId: 'notion-page-123',
        });
        const result = await processor.process(job as Job<SyncJobData>);

        expect(notionSyncService.archiveNotionPage).toHaveBeenCalledWith(
          'notion-page-123',
        );
        expect(result.success).toBe(true);
      });
    });

    describe('Error handling', () => {
      it('should log error and rethrow on failure', async () => {
        const error = new Error('Notion API error');
        notionSyncService.createNotionPage.mockRejectedValue(error);

        const job = createMockJob({ operation: SyncOperation.CREATE });

        await expect(
          processor.process(job as Job<SyncJobData>),
        ).rejects.toThrow('Notion API error');

        // 에러 메시지 형식이 [ERROR_CODE] message 로 변경됨
        expect(syncLogService.logSyncError).toHaveBeenCalledWith(
          mockJobData.taskId,
          expect.any(String),
          expect.stringContaining('Notion API error'),
          1,
        );
      });

      it('should handle rate limit errors', async () => {
        const rateLimitError = {
          code: 'rate_limited',
          message: 'Rate limited',
        };
        notionSyncService.createNotionPage.mockRejectedValue(rateLimitError);

        const job = createMockJob({ operation: SyncOperation.CREATE });

        await expect(
          processor.process(job as Job<SyncJobData>),
        ).rejects.toEqual(rateLimitError);
      });

      it('should move job to DLQ after max retries', async () => {
        const error = new Error('Permanent error');
        notionSyncService.createNotionPage.mockRejectedValue(error);

        // 최대 재시도 횟수에 도달한 Job
        const job = createMockJob({ operation: SyncOperation.CREATE }, 4);

        await expect(
          processor.process(job as Job<SyncJobData>),
        ).rejects.toThrow('Permanent error');

        expect(dlqService.moveToDeadLetterQueue).toHaveBeenCalled();
      });
    });
  });
});
