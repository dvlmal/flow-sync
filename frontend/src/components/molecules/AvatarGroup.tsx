/**
 * AvatarGroup Molecule Component
 * Group of stacked avatars for assignees
 */

import { clsx } from 'clsx';
import { Avatar } from '../atoms';
import type { Assignee } from '../../types';

interface AvatarGroupProps {
  assignees: Assignee[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarGroup({ assignees, max = 3, size = 'sm', className }: AvatarGroupProps) {
  if (!assignees || assignees.length === 0) return null;

  const displayed = assignees.slice(0, max);
  const remaining = assignees.length - max;

  return (
    <div className={clsx('flex -space-x-1.5', className)}>
      {displayed.map((assignee) => (
        <Avatar
          key={assignee.id}
          name={assignee.name}
          src={assignee.avatarUrl}
          size={size}
          className="ring-2 ring-white dark:ring-gray-900"
        />
      ))}
      {remaining > 0 && (
        <span
          className={clsx(
            'inline-flex items-center justify-center rounded-full font-medium',
            'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
            'ring-2 ring-white dark:ring-gray-900',
            size === 'sm' && 'w-5 h-5 text-[10px]',
            size === 'md' && 'w-6 h-6 text-xs',
            size === 'lg' && 'w-8 h-8 text-sm'
          )}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
}

export default AvatarGroup;
