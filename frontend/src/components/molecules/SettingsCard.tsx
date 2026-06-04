/**
 * SettingsCard Molecule Component
 * Card container for settings sections with icon and title
 * Following Notion's minimal design language
 */

import { clsx } from 'clsx';
import type { ComponentType, ReactNode } from 'react';

interface SettingsCardProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export function SettingsCard({
  icon: Icon,
  title,
  description,
  disabled,
  className,
  children,
}: SettingsCardProps) {
  return (
    <section
      className={clsx(
        'bg-white dark:bg-gray-900 rounded-xl',
        'border border-gray-200 dark:border-gray-800',
        'transition-opacity duration-150',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div
          className={clsx(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            'bg-gray-100 dark:bg-gray-800'
          )}
        >
          <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export default SettingsCard;
