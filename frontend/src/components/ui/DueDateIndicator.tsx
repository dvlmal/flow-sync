/**
 * DueDateIndicator Component
 *
 * Displays due date status with appropriate color coding and time-based urgency.
 * Provides clear visual feedback about task deadlines following Notion's design principles.
 *
 * @example
 * ```tsx
 * <DueDateIndicator dueDate="2024-03-15" />
 * <DueDateIndicator dueDate={new Date()} variant="badge" />
 * <DueDateIndicator dueDate="2024-03-10" showIcon />
 * ```
 */

import { type ReactNode, useMemo } from 'react';
import { useDueDateStatus } from '../../hooks/useDueDateStatus';
import type { DueDateStatusKey } from '../../styles/design-tokens';

// ============================================================================
// Types
// ============================================================================

export type DueDateVariant = 'badge' | 'inline' | 'card' | 'minimal';
export type DueDateSize = 'sm' | 'md' | 'lg';

export interface DueDateIndicatorProps {
  /** Due date (Date object, ISO string, or null/undefined) */
  dueDate: Date | string | null | undefined;
  /** Visual variant */
  variant?: DueDateVariant;
  /** Size of the indicator */
  size?: DueDateSize;
  /** Show calendar icon */
  showIcon?: boolean;
  /** Show relative time (e.g., "3 days left") instead of date */
  showRelative?: boolean;
  /** Use Korean labels */
  useKorean?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

// ============================================================================
// Icons
// ============================================================================

interface IconProps {
  className?: string;
}

function CalendarIcon({ className }: IconProps): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon({ className }: IconProps): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function AlertTriangleIcon({ className }: IconProps): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// Select icon based on status
function getStatusIcon(status: DueDateStatusKey): (props: IconProps) => ReactNode {
  switch (status) {
    case 'overdue':
      return AlertTriangleIcon;
    case 'urgent':
      return ClockIcon;
    default:
      return CalendarIcon;
  }
}

// ============================================================================
// Size Configuration
// ============================================================================

const sizeClasses: Record<DueDateSize, {
  badge: string;
  icon: string;
  text: string;
  gap: string;
}> = {
  sm: {
    badge: 'px-1.5 py-0.5',
    icon: 'w-3 h-3',
    text: 'text-xs',
    gap: 'gap-1',
  },
  md: {
    badge: 'px-2 py-1',
    icon: 'w-3.5 h-3.5',
    text: 'text-sm',
    gap: 'gap-1.5',
  },
  lg: {
    badge: 'px-2.5 py-1.5',
    icon: 'w-4 h-4',
    text: 'text-sm',
    gap: 'gap-2',
  },
};

// ============================================================================
// Component
// ============================================================================

export function DueDateIndicator({
  dueDate,
  variant = 'badge',
  size = 'md',
  showIcon = true,
  showRelative = false,
  useKorean = false,
  className = '',
  onClick,
}: DueDateIndicatorProps): ReactNode {
  const {
    status,
    config,
    formattedDate,
    label,
    labelKo,
    isOverdue,
    isUrgent,
  } = useDueDateStatus(dueDate, {
    locale: useKorean ? 'ko-KR' : 'en-US',
  });

  const sizes = useMemo(() => sizeClasses[size], [size]);
  const Icon = useMemo(() => getStatusIcon(status), [status]);
  const displayText = showRelative
    ? (useKorean ? labelKo : label)
    : formattedDate;

  // Don't render if no due date and variant is minimal
  if (status === 'none' && variant === 'minimal') {
    return null;
  }

  // Interactive props
  const interactiveProps = onClick ? {
    onClick,
    role: 'button' as const,
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => e.key === 'Enter' && onClick(),
    className: 'cursor-pointer',
  } : {};

  // Minimal variant - just icon and text
  if (variant === 'minimal') {
    return (
      <span
        className={`
          inline-flex items-center ${sizes.gap}
          ${sizes.text}
          ${config.text}
          ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
          ${className}
        `}
        {...interactiveProps}
        title={useKorean ? labelKo : label}
      >
        {showIcon && <Icon className={`${sizes.icon} flex-shrink-0`} />}
        <span>{displayText || (useKorean ? '마감일 없음' : 'No date')}</span>
      </span>
    );
  }

  // Inline variant - compact inline display
  if (variant === 'inline') {
    return (
      <span
        className={`
          inline-flex items-center ${sizes.gap}
          ${sizes.text}
          ${config.text}
          font-medium
          ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
          ${className}
        `}
        {...interactiveProps}
        title={useKorean ? labelKo : label}
      >
        {showIcon && (
          <span
            className={`
              inline-flex items-center justify-center
              w-5 h-5 rounded
              ${config.bg} ${config.border} border
            `}
          >
            <Icon className={`${sizes.icon} ${config.icon}`} />
          </span>
        )}
        <span>{displayText || (useKorean ? '마감일 없음' : 'No date')}</span>
        {isOverdue && (
          <span className="text-red-500 font-semibold">!</span>
        )}
      </span>
    );
  }

  // Card variant - for use in task cards with background
  if (variant === 'card') {
    return (
      <div
        className={`
          inline-flex items-center ${sizes.gap}
          ${sizes.badge}
          ${config.bg} ${config.border} border
          rounded-md
          ${sizes.text}
          ${config.text}
          font-medium
          transition-all duration-150
          ${onClick ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''}
          ${className}
        `}
        {...interactiveProps}
        title={useKorean ? labelKo : label}
      >
        {showIcon && <Icon className={`${sizes.icon} ${config.icon} flex-shrink-0`} />}
        <span className="flex flex-col">
          <span>{displayText || (useKorean ? '마감일 없음' : 'No date')}</span>
          {showRelative && formattedDate && (
            <span className="text-xs opacity-75">{formattedDate}</span>
          )}
        </span>
        {isUrgent && (
          <span
            className={`
              w-1.5 h-1.5 rounded-full
              ${isOverdue ? 'bg-red-500' : 'bg-orange-500'}
              animate-pulse
            `}
          />
        )}
      </div>
    );
  }

  // Badge variant (default) - pill-shaped badge
  return (
    <span
      className={`
        inline-flex items-center ${sizes.gap}
        ${sizes.badge}
        ${config.badge}
        rounded-full border
        ${sizes.text}
        font-medium
        transition-all duration-150
        ${onClick ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''}
        ${className}
      `}
      {...interactiveProps}
      title={useKorean ? labelKo : label}
    >
      {showIcon && <Icon className={`${sizes.icon} flex-shrink-0`} />}
      <span>{displayText || (useKorean ? '미정' : 'No date')}</span>
      {isUrgent && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full ml-0.5
            ${isOverdue ? 'bg-red-500' : 'bg-orange-500'}
            ${isOverdue ? 'animate-pulse' : ''}
          `}
        />
      )}
    </span>
  );
}

// ============================================================================
// Due Date Status List (for legend/reference)
// ============================================================================

export interface DueDateStatusListProps {
  /** Use Korean labels */
  useKorean?: boolean;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Size */
  size?: DueDateSize;
  /** Additional CSS classes */
  className?: string;
}

export function DueDateStatusList({
  useKorean = false,
  orientation = 'horizontal',
  size = 'sm',
  className = '',
}: DueDateStatusListProps): ReactNode {
  const statusExamples: Array<{ key: DueDateStatusKey; date: Date | null }> = [
    { key: 'overdue', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { key: 'urgent', date: new Date() },
    { key: 'soon', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
    { key: 'normal', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
    { key: 'plenty', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) },
    { key: 'none', date: null },
  ];

  return (
    <div
      className={`
        flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
        gap-2
        ${className}
      `}
    >
      {statusExamples.map(({ date }) => (
        <DueDateIndicator
          key={date?.toISOString() ?? 'none'}
          dueDate={date}
          size={size}
          showRelative
          useKorean={useKorean}
        />
      ))}
    </div>
  );
}

export default DueDateIndicator;
