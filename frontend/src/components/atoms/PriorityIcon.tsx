/**
 * PriorityIcon Atom Component
 * Visual indicator for task priority
 */

import { Minus, Equal, ChevronUp, ChevronsUp } from 'lucide-react';
import { clsx } from 'clsx';
import type { TaskPriority } from '../../types';
import { PRIORITY_CONFIG } from '../../types';

interface PriorityIconProps {
  priority: TaskPriority | null | undefined;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const iconComponents = {
  minus: Minus,
  equal: Equal,
  'chevron-up': ChevronUp,
  'chevrons-up': ChevronsUp,
};

export function PriorityIcon({
  priority,
  showLabel = false,
  size = 'md',
  className,
}: PriorityIconProps) {
  if (!priority) return null;

  const config = PRIORITY_CONFIG[priority];
  if (!config) return null;

  const IconComponent = iconComponents[config.icon as keyof typeof iconComponents];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1',
        config.color,
        className
      )}
      title={config.label}
    >
      <IconComponent className={sizeClasses[size]} />
      {showLabel && <span className="text-xs font-medium">{config.label}</span>}
    </span>
  );
}

export default PriorityIcon;
