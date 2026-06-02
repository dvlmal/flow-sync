/**
 * StatusDot Atom Component
 * Colored indicator dot for status visualization
 */

import { clsx } from 'clsx';
import { STATUS_COLORS, WORKFLOW_STATUS_COLORS } from '../../types';
import type { WorkflowStatusColor } from '../../types';

interface StatusDotProps {
  status?: string;
  color?: WorkflowStatusColor | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
};

export function StatusDot({ status, color, size = 'md', className }: StatusDotProps) {
  // color prop takes precedence over status-based color lookup
  const colorClass = color
    ? WORKFLOW_STATUS_COLORS[color]?.bg ?? 'bg-gray-400'
    : STATUS_COLORS[status ?? ''] ?? 'bg-gray-400';

  return (
    <span
      className={clsx(
        'inline-block rounded-full flex-shrink-0',
        sizeClasses[size],
        colorClass,
        className
      )}
      role="img"
      aria-label={status ?? color ?? 'status'}
    />
  );
}

export default StatusDot;
