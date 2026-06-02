/**
 * CreateTaskModal Organism Component
 * Modal for creating a new task
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { Button, Input } from '../atoms';
import { useCreateTask } from '../../hooks';
import type { WorkflowStatus, TaskPriority, CreateTaskDto } from '../../types';
import { PRIORITY_CONFIG, STATUS_LABELS } from '../../types';

interface CreateTaskModalProps {
  projectId: string;
  statuses: WorkflowStatus[];
  defaultStatusId?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
  isOpen: boolean;
  onClose: () => void;
}

const initialFormState: CreateTaskDto = {
  title: '',
  content: '',
  priority: undefined,
  statusId: undefined,
  startDate: undefined,
  endDate: undefined,
};

export function CreateTaskModal({
  projectId,
  statuses,
  defaultStatusId,
  defaultStartDate,
  defaultEndDate,
  isOpen,
  onClose,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState<CreateTaskDto>({
    ...initialFormState,
    projectId: projectId,
    statusId: defaultStatusId,
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });
  const [dateError, setDateError] = useState<string | null>(null);
  const startDateRef = useRef<HTMLInputElement>(null);

  const createTask = useCreateTask();

  // Reset form when modal opens with new default values
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...initialFormState,
        projectId: projectId,
        statusId: defaultStatusId,
        startDate: defaultStartDate,
        endDate: defaultEndDate,
      });
      setDateError(null);
    }
  }, [isOpen, projectId, defaultStatusId, defaultStartDate, defaultEndDate]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title.trim()) return;

      // Validate that at least startDate is provided
      if (!formData.startDate && !formData.endDate) {
        setDateError('시작일을 입력해주세요.');
        startDateRef.current?.focus();
        return;
      }

      setDateError(null);

      try {
        // If startDate is set but endDate is not, use startDate as endDate
        const taskData = {
          ...formData,
          projectId: projectId,
          endDate: formData.endDate || formData.startDate,
        };

        await createTask.mutateAsync(taskData);
        setFormData({ ...initialFormState, projectId: projectId, statusId: defaultStatusId });
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
            새 작업 만들기
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="닫기"
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
              제목 *
            </label>
            <Input
              id="task-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="작업 제목 입력"
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
              상태
            </label>
            <select
              id="task-status"
              value={formData.statusId ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, statusId: e.target.value || undefined })
              }
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="">상태 선택</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {STATUS_LABELS[status.name] ?? status.name}
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
              우선순위
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
              <option value="">우선순위 없음</option>
              {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label
              htmlFor="task-start-date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              시작일 *
            </label>
            <input
              ref={startDateRef}
              id="task-start-date"
              type="date"
              value={
                formData.startDate
                  ? format(new Date(formData.startDate), 'yyyy-MM-dd')
                  : ''
              }
              onChange={(e) => {
                setFormData({
                  ...formData,
                  startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                });
                if (dateError) setDateError(null);
              }}
              className={clsx(
                "w-full px-3 py-2 text-sm rounded-md border bg-white dark:bg-gray-800",
                dateError
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-200 dark:border-gray-700"
              )}
            />
            {dateError && (
              <p className="mt-1 text-sm text-red-500">{dateError}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="task-due-date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              마감일
            </label>
            <input
              id="task-due-date"
              type="date"
              value={
                formData.endDate
                  ? format(new Date(formData.endDate), 'yyyy-MM-dd')
                  : ''
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
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
              설명
            </label>
            <textarea
              id="task-description"
              value={formData.content ?? ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none"
              placeholder="설명 추가..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              취소
            </Button>
            <Button
              type="submit"
              loading={createTask.isPending}
              disabled={!formData.title.trim()}
            >
              작업 만들기
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default CreateTaskModal;
