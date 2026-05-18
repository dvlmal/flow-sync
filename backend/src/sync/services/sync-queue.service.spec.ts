import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SyncQueueService } from './sync-queue.service';
import { SYNC_QUEUE_NAME } from '../constants/queue.constants';
import { SyncOperation } from '../../common/types/sync.types';

describe('SyncQueueService', () => {
  let service: SyncQueueService;
  let mockQueue: jest.Mocked<Partial<Queue>>;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: 'job-1' }),
      getWaitingCount: jest.fn().mockResolvedValue(5),
      getActiveCount: jest.fn().mockResolvedValue(2),
      getCompletedCount: jest.fn().mockResolvedValue(100),
      getFailedCount: jest.fn().mockResolvedValue(3),
      getDelayedCount: jest.fn().mockResolvedValue(1),
      isPaused: jest.fn().mockResolvedValue(false),
      pause: jest.fn().mockResolvedValue(undefined),
      resume: jest.fn().mockResolvedValue(undefined),
      getJob: jest.fn(),
      getFailed: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncQueueService,
        {
          provide: getQueueToken(SYNC_QUEUE_NAME),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<SyncQueueService>(SyncQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addCreateJob', () => {
    it('should add a CREATE job to the queue', async () => {
      const taskId = 'task-123';
      const payload = { title: 'Test Task' };

      const result = await service.addCreateJob(taskId, payload);

      expect(mockQueue.add).toHaveBeenCalledWith(
        SyncOperation.CREATE,
        expect.objectContaining({
          taskId,
          operation: SyncOperation.CREATE,
          payload,
        }),
        expect.any(Object),
      );
      expect(result).toEqual({ id: 'job-1' });
    });
  });

  describe('addUpdateJob', () => {
    it('should add an UPDATE job to the queue', async () => {
      const taskId = 'task-123';
      const notionPageId = 'notion-page-123';
      const payload = { title: 'Updated Task' };

      await service.addUpdateJob(taskId, notionPageId, payload);

      expect(mockQueue.add).toHaveBeenCalledWith(
        SyncOperation.UPDATE,
        expect.objectContaining({
          taskId,
          notionPageId,
          operation: SyncOperation.UPDATE,
          payload,
        }),
        expect.any(Object),
      );
    });
  });

  describe('addDeleteJob', () => {
    it('should add a DELETE job to the queue', async () => {
      const taskId = 'task-123';
      const notionPageId = 'notion-page-123';

      await service.addDeleteJob(taskId, notionPageId);

      expect(mockQueue.add).toHaveBeenCalledWith(
        SyncOperation.DELETE,
        expect.objectContaining({
          taskId,
          notionPageId,
          operation: SyncOperation.DELETE,
        }),
        expect.any(Object),
      );
    });
  });

  describe('getQueueStatus', () => {
    it('should return queue status', async () => {
      const status = await service.getQueueStatus();

      expect(status).toEqual({
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
        delayed: 1,
        isPaused: false,
      });
    });
  });

  describe('pause and resume', () => {
    it('should pause the queue', async () => {
      await service.pause();
      expect(mockQueue.pause).toHaveBeenCalled();
    });

    it('should resume the queue', async () => {
      await service.resume();
      expect(mockQueue.resume).toHaveBeenCalled();
    });
  });

  describe('retryFailedJob', () => {
    it('should retry a specific failed job', async () => {
      const mockJob = { retry: jest.fn().mockResolvedValue(undefined) };
      (mockQueue.getJob as jest.Mock).mockResolvedValue(mockJob);

      await service.retryFailedJob('job-1');

      expect(mockQueue.getJob).toHaveBeenCalledWith('job-1');
      expect(mockJob.retry).toHaveBeenCalled();
    });

    it('should do nothing if job not found', async () => {
      (mockQueue.getJob as jest.Mock).mockResolvedValue(null);

      await service.retryFailedJob('non-existent');

      expect(mockQueue.getJob).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('retryAllFailedJobs', () => {
    it('should retry all failed jobs', async () => {
      const mockJobs = [
        { id: 'job-1', retry: jest.fn().mockResolvedValue(undefined) },
        { id: 'job-2', retry: jest.fn().mockResolvedValue(undefined) },
      ];
      (mockQueue.getFailed as jest.Mock).mockResolvedValue(mockJobs);

      const count = await service.retryAllFailedJobs();

      expect(count).toBe(2);
      expect(mockJobs[0].retry).toHaveBeenCalled();
      expect(mockJobs[1].retry).toHaveBeenCalled();
    });
  });
});
