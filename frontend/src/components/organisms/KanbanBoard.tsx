/**
 * KanbanBoard Organism Component
 * Drag and drop Kanban board using dnd-kit
 */

import { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { CreateTaskModal } from './CreateTaskModal';
import { LoadingSpinner, EmptyState } from '../molecules';
import { useUpdateTaskStatus } from '../../hooks';
import type { Task, WorkflowStatus } from '../../types';

interface KanbanBoardProps {
  tasks: Task[];
  statuses: WorkflowStatus[];
  projectId: string;
  isLoading?: boolean;
}

export function KanbanBoard({ tasks, statuses, projectId, isLoading }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [defaultStatusId, setDefaultStatusId] = useState<string | undefined>();

  const updateTaskStatus = useUpdateTaskStatus();

  // Get selected task from tasks array (synced with cache)
  const selectedTask = useMemo(
    () => (selectedTaskId ? tasks.find((t) => t.id === selectedTaskId) ?? null : null),
    [selectedTaskId, tasks]
  );

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, Task[]> = {};

    // Initialize with all status IDs
    statuses.forEach((status) => {
      grouped[status.id] = [];
    });

    // Add "No Status" column
    grouped['no-status'] = [];

    // Group tasks
    tasks.forEach((task) => {
      const statusId = task.statusId ?? 'no-status';
      if (grouped[statusId]) {
        grouped[statusId].push(task);
      } else {
        grouped['no-status'].push(task);
      }
    });

    return grouped;
  }, [tasks, statuses]);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement before drag starts
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  }, [tasks]);

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Could add visual feedback during drag over
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const taskId = active.id as string;
      const overId = over.id as string;

      // Find the task
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      // Determine target status
      let newStatusId: string | null = null;

      // Check if dropped on a column
      const targetStatus = statuses.find((s) => s.id === overId);
      if (targetStatus) {
        newStatusId = targetStatus.id;
      } else if (overId === 'no-status') {
        newStatusId = null;
      } else {
        // Check if dropped on another task - get that task's status
        const targetTask = tasks.find((t) => t.id === overId);
        if (targetTask) {
          newStatusId = targetTask.statusId ?? null;
        }
      }

      // Only update if status changed
      const currentStatusId = task.statusId ?? null;
      if (newStatusId !== currentStatusId) {
        updateTaskStatus.mutate({
          id: taskId,
          statusId: newStatusId ?? '',
        });
      }
    },
    [tasks, statuses, updateTaskStatus]
  );

  const handleAddTask = useCallback((statusId?: string) => {
    setDefaultStatusId(statusId);
    setCreateModalOpen(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" label="Loading tasks..." />
      </div>
    );
  }

  // Include "No Status" column if there are tasks without status
  const columnsToShow = [
    ...statuses.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    ...(tasksByStatus['no-status']?.length > 0
      ? [{ id: 'no-status', name: 'No Status', projectId: projectId, sortOrder: 999 }]
      : []),
  ];

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]">
          {columnsToShow.length === 0 ? (
            <div className="flex-1">
              <EmptyState
                title="No workflow statuses"
                description="Create workflow statuses to organize your tasks."
              />
            </div>
          ) : (
            columnsToShow.map((status) => (
              <KanbanColumn
                key={status.id}
                status={status}
                tasks={tasksByStatus[status.id] ?? []}
                onTaskClick={(task) => setSelectedTaskId(task.id)}
                onAddTask={() => handleAddTask(status.id === 'no-status' ? undefined : status.id)}
              />
            ))
          )}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} isDragging className="w-72" />
          )}
        </DragOverlay>
      </DndContext>

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
        defaultStatusId={defaultStatusId}
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
}

export default KanbanBoard;
