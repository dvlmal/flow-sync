/**
 * TaskCard Organism Component
 * Draggable task card for Kanban board
 */

import { forwardRef, memo } from 'react';
import { clsx } from 'clsx';
import { GripVertical } from 'lucide-react';
import { PriorityIcon, Tag } from '../atoms';
import { AvatarGroup, DateDisplay } from '../molecules';
import type { Task } from '../../types';
import type { TAG_COLORS } from '../../types';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  className?: string;
}

// Parse tags into array of tag objects
function parseTags(tags: string[] | null | undefined): { label: string; color: keyof typeof TAG_COLORS }[] {
  if (!tags || !Array.isArray(tags)) return [];

  const colors: (keyof typeof TAG_COLORS)[] = ['blue', 'green', 'yellow', 'red', 'purple', 'pink', 'orange'];

  return tags.map((tag, index) => ({
    label: String(tag).trim(),
    color: colors[index % colors.length],
  }));
}

export const TaskCard = memo(
  forwardRef<HTMLDivElement, TaskCardProps>(
    ({ task, onClick, isDragging, dragHandleProps, className }, ref) => {
      const tags = parseTags(task.tags);

      return (
        <div
          ref={ref}
          onClick={onClick}
          className={clsx(
            'group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
            'p-3 cursor-pointer',
            'transition-all duration-150',
            'hover:border-gray-300 dark:hover:border-gray-600',
            'hover:shadow-md',
            isDragging && 'shadow-lg rotate-2 scale-105',
            className
          )}
        >
          <div className="flex items-start gap-2">
            {/* Drag handle */}
            <div
              {...dragHandleProps}
              className={clsx(
                'flex-shrink-0 mt-0.5 cursor-grab active:cursor-grabbing',
                'opacity-0 group-hover:opacity-100 transition-opacity',
                'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5 line-clamp-2">
                {task.title}
              </h3>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {tags.slice(0, 3).map((tag, index) => (
                    <Tag key={index} label={tag.label} color={tag.color} />
                  ))}
                  {tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{tags.length - 3}</span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <PriorityIcon priority={task.priority} size="sm" />
                  <DateDisplay date={task.endDate} />
                </div>

                {task.assignees && task.assignees.length > 0 && (
                  <AvatarGroup assignees={task.assignees} max={2} size="sm" />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  )
);

TaskCard.displayName = 'TaskCard';

export default TaskCard;
