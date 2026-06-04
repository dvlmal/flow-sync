/**
 * Sync API Client
 * Manual sync operations with Notion
 */

import { apiClient } from './client';

export type SyncDirection = 'APP_TO_NOTION' | 'NOTION_TO_APP';

export interface ManualSyncRequest {
  taskId?: string;
  direction?: SyncDirection;
}

export interface ManualSyncResult {
  success: boolean;
  direction: SyncDirection;
  totalCount: number;
  successCount: number;
  failedCount: number;
  skippedCount: number;
  syncedTaskIds: string[];
  errors: Array<{ taskId: string; error: string }>;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  environment?: 'serverless' | 'local';
}

export interface QueueStatus {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  paused: boolean;
}

export const syncApi = {
  /**
   * Execute manual sync
   */
  triggerManualSync: async (
    request: ManualSyncRequest = {}
  ): Promise<ManualSyncResult> => {
    const response = await apiClient.post<ManualSyncResult>(
      '/sync/manual',
      request
    );
    return response.data;
  },

  /**
   * Get sync queue status
   */
  getQueueStatus: async (): Promise<QueueStatus> => {
    const response = await apiClient.get<QueueStatus>('/sync/queue/status');
    return response.data;
  },

  /**
   * Retry all failed jobs
   */
  retryFailedJobs: async (): Promise<{ retriedCount: number }> => {
    const response = await apiClient.post<{ retriedCount: number }>(
      '/sync/queue/retry-failed'
    );
    return response.data;
  },
};

export default syncApi;
