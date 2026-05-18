/**
 * Task API Functions
 * CRUD operations for tasks
 */

import apiClient from './client';
import type { Task, TaskQueryParams, PaginatedResponse, CreateTaskDto, UpdateTaskDto } from '../types';

/**
 * Fetch tasks with pagination and filters
 */
export async function fetchTasks(params: TaskQueryParams = {}): Promise<PaginatedResponse<Task>> {
  const { data } = await apiClient.get<PaginatedResponse<Task>>('/tasks', { params });
  return data;
}

/**
 * Fetch a single task by ID
 */
export async function fetchTask(id: string): Promise<Task> {
  const { data } = await apiClient.get<Task>(`/tasks/${id}`);
  return data;
}

/**
 * Create a new task
 */
export async function createTask(dto: CreateTaskDto): Promise<Task> {
  const { data } = await apiClient.post<Task>('/tasks', dto);
  return data;
}

/**
 * Update an existing task
 */
export async function updateTask(id: string, dto: UpdateTaskDto): Promise<Task> {
  const { data } = await apiClient.put<Task>(`/tasks/${id}`, dto);
  return data;
}

/**
 * Delete a task (soft delete)
 */
export async function deleteTask(id: string): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}

/**
 * Restore a deleted task
 */
export async function restoreTask(id: string): Promise<Task> {
  const { data } = await apiClient.post<Task>(`/tasks/${id}/restore`);
  return data;
}
