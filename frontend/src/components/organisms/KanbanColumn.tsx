/**
 * KanbanColumn Organism Component
 * Single column in the Kanban board with droppable area
 */

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { clsx } from 'clsx';
import { Plus, MoreHorizontal } from 'lucide-react';
import { SortableTaskCard } from './SortableTaskCard';
import { StatusDot } from '../atoms';
import type { Task, WorkflowStatus } from '../../types';

interface KanbanColumnProps {
  status: WorkflowStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
}

export function KanbanColumn({ status, tasks, onTaskClick, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status.id,
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      className={clsx(
        'flex-shrink-0 w-72 flex flex-col',
        'bg-gray-50 dark:bg-gray-800/50 rounded-xl'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <StatusDot status={status.name} />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {status.name}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onAddTask}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            aria-label="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div
        ref={setNodeRef}
        className={clsx(
          'flex-1 px-2 pb-2 min-h-[100px] space-y-2',
          'transition-colors duration-150',
          isOver && 'bg-blue-50 dark:bg-blue-900/20 rounded-lg'
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>

        {/* Empty state */}
        {tasks.length === 0 && (
          <div
            className={clsx(
              'flex items-center justify-center h-24 rounded-lg border-2 border-dashed',
              'border-gray-200 dark:border-gray-700',
              isOver && 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
            )}
          >
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Drop tasks here
            </span>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <button
        onClick={onAddTask}
        className={clsx(
          'flex items-center gap-2 px-3 py-2 mx-2 mb-2 rounded-lg',
          'text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
          'hover:bg-gray-200 dark:hover:bg-gray-700',
          'transition-colors'
        )}
      >
        <Plus className="w-4 h-4" />
        Add task
      </button>
    </div>
  );
}

export default KanbanColumn;
