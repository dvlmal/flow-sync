/**
 * NavigationLink Molecule Component
 * Clickable navigation item with icon and chevron
 * Following Notion's list item interaction patterns
 */

import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';

interface NavigationLinkProps {
  to: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  badge?: ReactNode;
  className?: string;
}

export function NavigationLink({
  to,
  icon: Icon,
  title,
  description,
  badge,
  className,
}: NavigationLinkProps) {
  return (
    <Link
      to={to}
      className={clsx(
        'group flex items-center justify-between p-3 rounded-lg',
        'border border-gray-200 dark:border-gray-700',
        'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        'transition-colors duration-150',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {title}
          </p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-3">
        {badge}
        <ChevronRight
          className={clsx(
            'w-5 h-5 text-gray-400',
            'transition-transform duration-150',
            'group-hover:translate-x-0.5'
          )}
        />
      </div>
    </Link>
  );
}

export default NavigationLink;
