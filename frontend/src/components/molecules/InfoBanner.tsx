/**
 * InfoBanner Molecule Component
 * Contextual information banner with variants
 * Following Notion's subtle notification patterns
 */

import { clsx } from 'clsx';
import { Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import type { ReactNode, ComponentType } from 'react';

type InfoBannerVariant = 'info' | 'success' | 'warning' | 'error';

interface InfoBannerProps {
  variant?: InfoBannerVariant;
  icon?: ComponentType<{ className?: string }>;
  title?: string;
  children: ReactNode;
  className?: string;
}

const variantConfig: Record<
  InfoBannerVariant,
  {
    icon: ComponentType<{ className?: string }>;
    containerClass: string;
    iconClass: string;
    titleClass: string;
    textClass: string;
  }
> = {
  info: {
    icon: Info,
    containerClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    iconClass: 'text-blue-500 dark:text-blue-400',
    titleClass: 'text-blue-800 dark:text-blue-200',
    textClass: 'text-blue-700 dark:text-blue-300',
  },
  success: {
    icon: CheckCircle,
    containerClass: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    iconClass: 'text-green-500 dark:text-green-400',
    titleClass: 'text-green-800 dark:text-green-200',
    textClass: 'text-green-700 dark:text-green-300',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    iconClass: 'text-yellow-500 dark:text-yellow-400',
    titleClass: 'text-yellow-800 dark:text-yellow-200',
    textClass: 'text-yellow-700 dark:text-yellow-300',
  },
  error: {
    icon: AlertCircle,
    containerClass: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    iconClass: 'text-red-500 dark:text-red-400',
    titleClass: 'text-red-800 dark:text-red-200',
    textClass: 'text-red-700 dark:text-red-300',
  },
};

export function InfoBanner({
  variant = 'info',
  icon: CustomIcon,
  title,
  children,
  className,
}: InfoBannerProps) {
  const config = variantConfig[variant];
  const Icon = CustomIcon ?? config.icon;

  return (
    <div
      className={clsx(
        'flex gap-3 p-3 rounded-lg border',
        config.containerClass,
        className
      )}
      role="alert"
    >
      <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClass)} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className={clsx('font-medium text-sm', config.titleClass)}>
            {title}
          </p>
        )}
        <div className={clsx('text-sm', config.textClass)}>{children}</div>
      </div>
    </div>
  );
}

export default InfoBanner;
