/**
 * ViewSwitcher Molecule Component
 * Tab-style view mode selector (Kanban | Calendar | List)
 */

import { LayoutGrid, Calendar, List } from 'lucide-react';
import { clsx } from 'clsx';
import type { ViewMode } from '../../types';

interface ViewSwitcherProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

const views: { mode: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
  { mode: 'kanban', label: 'Kanban', icon: LayoutGrid },
  { mode: 'calendar', label: 'Calendar', icon: Calendar },
  { mode: 'list', label: 'List', icon: List },
];

export function ViewSwitcher({ value, onChange, className }: ViewSwitcherProps) {
  return (
    <div
      className={clsx(
        'inline-flex items-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1',
        className
      )}
      role="tablist"
    >
      {views.map(({ mode, label, icon: Icon }) => (
        <button
          key={mode}
          type="button"
          role="tab"
          aria-selected={value === mode}
          onClick={() => onChange(mode)}
          className={clsx(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium',
            'transition-colors duration-150',
            value === mode
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          )}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

export default ViewSwitcher;
