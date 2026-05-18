/**
 * Project API Functions
 */

import apiClient from './client';
import type { Project } from '../types';

/**
 * Fetch all projects
 */
export async function fetchProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<Project[]>('/projects');
  return data;
}

/**
 * Fetch a single project by ID
 */
export async function fetchProject(id: string): Promise<Project> {
  const { data } = await apiClient.get<Project>(`/projects/${id}`);
  return data;
}
