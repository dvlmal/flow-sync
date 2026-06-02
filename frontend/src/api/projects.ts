/**
 * Project API Functions
 */

import apiClient from './client';
import type { Project, CreateProjectDto, UpdateProjectDto } from '../types';

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

/**
 * Create a new project
 */
export async function createProject(dto: CreateProjectDto): Promise<Project> {
  const { data } = await apiClient.post<Project>('/projects', dto);
  return data;
}

/**
 * Update a project
 */
export async function updateProject(id: string, dto: UpdateProjectDto): Promise<Project> {
  const { data } = await apiClient.put<Project>(`/projects/${id}`, dto);
  return data;
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}
