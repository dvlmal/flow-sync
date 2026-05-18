/**
 * TaskBoard Page Component
 * Main dashboard with view switching (Kanban | Calendar | List)
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw, Settings, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../components/atoms';
import { ViewSwitcher, LoadingSpinner, Dropdown, DropdownItem } from '../components/molecules';
import { KanbanBoard, CalendarView, ListView } from '../components/organisms';
import { useTasks, useProjects, useWorkflowStatuses } from '../hooks';
import type { ViewMode } from '../types';

export function TaskBoard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>(
    (searchParams.get('view') as ViewMode) || 'kanban'
  );

  // Get projects
  const { data: projects, isLoading: projectsLoading } = useProjects();

  // Selected project (default to first project)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    searchParams.get('project') || null
  );

  // Set default project when projects load
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Get workflow statuses for selected project
  const { data: statuses = [], isLoading: statusesLoading } = useWorkflowStatuses(
    selectedProjectId
  );

  // Get tasks for selected project
  const {
    data: tasksData,
    isLoading: tasksLoading,
    refetch,
    isRefetching,
  } = useTasks(
    selectedProjectId
      ? { projectId: selectedProjectId, limit: 100 }
      : {}
  );

  const tasks = tasksData?.data ?? [];
  const isLoading = projectsLoading || statusesLoading || tasksLoading;

  // Update URL when view mode changes
  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    setSearchParams((prev) => {
      prev.set('view', mode);
      return prev;
    });
  };

  // Update URL when project changes
  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSearchParams((prev) => {
      prev.set('project', projectId);
      return prev;
    });
  };

  const selectedProject = projects?.find((p) => p.id === selectedProjectId);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Project Selector */}
          {projects && projects.length > 0 && (
            <Dropdown
              trigger={
                <button className="inline-flex items-center gap-2 px-3 py-1.5 text-lg font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                  {selectedProject?.title ?? 'Select Project'}
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              }
            >
              {projects.map((project) => (
                <DropdownItem
                  key={project.id}
                  selected={project.id === selectedProjectId}
                  onClick={() => handleProjectChange(project.id)}
                >
                  {project.title}
                </DropdownItem>
              ))}
            </Dropdown>
          )}

          {/* Task Count */}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {tasks.length} tasks
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <ViewSwitcher value={viewMode} onChange={handleViewChange} />

          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw
              className={clsx('w-4 h-4', isRefetching && 'animate-spin')}
            />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {!selectedProjectId ? (
          <div className="flex items-center justify-center h-96">
            {projectsLoading ? (
              <LoadingSpinner size="lg" label="Loading projects..." />
            ) : (
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  No project selected
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Please select a project to view tasks
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'kanban' && (
              <KanbanBoard
                tasks={tasks}
                statuses={statuses}
                projectId={selectedProjectId}
                isLoading={isLoading}
              />
            )}
            {viewMode === 'calendar' && (
              <CalendarView
                tasks={tasks}
                statuses={statuses}
                projectId={selectedProjectId}
                isLoading={isLoading}
              />
            )}
            {viewMode === 'list' && (
              <ListView
                tasks={tasks}
                statuses={statuses}
                projectId={selectedProjectId}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TaskBoard;
