/**
 * Workflow Status React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkflowStatuses, reorderWorkflowStatuses } from '../api/workflow-statuses';
import type { WorkflowStatus } from '../types';

// Query keys
export const workflowStatusKeys = {
  all: ['workflowStatuses'] as const,
  byProject: (projectId: string) => [...workflowStatusKeys.all, 'project', projectId] as const,
};

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
