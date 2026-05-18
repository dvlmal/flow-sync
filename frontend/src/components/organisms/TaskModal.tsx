/**
 * TaskModal Organism Component
 * Modal for viewing and editing task details
 */

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, User, Flag, Tag as TagIcon, AlignLeft, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { Button, Input, PriorityIcon } from '../atoms';
import { StatusBadge, AvatarGroup } from '../molecules';
import { useUpdateTask, useDeleteTask } from '../../hooks';
import type { Task, TaskPriority, WorkflowStatus, UpdateTaskDto } from '../../types';
import { PRIORITY_CONFIG } from '../../types';

interface TaskModalProps {
  task: Task | null;
  statuses: WorkflowStatus[];
  isOpen: boolean;
  onClose: () => void;
}

export function TaskModal({ task, statuses, isOpen, onClose }: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<UpdateTaskDto>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  // Reset state when task changes
  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        content: task.content ?? '',
        priority: task.priority ?? undefined,
        status_id: task.status_id ?? undefined,
        start_date: task.start_date ?? undefined,
        end_date: task.end_date ?? undefined,
      });
      setIsEditing(false);
      setShowDeleteConfirm(false);
    }
  }, [task]);

  const handleSave = useCallback(async () => {
    if (!task) return;

    try {
      await updateTask.mutateAsync({ id: task.id, dto: editedTask });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }, [task, editedTask, updateTask]);

  const handleDelete = useCallback(async () => {
    if (!task) return;

    try {
      await deleteTask.mutateAsync(task.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }, [task, deleteTask, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditing) {
          setIsEditing(false);
        } else {
          onClose();
        }
      }
    },
    [isEditing, onClose]
  );

  if (!isOpen || !task) return null;

  const currentStatus = statuses.find((s) => s.id === task.status_id);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={clsx(
          'relative w-full max-w-2xl max-h-[90vh] overflow-auto',
          'bg-white dark:bg-gray-900 rounded-xl shadow-2xl',
          'm-4'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentStatus && <StatusBadge status={currentStatus.name} />}
            <span className="text-xs text-gray-500">
              Updated {task.updated_at ? format(parseISO(task.updated_at), 'MMM d, yyyy') : 'Unknown'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  loading={updateTask.isPending}
                >
                  Save
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <div className="mb-6">
            {isEditing ? (
              <Input
                value={editedTask.title ?? ''}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="text-xl font-semibold"
                placeholder="Task title"
                autoFocus
              />
            ) : (
              <h2
                id="task-modal-title"
                className="text-xl font-semibold text-gray-900 dark:text-gray-100"
              >
                {task.title}
              </h2>
            )}
          </div>

          {/* Properties */}
          <div className="space-y-4 mb-6">
            {/* Status */}
            <div className="flex items-center gap-4">
              <div className="w-24 flex items-center gap-2 text-sm text-gray-500">
                <TagIcon className="w-4 h-4" />
                Status
              </div>
              {isEditing ? (
                <select
                  value={editedTask.status_id ?? ''}
                  onChange={(e) => setEditedTask({ ...editedTask, status_id: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <option value="">No status</option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {currentStatus?.name ?? 'No status'}
                </span>
              )}
            </div>

            {/* Priority */}
            <div className="flex items-center gap-4">
              <div className="w-24 flex items-center gap-2 text-sm text-gray-500">
                <Flag className="w-4 h-4" />
                Priority
              </div>
              {isEditing ? (
                <select
                  value={editedTask.priority ?? ''}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      priority: (e.target.value || undefined) as TaskPriority | undefined,
                    })
                  }
                  className="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <option value="">No priority</option>
                  {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                  <PriorityIcon priority={task.priority} showLabel />
                  {!task.priority && 'No priority'}
                </span>
              )}
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-4">
              <div className="w-24 flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                Due Date
              </div>
              {isEditing ? (
                <input
                  type="date"
                  value={editedTask.end_date ? format(parseISO(editedTask.end_date), 'yyyy-MM-dd') : ''}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      end_date: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    })
                  }
                  className="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              ) : (
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {task.end_date ? format(parseISO(task.end_date), 'MMM d, yyyy') : 'No due date'}
                </span>
              )}
            </div>

            {/* Assignees */}
            <div className="flex items-center gap-4">
              <div className="w-24 flex items-center gap-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                Assignees
              </div>
              <span className="text-sm text-gray-900 dark:text-gray-100">
                {task.assignees && task.assignees.length > 0 ? (
                  <AvatarGroup assignees={task.assignees} max={5} size="md" />
                ) : (
                  'No assignees'
                )}
              </span>
            </div>
          </div>

          {/* Content/Description */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <AlignLeft className="w-4 h-4" />
              Description
            </div>
            {isEditing ? (
              <textarea
                value={editedTask.content ?? ''}
                onChange={(e) => setEditedTask({ ...editedTask, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none"
                placeholder="Add description..."
              />
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {task.content || 'No description'}
              </p>
            )}
          </div>

          {/* Delete Section */}
          {isEditing && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {showDeleteConfirm ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-red-600">Delete this task?</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    loading={deleteTask.isPending}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Task
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default TaskModal;
