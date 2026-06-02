/**
 * Workflow Status React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllWorkflowStatuses,
  fetchWorkflowStatuses,
  reorderWorkflowStatuses,
  createWorkflowStatus,
  updateWorkflowStatus,
  deleteWorkflowStatus,
} from '../api/workflow-statuses';
import type { WorkflowStatus, CreateWorkflowStatusDto, UpdateWorkflowStatusDto } from '../types';

// Query keys
export const workflowStatusKeys = {
  all: ['workflowStatuses'] as const,
  list: () => [...workflowStatusKeys.all, 'list'] as const,
  byProject: (projectId: string) => [...workflowStatusKeys.all, 'project', projectId] as const,
};

/**
 * Hook to fetch all workflow statuses
 */
export function useAllWorkflowStatuses() {
  return useQuery({
    queryKey: workflowStatusKeys.list(),
    queryFn: fetchAllWorkflowStatuses,
  });
}

/**
 * Hook to fetch workflow statuses for a project
 */
export function useWorkflowStatuses(projectId: string | null) {
  return useQuery({
    queryKey: workflowStatusKeys.byProject(projectId ?? ''),
    queryFn: () => fetchWorkflowStatuses(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Hook to reorder workflow statuses
 */
export function useReorderWorkflowStatuses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, statusIds }: { projectId: string; statusIds: string[] }) =>
      reorderWorkflowStatuses(projectId, statusIds),
    onMutate: async ({ projectId, statusIds }) => {
      await queryClient.cancelQueries({ queryKey: workflowStatusKeys.byProject(projectId) });

      const previous = queryClient.getQueryData<WorkflowStatus[]>(
        workflowStatusKeys.byProject(projectId)
      );

      // Optimistically update the order
      if (previous) {
        const reordered = statusIds
          .map((id, index) => {
            const status = previous.find((s) => s.id === id);
            if (!status) return null;
            return { ...status, sortOrder: index } as WorkflowStatus;
          })
          .filter((s): s is WorkflowStatus => s !== null);

        queryClient.setQueryData(workflowStatusKeys.byProject(projectId), reordered);
      }

      return { previous };
    },
    onError: (_err, { projectId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(workflowStatusKeys.byProject(projectId), context.previous);
      }
    },
    onSettled: (_data, _err, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: workflowStatusKeys.byProject(projectId) });
    },
  });
}

/**
 * Hook to create a workflow status
 */
export function useCreateWorkflowStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateWorkflowStatusDto) => createWorkflowStatus(dto),
    onSuccess: (newStatus) => {
      // Invalidate project-specific query
      queryClient.invalidateQueries({ queryKey: workflowStatusKeys.byProject(newStatus.projectId) });
      // Invalidate all statuses list
      queryClient.invalidateQueries({ queryKey: workflowStatusKeys.list() });
    },
  });
}

/**
 * Hook to update a workflow status
 */
export function useUpdateWorkflowStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateWorkflowStatusDto }) => updateWorkflowStatus(id, dto),
    onSuccess: (updatedStatus) => {
      queryClient.invalidateQueries({ queryKey: workflowStatusKeys.byProject(updatedStatus.projectId) });
      queryClient.invalidateQueries({ queryKey: workflowStatusKeys.list() });
    },
  });
}

/**
 * Hook to delete a workflow status
 */
export function useDeleteWorkflowStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; projectId: string }) => deleteWorkflowStatus(id),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: workflowStatusKeys.byProject(projectId) });
      queryClient.invalidateQueries({ queryKey: workflowStatusKeys.list() });
    },
  });
}
