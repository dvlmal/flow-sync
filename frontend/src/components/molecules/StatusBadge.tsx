/**
 * StatusBadge Molecule Component
 * StatusDot + label combination
 */

import { clsx } from 'clsx';
import { StatusDot } from '../atoms';
import { STATUS_LABELS } from '../../types';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = STATUS_LABELS[status] ?? status;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium',
        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        className
      )}
    >
      <StatusDot status={status} size="sm" />
      {label}
    </span>
  );
}

export default StatusBadge;
