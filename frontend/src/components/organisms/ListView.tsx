/**
 * ListView Organism Component
 * Table-based task list with sorting, filtering, and inline editing
 */

import { useState, useMemo, useCallback } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Filter,
  Plus,
} from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { Button, PriorityIcon } from '../atoms';
import { StatusBadge, AvatarGroup, LoadingSpinner, EmptyState, Dropdown, DropdownItem } from '../molecules';
import { TaskModal } from './TaskModal';
import { CreateTaskModal } from './CreateTaskModal';
import { useUpdateTask } from '../../hooks';
import type { Task, WorkflowStatus, TaskPriority } from '../../types';
import { PRIORITY_CONFIG, STATUS_LABELS } from '../../types';

interface ListViewProps {
  tasks: Task[];
  statuses: WorkflowStatus[];
  projectId: string;
  isLoading?: boolean;
}

type SortField = 'title' | 'endDate' | 'priority' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface SortState {
  field: SortField;
  direction: SortDirection;
}

interface FilterState {
  search: string;
  status: string | null;
  priority: TaskPriority | null;
}

// Priority order for sorting
const priorityOrder: Record<TaskPriority, number> = {
  Urgent: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export function ListView({ tasks, statuses, projectId, isLoading }: ListViewProps) {
  const [sort, setSort] = useState<SortState>({ field: 'createdAt', direction: 'desc' });
  const [filters, setFilters] = useState<FilterState>({ search: '', status: null, priority: null });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const updateTask = useUpdateTask();

  // Get selected task from tasks array (synced with cache)
  const selectedTask = useMemo(
    () => (selectedTaskId ? tasks.find((t) => t.id === selectedTaskId) ?? null : null),
    [selectedTaskId, tasks]
  );

  // Sort and filter tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.content?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      result = result.filter((task) => task.statusId === filters.status);
    }

    if (filters.priority) {
      result = result.filter((task) => task.priority === filters.priority);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'endDate':
          const dateA = a.endDate ? new Date(a.endDate).getTime() : 0;
          const dateB = b.endDate ? new Date(b.endDate).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'priority':
          const priorityA = a.priority ? priorityOrder[a.priority] : 0;
          const priorityB = b.priority ? priorityOrder[b.priority] : 0;
          comparison = priorityA - priorityB;
          break;
        case 'status':
          const statusA = statuses.find((s) => s.id === a.statusId)?.sortOrder ?? 999;
          const statusB = statuses.find((s) => s.id === b.statusId)?.sortOrder ?? 999;
          comparison = statusA - statusB;
          break;
        case 'createdAt':
          const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          comparison = createdA - createdB;
          break;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, filters, sort, statuses]);

  const handleSort = useCallback((field: SortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleInlineEdit = useCallback(
    async (taskId: string, field: string, value: string) => {
      try {
        await updateTask.mutateAsync({
          id: taskId,
          dto: { [field]: value || undefined },
        });
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    },
    [updateTask]
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sort.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-blue-500" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-500" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" label="작업 불러오는 중..." />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="작업 검색..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9 pr-3 py-1.5 w-64 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border transition-colors',
                showFilters
                  ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              <Filter className="w-4 h-4" />
              필터
              {(filters.status || filters.priority) && (
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>
          </div>

          <Button size="sm" onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4" />
            새 작업
          </Button>
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">상태:</span>
              <select
                value={filters.status ?? ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value || null })}
                className="px-2 py-1 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <option value="">전체</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {STATUS_LABELS[status.name] ?? status.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">우선순위:</span>
              <select
                value={filters.priority ?? ''}
                onChange={(e) =>
                  setFilters({ ...filters, priority: (e.target.value || null) as TaskPriority | null })
                }
                className="px-2 py-1 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <option value="">전체</option>
                {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            {(filters.status || filters.priority) && (
              <button
                onClick={() => setFilters({ ...filters, status: null, priority: null })}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                필터 초기화
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3">
                  <button
                    onClick={() => handleSort('title')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    제목
                    <SortIcon field="title" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 w-32">
                  <button
                    onClick={() => handleSort('status')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    상태
                    <SortIcon field="status" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 w-28">
                  <button
                    onClick={() => handleSort('priority')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    우선순위
                    <SortIcon field="priority" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 w-28">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    시작일
                  </span>
                </th>
                <th className="text-left px-4 py-3 w-28">
                  <button
                    onClick={() => handleSort('endDate')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    마감일
                    <SortIcon field="endDate" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 w-28">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    담당자
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8">
                    <EmptyState
                      title="작업을 찾을 수 없습니다"
                      description={
                        filters.search || filters.status || filters.priority
                          ? '필터 조건을 변경해보세요.'
                          : '첫 번째 작업을 생성해보세요.'
                      }
                      actionLabel={!filters.search && !filters.status && !filters.priority ? '새 작업' : undefined}
                      onAction={() => setCreateModalOpen(true)}
                    />
                  </td>
                </tr>
              ) : (
                filteredAndSortedTasks.map((task) => {
                  const status = statuses.find((s) => s.id === task.statusId);

                  return (
                    <tr
                      key={task.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      {/* Title */}
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                          {task.title}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Dropdown
                          trigger={
                            <div className="inline-block">
                              {status ? (
                                <StatusBadge status={status.name} />
                              ) : (
                                <span className="text-sm text-gray-400">상태 없음</span>
                              )}
                            </div>
                          }
                        >
                          {statuses.map((s) => (
                            <DropdownItem
                              key={s.id}
                              selected={s.id === task.statusId}
                              onClick={() => handleInlineEdit(task.id, 'statusId', s.id)}
                            >
                              <StatusBadge status={s.name} />
                            </DropdownItem>
                          ))}
                        </Dropdown>
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Dropdown
                          trigger={
                            <div className="inline-block">
                              <PriorityIcon priority={task.priority} showLabel />
                              {!task.priority && (
                                <span className="text-sm text-gray-400">없음</span>
                              )}
                            </div>
                          }
                        >
                          <DropdownItem
                            selected={!task.priority}
                            onClick={() => handleInlineEdit(task.id, 'priority', '')}
                          >
                            <span className="text-gray-400">없음</span>
                          </DropdownItem>
                          {Object.entries(PRIORITY_CONFIG).map(([value]) => (
                            <DropdownItem
                              key={value}
                              selected={task.priority === value}
                              onClick={() => handleInlineEdit(task.id, 'priority', value)}
                            >
                              <PriorityIcon priority={value as TaskPriority} showLabel />
                            </DropdownItem>
                          ))}
                        </Dropdown>
                      </td>

                      {/* Start Date */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {task.startDate
                            ? format(parseISO(task.startDate), 'M/d')
                            : '-'}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {task.endDate
                            ? format(parseISO(task.endDate), 'M/d')
                            : '-'}
                        </span>
                      </td>

                      {/* Assignees */}
                      <td className="px-4 py-3">
                        {task.assignees && task.assignees.length > 0 ? (
                          <AvatarGroup assignees={task.assignees} max={3} size="sm" />
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
          전체 {tasks.length}개 중 {filteredAndSortedTasks.length}개
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskModal
        task={selectedTask}
        statuses={statuses}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTaskId(null)}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        projectId={projectId}
        statuses={statuses}
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
}

export default ListView;
