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
  notion_db_id: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface WorkflowStatus {
  id: string;
  project_id: string;
  name: string;
  sort_ordr?: number | null;
  notion_option_id?: string | null;
}

export interface Task {
  id: string;
  project_id?: string | null;
  status_id?: string | null;
  notion_page_id?: string | null;
  title: string;
  content?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  priority?: TaskPriority | null;
  assignees?: Assignee[] | null;
  tags?: string | null;
  raw_notion_data?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  // Relations (populated when fetched with includes)
  workflow_status?: WorkflowStatus | null;
  project?: Project | null;
}

export interface Assignee {
  id: string;
  name: string;
  avatar_url?: string;
}

// ============================================================================
// Enum Types
// ============================================================================

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

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
  project_id?: string;
  status_id?: string;
  content?: string;
  start_date?: string;
  end_date?: string;
  priority?: TaskPriority;
  assignees?: Assignee[];
  tags?: string;
}

export interface UpdateTaskDto {
  title?: string;
  status_id?: string;
  content?: string;
  start_date?: string;
  end_date?: string;
  priority?: TaskPriority;
  assignees?: Assignee[];
  tags?: string;
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
  low: { label: 'Low', color: 'text-gray-400', icon: 'minus' },
  medium: { label: 'Medium', color: 'text-yellow-500', icon: 'equal' },
  high: { label: 'High', color: 'text-orange-500', icon: 'chevron-up' },
  urgent: { label: 'Urgent', color: 'text-red-500', icon: 'chevrons-up' },
};

export const STATUS_COLORS: Record<string, string> = {
  'Not Started': 'bg-gray-400',
  'To Do': 'bg-gray-400',
  'In Progress': 'bg-blue-500',
  'Done': 'bg-green-500',
  'Blocked': 'bg-red-500',
};
