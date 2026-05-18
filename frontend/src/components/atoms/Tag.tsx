/**
 * Tag Atom Component
 * Single tag chip with color and optional remove button
 */

import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { TAG_COLORS } from '../../types';

interface TagProps {
  label: string;
  color?: keyof typeof TAG_COLORS;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function Tag({
  label,
  color = 'gray',
  removable = false,
  onRemove,
  className,
}: TagProps) {
  const colorClasses = TAG_COLORS[color] ?? TAG_COLORS.gray;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
        'transition-colors duration-150',
        colorClasses.bg,
        colorClasses.text,
        colorClasses.darkBg,
        colorClasses.darkText,
        className
      )}
    >
      {label}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-0.5 -mr-1 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

export default Tag;
