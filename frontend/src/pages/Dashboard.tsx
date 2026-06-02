/**
 * Dashboard Page Component
 * Home page with project overview and task summary
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  ListTodo,
  ChevronRight,
  Calendar,
  LayoutDashboard,
  List,
} from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { useProjects, useTasks, useWorkflowStatuses, useAllWorkflowStatuses } from '../hooks';
import { StatusBadge, LoadingSpinner } from '../components/molecules';
import { PriorityIcon } from '../components/atoms';
import type { Project, Task, WorkflowStatus } from '../types';

export function Dashboard() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Fetch projects
  const { data: projects, isLoading: projectsLoading } = useProjects();

  // Always fetch all tasks for counting purposes
  const { data: allTasksData } = useTasks({ limit: 100 });

  // Fetch tasks for selected project (for display)
  const { data: projectTasksData, isLoading: tasksLoading } = useTasks(
    selectedProjectId ? { projectId: selectedProjectId, limit: 5 } : { limit: 100 }
  );

  // Fetch workflow statuses for selected project
  const { data: statuses = [] } = useWorkflowStatuses(selectedProjectId);

  // Fetch all workflow statuses (for when no project is selected)
  const { data: allStatuses = [] } = useAllWorkflowStatuses();

  // Create a map from statusId to status for quick lookup
  const statusMap = useMemo(() => {
    const map = new Map<string, WorkflowStatus>();
    allStatuses.forEach((status) => {
      map.set(status.id, status);
    });
    return map;
  }, [allStatuses]);

  // Tasks for display (project-specific or all)
  const tasks = projectTasksData?.data ?? [];
  const displayedProjects = projects?.slice(0, 5) ?? [];
  const selectedProject = projects?.find((p) => p.id === selectedProjectId);

  // Calculate task counts per project (always using all tasks)
  const projectTaskCounts = useMemo(() => {
    if (!projects || !allTasksData?.data) return {};

    const counts: Record<string, number> = {};
    allTasksData.data.forEach((task) => {
      if (task.projectId) {
        counts[task.projectId] = (counts[task.projectId] || 0) + 1;
      }
    });
    return counts;
  }, [projects, allTasksData]);

  // Calculate task counts per status (by status name for all tasks, by status ID for project-specific)
  const { statusTaskCounts, uniqueStatusNames } = useMemo(() => {
    if (selectedProjectId) {
      // For project-specific view, count by status ID using displayed tasks
      if (!tasks.length) return { statusTaskCounts: {}, uniqueStatusNames: [] };
      const counts: Record<string, number> = {};
      tasks.forEach((task) => {
        const statusId = task.statusId ?? 'no-status';
        counts[statusId] = (counts[statusId] || 0) + 1;
      });
      return { statusTaskCounts: counts, uniqueStatusNames: [] };
    } else {
      // For all tasks view, count by status name (using statusMap to get name from statusId)
      const allTasks = allTasksData?.data ?? [];
      if (!allTasks.length) return { statusTaskCounts: {}, uniqueStatusNames: [] };
      const counts: Record<string, number> = {};
      const statusNames = new Set<string>();
      allTasks.forEach((task) => {
        const status = task.statusId ? statusMap.get(task.statusId) : null;
        const statusName = status?.name ?? '상태 없음';
        counts[statusName] = (counts[statusName] || 0) + 1;
        statusNames.add(statusName);
      });
      return { statusTaskCounts: counts, uniqueStatusNames: Array.from(statusNames) };
    }
  }, [selectedProjectId, tasks, allTasksData, statusMap]);

  // Total task count for selected project or all
  const totalTaskCount = useMemo(() => {
    if (selectedProjectId) {
      // For selected project, count from projectTaskCounts (which uses all tasks)
      return projectTaskCounts[selectedProjectId] ?? 0;
    }
    return allTasksData?.data?.length ?? 0;
  }, [selectedProjectId, projectTaskCounts, allTasksData]);

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" label="대시보드 불러오는 중..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          대시보드
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          프로젝트와 작업 현황을 한눈에 확인하세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Projects */}
        <div className="lg:col-span-1 space-y-6">
          {/* Project Summary Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                    프로젝트
                  </h2>
                  <p className="text-sm text-gray-500">
                    총 {projects?.length ?? 0}개
                  </p>
                </div>
              </div>
            </div>

            {/* Project List */}
            <div className="space-y-2">
              {displayedProjects.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  프로젝트가 없습니다
                </p>
              ) : (
                displayedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    taskCount={projectTaskCounts[project.id] ?? 0}
                    isSelected={selectedProjectId === project.id}
                    onClick={() =>
                      setSelectedProjectId(
                        selectedProjectId === project.id ? null : project.id
                      )
                    }
                  />
                ))
              )}
            </div>

            {/* More Projects Link */}
            {projects && projects.length > 5 && (
              <Link
                to="/board"
                className="mt-4 flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                전체 프로젝트 보기
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Quick Navigation */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              빠른 이동
            </h2>
            <div className="space-y-2">
              <QuickNavItem
                to="/board?view=kanban"
                icon={LayoutDashboard}
                label="칸반 보드"
                description="드래그 앤 드롭으로 작업 관리"
              />
              <QuickNavItem
                to="/board?view=calendar"
                icon={Calendar}
                label="캘린더"
                description="일정 기반 작업 관리"
              />
              <QuickNavItem
                to="/board?view=list"
                icon={List}
                label="목록"
                description="테이블 형식으로 작업 관리"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Summary Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <ListTodo className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                    {selectedProject ? selectedProject.title : '전체 작업'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    총 {totalTaskCount}개의 작업
                  </p>
                </div>
              </div>
              {selectedProjectId && (
                <Link
                  to={`/board?project=${selectedProjectId}`}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                >
                  더보기
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Status Summary */}
            {selectedProjectId && statuses.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                {statuses.map((status) => (
                  <div
                    key={status.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <StatusBadge status={status.name} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {statusTaskCounts[status.id] ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            ) : !selectedProjectId && uniqueStatusNames.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                {uniqueStatusNames.map((statusName) => (
                  <div
                    key={statusName}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <StatusBadge status={statusName} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {statusTaskCounts[statusName] ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Task List */}
            <div className="space-y-2">
              {tasksLoading ? (
                <div className="py-8">
                  <LoadingSpinner size="md" label="작업 불러오는 중..." />
                </div>
              ) : tasks.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  {selectedProjectId
                    ? '이 프로젝트에 작업이 없습니다'
                    : '작업이 없습니다'}
                </p>
              ) : (
                <>
                  {tasks.slice(0, 5).map((task) => {
                    // Use statuses array for project-specific view, statusMap for all tasks view
                    const taskStatus = selectedProjectId
                      ? statuses.find((s) => s.id === task.statusId)
                      : (task.statusId ? statusMap.get(task.statusId) : undefined);
                    return (
                      <TaskItem
                        key={task.id}
                        task={task}
                        status={taskStatus}
                      />
                    );
                  })}
                </>
              )}
            </div>

            {/* More Tasks Link */}
            {tasks.length > 0 && (
              <Link
                to={
                  selectedProjectId
                    ? `/board?project=${selectedProjectId}`
                    : '/board'
                }
                className="mt-4 flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                전체 작업 보기
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Project Item Component
interface ProjectItemProps {
  project: Project;
  taskCount: number;
  isSelected: boolean;
  onClick: () => void;
}

function ProjectItem({ project, taskCount, isSelected, onClick }: ProjectItemProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left',
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={clsx(
            'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
            isSelected
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          )}
        >
          {project.title.charAt(0).toUpperCase()}
        </div>
        <span
          className={clsx(
            'font-medium truncate',
            isSelected
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-gray-700 dark:text-gray-300'
          )}
        >
          {project.title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
          {taskCount}개
        </span>
        <ChevronRight
          className={clsx(
            'w-4 h-4 transition-transform',
            isSelected ? 'text-blue-500 rotate-90' : 'text-gray-400'
          )}
        />
      </div>
    </button>
  );
}

// Task Item Component
interface TaskItemProps {
  task: Task;
  status?: WorkflowStatus;
}

function TaskItem({ task, status }: TaskItemProps) {
  return (
    <Link
      to={`/board?project=${task.projectId}`}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <PriorityIcon priority={task.priority} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {status?.name && <StatusBadge status={status.name} />}
          {task.endDate && (
            <span className="text-xs text-gray-500">
              {format(parseISO(task.endDate), 'M/d')}
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </Link>
  );
}

// Quick Navigation Item Component
interface QuickNavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}

function QuickNavItem({ to, icon: Icon, label, description }: QuickNavItemProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </Link>
  );
}

export default Dashboard;
