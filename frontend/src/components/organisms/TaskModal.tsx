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
import { StatusBadge, AvatarGroup, AssigneeEditor } from '../molecules';
import { useUpdateTask, useDeleteTask } from '../../hooks';
import type { Task, TaskPriority, WorkflowStatus, UpdateTaskDto } from '../../types';
import { PRIORITY_CONFIG, STATUS_LABELS } from '../../types';

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
        statusId: task.statusId ?? undefined,
        startDate: task.startDate ?? undefined,
        endDate: task.endDate ?? undefined,
        assignees: task.assignees ?? [],
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

  const currentStatus = statuses.find((s) => s.id === task.statusId);

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
            {currentStatus && <StatusBadge status={currentStatus.name} color={currentStatus.color} />}
            <span className="text-xs text-gray-500">
              수정됨 {task.updatedAt ? format(parseISO(task.updatedAt), 'yyyy년 M월 d일') : '알 수 없음'}
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
                  취소
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  loading={updateTask.isPending}
                >
                  저장
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                수정
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="닫기"
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
                placeholder="작업 제목"
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
                상태
              </div>
              {isEditing ? (
                <select
                  value={editedTask.statusId ?? ''}
                  onChange={(e) => setEditedTask({ ...editedTask, statusId: e.target.value || undefined })}
                  className="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <option value="">상태 없음</option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {STATUS_LABELS[status.name] ?? status.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {currentStatus ? (STATUS_LABELS[currentStatus.name] ?? currentStatus.name) : '상태 없음'}
                </span>
              )}
            </div>

            {/* Priority */}
            <div className="flex items-center gap-4">
              <div className="w-24 flex items-center gap-2 text-sm text-gray-500">
                <Flag className="w-4 h-4" />
                우선순위
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
                  <option value="">우선순위 없음</option>
                  {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                  <PriorityIcon priority={task.priority} showLabel />
                  {!task.priority && '우선순위 없음'}
                </span>
              )}
            </div>

            {/* Start Date */}
            <div className="flex items-center gap-4">
              <div className="w-24 flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                시작일
              </div>
              {isEditing ? (
                <input
                  type="date"
                  value={editedTask.startDate ? format(parseISO(editedTask.startDate), 'yyyy-MM-dd') : ''}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    })
                  }
                  className="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              ) : (
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {task.startDate ? format(parseISO(task.startDate), 'yyyy년 M월 d일') : '시작일 없음'}
                </span>
              )}
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-4">
              <div className="w-24 flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                마감일
              </div>
              {isEditing ? (
                <input
                  type="date"
                  value={editedTask.endDate ? format(parseISO(editedTask.endDate), 'yyyy-MM-dd') : ''}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    })
                  }
                  className="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              ) : (
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {task.endDate ? format(parseISO(task.endDate), 'yyyy년 M월 d일') : '마감일 없음'}
                </span>
              )}
            </div>

            {/* Assignees */}
            <div className="flex items-start gap-4">
              <div className="w-24 flex items-center gap-2 text-sm text-gray-500 pt-1">
                <User className="w-4 h-4" />
                담당자
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <AssigneeEditor
                    assignees={editedTask.assignees ?? []}
                    onChange={(newAssignees) =>
                      setEditedTask({ ...editedTask, assignees: newAssignees })
                    }
                  />
                ) : (
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {task.assignees && task.assignees.length > 0 ? (
                      <AvatarGroup assignees={task.assignees} max={5} size="md" />
                    ) : (
                      '담당자 없음'
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content/Description */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <AlignLeft className="w-4 h-4" />
              설명
            </div>
            {isEditing ? (
              <textarea
                value={editedTask.content ?? ''}
                onChange={(e) => setEditedTask({ ...editedTask, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none"
                placeholder="설명 추가..."
              />
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {task.content || '설명 없음'}
              </p>
            )}
          </div>

          {/* Delete Section */}
          {isEditing && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {showDeleteConfirm ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-red-600">이 작업을 삭제하시겠습니까?</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    loading={deleteTask.isPending}
                  >
                    삭제
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    취소
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
                  작업 삭제
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
