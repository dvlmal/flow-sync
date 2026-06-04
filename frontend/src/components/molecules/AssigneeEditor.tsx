/**
 * AssigneeEditor Molecule Component
 * Editable list of assignees with add/remove functionality
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { X, Plus, User } from 'lucide-react';
import { clsx } from 'clsx';
import { Avatar } from '../atoms';
import type { Assignee } from '../../types';

interface AssigneeEditorProps {
  assignees: Assignee[];
  onChange: (assignees: Assignee[]) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Generate a simple unique ID for new assignees
 */
function generateAssigneeId(): string {
  return `assignee-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AssigneeEditor({
  assignees,
  onChange,
  disabled = false,
  className,
}: AssigneeEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when adding mode is enabled
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddAssignee = useCallback(() => {
    const trimmedName = newName.trim();
    if (!trimmedName) return;

    // Check for duplicate names
    const exists = assignees.some(
      (a) => a.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (exists) {
      setNewName('');
      setIsAdding(false);
      return;
    }

    const newAssignee: Assignee = {
      id: generateAssigneeId(),
      name: trimmedName,
    };

    onChange([...assignees, newAssignee]);
    setNewName('');
    setIsAdding(false);
  }, [assignees, newName, onChange]);

  const handleRemoveAssignee = useCallback(
    (assigneeId: string) => {
      onChange(assignees.filter((a) => a.id !== assigneeId));
    },
    [assignees, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddAssignee();
      } else if (e.key === 'Escape') {
        setNewName('');
        setIsAdding(false);
      }
    },
    [handleAddAssignee]
  );

  if (disabled) {
    return (
      <div className={clsx('flex items-center gap-2 flex-wrap', className)}>
        {assignees.length > 0 ? (
          assignees.map((assignee) => (
            <div
              key={assignee.id}
              className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
            >
              <Avatar name={assignee.name} src={assignee.avatarUrl} size="sm" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {assignee.name}
              </span>
            </div>
          ))
        ) : (
          <span className="text-sm text-gray-500">담당자 없음</span>
        )}
      </div>
    );
  }

  return (
    <div className={clsx('flex items-center gap-2 flex-wrap', className)}>
      {/* Existing Assignees */}
      {assignees.map((assignee) => (
        <div
          key={assignee.id}
          className="group flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Avatar name={assignee.name} src={assignee.avatarUrl} size="sm" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {assignee.name}
          </span>
          <button
            type="button"
            onClick={() => handleRemoveAssignee(assignee.id)}
            className="p-0.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-all"
            aria-label={`${assignee.name} 제거`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}

      {/* Add New Assignee */}
      {isAdding ? (
        <div className="flex items-center gap-1">
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!newName.trim()) {
                setIsAdding(false);
              }
            }}
            placeholder="이름 입력"
            className="w-28 px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddAssignee}
            disabled={!newName.trim()}
            className="p-1 rounded-md text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="담당자 추가"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setNewName('');
              setIsAdding(false);
            }}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="취소"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-2 py-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border border-dashed border-gray-300 dark:border-gray-600 rounded-full hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <User className="w-3.5 h-3.5" />
          추가
        </button>
      )}
    </div>
  );
}

export default AssigneeEditor;
