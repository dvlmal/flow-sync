/**
 * FlowSync Type Definitions
 * Aligned with Prisma schema
 */

// ============================================================================
// Core Types
// ============================================================================

export interface Project {
  id: string;
  title: string;
  notionDbId: string;
  description?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface WorkflowStatus {
  id: string;
  projectId: string;
  name: string;
  sortOrder?: number | null;
  notionOptionId?: string | null;
}

export interface Task {
  id: string;
  projectId?: string | null;
  statusId?: string | null;
  notionPageId?: string | null;
  title: string;
  content?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  priority?: TaskPriority | null;
  assignees?: Assignee[] | null;
  tags?: string[] | null;
  rawNotionData?: Record<string, unknown> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  // Relations (populated when fetched with includes)
  workflowStatus?: WorkflowStatus | null;
  project?: Project | null;
}

export interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string;
}

// ============================================================================
// Enum Types
// ============================================================================

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ViewMode = 'kanban' | 'calendar' | 'list';

export type SyncStatus = 'IDLE' | 'PENDING' | 'SUCCESS' | 'ERROR';

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface TaskQueryParams {
  projectId?: string;
  statusId?: string;
  priority?: TaskPriority;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateTaskDto {
  title: string;
  projectId?: string;
  statusId?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  priority?: TaskPriority;
  assignees?: Assignee[];
  tags?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  statusId?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  priority?: TaskPriority;
  assignees?: Assignee[];
  tags?: string[];
}

// ============================================================================
// UI Component Types
// ============================================================================

export interface TagColor {
  bg: string;
  text: string;
  darkBg: string;
  darkText: string;
}

export const TAG_COLORS: Record<string, TagColor> = {
  gray: { bg: 'bg-gray-100', text: 'text-gray-700', darkBg: 'dark:bg-gray-800', darkText: 'dark:text-gray-300' },
  red: { bg: 'bg-red-100', text: 'text-red-700', darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-400' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', darkBg: 'dark:bg-orange-900/30', darkText: 'dark:text-orange-400' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', darkBg: 'dark:bg-yellow-900/30', darkText: 'dark:text-yellow-400' },
  green: { bg: 'bg-green-100', text: 'text-green-700', darkBg: 'dark:bg-green-900/30', darkText: 'dark:text-green-400' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'dark:bg-blue-900/30', darkText: 'dark:text-blue-400' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-400' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700', darkBg: 'dark:bg-pink-900/30', darkText: 'dark:text-pink-400' },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; icon: string }> = {
  Low: { label: 'Low', color: 'text-gray-400', icon: 'minus' },
  Medium: { label: 'Medium', color: 'text-yellow-500', icon: 'equal' },
  High: { label: 'High', color: 'text-orange-500', icon: 'chevron-up' },
  Urgent: { label: 'Urgent', color: 'text-red-500', icon: 'chevrons-up' },
};

export const STATUS_COLORS: Record<string, string> = {
  'Not Started': 'bg-gray-400',
  'To Do': 'bg-gray-400',
  'In Progress': 'bg-blue-500',
  'Done': 'bg-green-500',
  'Blocked': 'bg-red-500',
};
