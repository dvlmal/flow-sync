/**
 * Task React Query Hooks
 * Provides data fetching, mutations, and optimistic updates for tasks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, fetchTask, createTask, updateTask, deleteTask } from '../api/tasks';
import type { Task, TaskQueryParams, CreateTaskDto, UpdateTaskDto, PaginatedResponse } from '../types';

// Query keys for cache management
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (params: TaskQueryParams) => [...taskKeys.lists(), params] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

/**
 * Hook to fetch tasks with pagination and filters
 */
export function useTasks(params: TaskQueryParams = {}) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => fetchTasks(params),
  });
}

/**
 * Hook to fetch a single task
 */
export function useTask(id: string | null) {
  return useQuery({
    queryKey: taskKeys.detail(id ?? ''),
    queryFn: () => fetchTask(id!),
    enabled: !!id,
  });
}

/**
 * Hook to create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTaskDto) => createTask(dto),
    onSuccess: () => {
      // Invalidate task lists to refetch
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

/**
 * Hook to update a task with optimistic updates
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTaskDto }) => updateTask(id, dto),
    onMutate: async ({ id, dto }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(id) });

      // Snapshot previous values for rollback
      const previousLists = queryClient.getQueriesData<PaginatedResponse<Task>>({
        queryKey: taskKeys.lists(),
      });
      const previousDetail = queryClient.getQueryData<Task>(taskKeys.detail(id));

      // Optimistically update the task in all list caches
      queryClient.setQueriesData<PaginatedResponse<Task>>(
        { queryKey: taskKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((task) =>
              task.id === id ? { ...task, ...dto } : task
            ),
          };
        }
      );

      // Optimistically update the detail cache
      if (previousDetail) {
        queryClient.setQueryData<Task>(taskKeys.detail(id), {
          ...previousDetail,
          ...dto,
        });
      }

      return { previousLists, previousDetail };
    },
    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(taskKeys.detail(id), context.previousDetail);
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

/**
 * Hook specifically for updating task status (optimized for Kanban drag & drop)
 */
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, statusId }: { id: string; statusId: string }) =>
      updateTask(id, { statusId: statusId }),
    onMutate: async ({ id, statusId }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      const previousLists = queryClient.getQueriesData<PaginatedResponse<Task>>({
        queryKey: taskKeys.lists(),
      });

      // Optimistic update
      queryClient.setQueriesData<PaginatedResponse<Task>>(
        { queryKey: taskKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((task) =>
              task.id === id ? { ...task, statusId: statusId } : task
            ),
          };
        }
      );

      return { previousLists };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      const previousLists = queryClient.getQueriesData<PaginatedResponse<Task>>({
        queryKey: taskKeys.lists(),
      });

      // Optimistically remove the task from lists
      queryClient.setQueriesData<PaginatedResponse<Task>>(
        { queryKey: taskKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((task) => task.id !== id),
            meta: { ...old.meta, total: old.meta.total - 1 },
          };
        }
      );

      return { previousLists };
    },
    onError: (_err, _id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
