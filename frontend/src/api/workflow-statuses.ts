/**
 * Workflow Status API Functions
 */

import apiClient from './client';
import type { WorkflowStatus, CreateWorkflowStatusDto, UpdateWorkflowStatusDto } from '../types';

/**
 * Fetch all workflow statuses
 */
export async function fetchAllWorkflowStatuses(): Promise<WorkflowStatus[]> {
  const { data } = await apiClient.get<WorkflowStatus[]>('/workflow-statuses');
  return data;
}

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

/**
 * Create a workflow status
 */
export async function createWorkflowStatus(dto: CreateWorkflowStatusDto): Promise<WorkflowStatus> {
  const { data } = await apiClient.post<WorkflowStatus>('/workflow-statuses', dto);
  return data;
}

/**
 * Update a workflow status
 */
export async function updateWorkflowStatus(id: string, dto: UpdateWorkflowStatusDto): Promise<WorkflowStatus> {
  const { data } = await apiClient.put<WorkflowStatus>(`/workflow-statuses/${id}`, dto);
  return data;
}

/**
 * Delete a workflow status
 */
export async function deleteWorkflowStatus(id: string): Promise<void> {
  await apiClient.delete(`/workflow-statuses/${id}`);
}
