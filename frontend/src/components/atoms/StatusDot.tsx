/**
 * StatusDot Atom Component
 * Colored indicator dot for status visualization
 */

import { clsx } from 'clsx';
import { STATUS_COLORS } from '../../types';

interface StatusDotProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
};

export function StatusDot({ status, size = 'md', className }: StatusDotProps) {
  const colorClass = STATUS_COLORS[status] ?? 'bg-gray-400';

  return (
    <span
      className={clsx(
        'inline-block rounded-full flex-shrink-0',
        sizeClasses[size],
        colorClass,
        className
      )}
      role="img"
      aria-label={status}
    />
  );
}

export default StatusDot;
