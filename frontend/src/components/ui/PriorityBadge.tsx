/**
 * PriorityBadge Component
 *
 * Displays task priority with appropriate color coding and optional icon.
 * Follows Notion's minimalist design philosophy with clear visual hierarchy.
 *
 * @example
 * ```tsx
 * <PriorityBadge priority="high" />
 * <PriorityBadge priority="urgent" showLabel />
 * <PriorityBadge priority="medium" variant="dot" />
 * ```
 */

import { type ReactNode, useMemo } from 'react';
import { priorityConfig, type PriorityKey } from '../../styles/design-tokens';

// ============================================================================
// Types
// ============================================================================

export type PriorityVariant = 'badge' | 'dot' | 'minimal';
export type PrioritySize = 'sm' | 'md' | 'lg';

export interface PriorityBadgeProps {
  /** Priority level */
  priority: PriorityKey;
  /** Visual variant */
  variant?: PriorityVariant;
  /** Size of the badge */
  size?: PrioritySize;
  /** Show text label */
  showLabel?: boolean;
  /** Use Korean labels */
  useKorean?: boolean;
  /** Show icon */
  showIcon?: boolean;
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

function AlertCircleIcon({ className }: IconProps): ReactNode {
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
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ArrowUpIcon({ className }: IconProps): ReactNode {
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
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function MinusIcon({ className }: IconProps): ReactNode {
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
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ArrowDownIcon({ className }: IconProps): ReactNode {
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
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

function CircleIcon({ className }: IconProps): ReactNode {
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
    </svg>
  );
}

const priorityIcons: Record<PriorityKey, (props: IconProps) => ReactNode> = {
  urgent: AlertCircleIcon,
  high: ArrowUpIcon,
  medium: MinusIcon,
  low: ArrowDownIcon,
  none: CircleIcon,
};

// ============================================================================
// Size Configuration
// ============================================================================

const sizeClasses: Record<PrioritySize, {
  badge: string;
  dot: string;
  icon: string;
  text: string;
}> = {
  sm: {
    badge: 'px-1.5 py-0.5 text-xs',
    dot: 'w-2 h-2',
    icon: 'w-3 h-3',
    text: 'text-xs',
  },
  md: {
    badge: 'px-2 py-0.5 text-xs',
    dot: 'w-2.5 h-2.5',
    icon: 'w-3.5 h-3.5',
    text: 'text-sm',
  },
  lg: {
    badge: 'px-2.5 py-1 text-sm',
    dot: 'w-3 h-3',
    icon: 'w-4 h-4',
    text: 'text-sm',
  },
};

// ============================================================================
// Component
// ============================================================================

export function PriorityBadge({
  priority,
  variant = 'badge',
  size = 'md',
  showLabel = true,
  useKorean = false,
  showIcon = false,
  className = '',
  onClick,
}: PriorityBadgeProps): ReactNode {
  const config = useMemo(() => priorityConfig[priority], [priority]);
  const sizes = useMemo(() => sizeClasses[size], [size]);
  const label = useKorean ? config.labelKo : config.label;
  const Icon = priorityIcons[priority];

  // Dot variant - just a colored dot
  if (variant === 'dot') {
    return (
      <span
        className={`
          inline-flex items-center gap-1.5
          ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
          ${className}
        `}
        onClick={onClick}
        title={label}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      >
        <span
          className={`
            ${sizes.dot}
            ${config.dot}
            rounded-full
            flex-shrink-0
          `}
        />
        {showLabel && (
          <span className={`${sizes.text} ${config.text}`}>
            {label}
          </span>
        )}
      </span>
    );
  }

  // Minimal variant - just text with color
  if (variant === 'minimal') {
    return (
      <span
        className={`
          inline-flex items-center gap-1
          ${sizes.text}
          ${config.text}
          font-medium
          ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
          ${className}
        `}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      >
        {showIcon && <Icon className={sizes.icon} />}
        {showLabel && label}
      </span>
    );
  }

  // Badge variant (default) - full badge with background
  return (
    <span
      className={`
        inline-flex items-center gap-1
        ${sizes.badge}
        ${config.badge}
        rounded-full
        border
        font-medium
        transition-colors duration-150
        ${onClick ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {showIcon && <Icon className={`${sizes.icon} flex-shrink-0`} />}
      {showLabel && label}
    </span>
  );
}

// ============================================================================
// Priority Selector Component
// ============================================================================

export interface PrioritySelectorProps {
  /** Currently selected priority */
  value: PriorityKey;
  /** Change handler */
  onChange: (priority: PriorityKey) => void;
  /** Size of the options */
  size?: PrioritySize;
  /** Use Korean labels */
  useKorean?: boolean;
  /** Additional CSS classes for container */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

const priorityOrder: PriorityKey[] = ['urgent', 'high', 'medium', 'low', 'none'];

export function PrioritySelector({
  value,
  onChange,
  size = 'md',
  useKorean = false,
  className = '',
  disabled = false,
}: PrioritySelectorProps): ReactNode {
  return (
    <div
      className={`
        inline-flex flex-wrap gap-1.5
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
      role="radiogroup"
      aria-label="Priority selector"
    >
      {priorityOrder.map((priority) => (
        <button
          key={priority}
          type="button"
          role="radio"
          aria-checked={value === priority}
          disabled={disabled}
          onClick={() => onChange(priority)}
          className={`
            transition-all duration-150
            ${value === priority
              ? 'ring-2 ring-offset-1 ring-blue-500'
              : 'hover:ring-1 hover:ring-gray-300'
            }
            rounded-full
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
          `}
        >
          <PriorityBadge
            priority={priority}
            size={size}
            useKorean={useKorean}
            showIcon
          />
        </button>
      ))}
    </div>
  );
}

export default PriorityBadge;
