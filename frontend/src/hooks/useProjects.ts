/**
 * Project React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, fetchProject, createProject, updateProject, deleteProject } from '../api/projects';
import type { Project, CreateProjectDto, UpdateProjectDto } from '../types';
import { taskKeys } from './useTasks';
import { workflowStatusKeys } from './useWorkflowStatuses';

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

/**
 * Hook to fetch all projects
 */
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: fetchProjects,
  });
}

/**
 * Hook to fetch a single project
 */
export function useProject(id: string | null) {
  return useQuery({
    queryKey: projectKeys.detail(id ?? ''),
    queryFn: () => fetchProject(id!),
    enabled: !!id,
  });
}

/**
 * Hook to create a new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProjectDto) => createProject(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/**
 * Hook to update a project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProjectDto }) => updateProject(id, dto),
    onMutate: async ({ id, dto }) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.lists() });
      await queryClient.cancelQueries({ queryKey: projectKeys.detail(id) });

      const previousList = queryClient.getQueryData<Project[]>(projectKeys.lists());
      const previousDetail = queryClient.getQueryData<Project>(projectKeys.detail(id));

      // Optimistic update
      if (previousList) {
        queryClient.setQueryData<Project[]>(
          projectKeys.lists(),
          previousList.map((p) => (p.id === id ? { ...p, ...dto } : p))
        );
      }
      if (previousDetail) {
        queryClient.setQueryData<Project>(projectKeys.detail(id), { ...previousDetail, ...dto });
      }

      return { previousList, previousDetail };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(projectKeys.lists(), context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(projectKeys.detail(id), context.previousDetail);
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
    },
  });
}

/**
 * Hook to delete a project
 * 프로젝트 삭제 시 관련된 task, workflowStatus 캐시도 무효화
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.lists() });

      const previousList = queryClient.getQueryData<Project[]>(projectKeys.lists());

      // Optimistic removal
      if (previousList) {
        queryClient.setQueryData<Project[]>(
          projectKeys.lists(),
          previousList.filter((p) => p.id !== id)
        );
      }

      return { previousList, deletedProjectId: id };
    },
    onError: (_err, _id, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(projectKeys.lists(), context.previousList);
      }
    },
    onSettled: (_data, _err, _id, context) => {
      // 프로젝트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });

      // 삭제된 프로젝트와 관련된 task, workflowStatus 캐시 무효화
      if (context?.deletedProjectId) {
        queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: workflowStatusKeys.byProject(context.deletedProjectId)
        });
        queryClient.invalidateQueries({ queryKey: workflowStatusKeys.list() });
      }
    },
  });
}
