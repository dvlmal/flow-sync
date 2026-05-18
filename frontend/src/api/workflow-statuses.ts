/**
 * Workflow Status API Functions
 */

import apiClient from './client';
import type { WorkflowStatus } from '../types';

/**
 * Fetch workflow statuses for a project
 */
export async function fetchWorkflowStatuses(projectId: string): Promise<WorkflowStatus[]> {
  const { data } = await apiClient.get<WorkflowStatus[]>(`/workflow-statuses/project/${projectId}`);
  return data;
}

/**
 * Fetch a single workflow status by ID
 */
export async function fetchWorkflowStatus(id: string): Promise<WorkflowStatus> {
  const { data } = await apiClient.get<WorkflowStatus>(`/workflow-statuses/${id}`);
  return data;
}

/**
 * Reorder workflow statuses
 */
export async function reorderWorkflowStatuses(projectId: string, statusIds: string[]): Promise<void> {
  await apiClient.put(`/workflow-statuses/project/${projectId}/reorder`, { statusIds });
}
