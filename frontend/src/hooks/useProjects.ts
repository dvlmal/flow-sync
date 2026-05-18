/**
 * Project React Query Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchProject } from '../api/projects';

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
