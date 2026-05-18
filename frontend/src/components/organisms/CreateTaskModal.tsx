/**
 * CreateTaskModal Organism Component
 * Modal for creating a new task
 */

import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { Button, Input } from '../atoms';
import { useCreateTask } from '../../hooks';
import type { WorkflowStatus, TaskPriority, CreateTaskDto } from '../../types';
import { PRIORITY_CONFIG } from '../../types';

interface CreateTaskModalProps {
  projectId: string;
  statuses: WorkflowStatus[];
  defaultStatusId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const initialFormState: CreateTaskDto = {
  title: '',
  content: '',
  priority: undefined,
  status_id: undefined,
  end_date: undefined,
};

export function CreateTaskModal({
  projectId,
  statuses,
  defaultStatusId,
  isOpen,
  onClose,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState<CreateTaskDto>({
    ...initialFormState,
    project_id: projectId,
    status_id: defaultStatusId,
  });

  const createTask = useCreateTask();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title.trim()) return;

      try {
        await createTask.mutateAsync({
          ...formData,
          project_id: projectId,
        });
        setFormData({ ...initialFormState, project_id: projectId, status_id: defaultStatusId });
        onClose();
      } catch (error) {
        console.error('Failed to create task:', error);
      }
    },
    [formData, projectId, defaultStatusId, createTask, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

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
          'relative w-full max-w-lg',
          'bg-white dark:bg-gray-900 rounded-xl shadow-2xl',
          'm-4'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2
            id="create-task-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            Create New Task
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title *
            </label>
            <Input
              id="task-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              autoFocus
              required
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="task-status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Status
            </label>
            <select
              id="task-status"
              value={formData.status_id ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, status_id: e.target.value || undefined })
              }
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="">Select status</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label
              htmlFor="task-priority"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Priority
            </label>
            <select
              id="task-priority"
              value={formData.priority ?? ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: (e.target.value || undefined) as TaskPriority | undefined,
                })
              }
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="">No priority</option>
              {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="task-due-date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Due Date
            </label>
            <input
              id="task-due-date"
              type="date"
              value={
                formData.end_date
                  ? format(new Date(formData.end_date), 'yyyy-MM-dd')
                  : ''
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  end_date: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                })
              }
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="task-description"
              value={formData.content ?? ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none"
              placeholder="Add a description..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createTask.isPending}
              disabled={!formData.title.trim()}
            >
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default CreateTaskModal;
