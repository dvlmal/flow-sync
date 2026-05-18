/**
 * useDueDateStatus Hook
 *
 * Calculates the status of a task based on its due date and returns
 * appropriate styling classes and labels for visual representation.
 *
 * Status Categories:
 * - overdue: Due date has passed
 * - urgent: Due today
 * - soon: 1-3 days remaining
 * - normal: 4-7 days remaining
 * - plenty: 7+ days remaining
 * - none: No due date set
 */

import { useMemo } from 'react';
import { dueDateStatus, type DueDateStatusKey, type DueDateStatusConfig } from '../styles/design-tokens';

// ============================================================================
// Types
// ============================================================================

export interface DueDateStatusResult {
  /** Status key identifier */
  status: DueDateStatusKey;
  /** Status configuration with all styling classes */
  config: DueDateStatusConfig;
  /** Number of days until due date (negative if overdue, null if no date) */
  daysRemaining: number | null;
  /** Human-readable label in English */
  label: string;
  /** Human-readable label in Korean */
  labelKo: string;
  /** Formatted due date string */
  formattedDate: string | null;
  /** Whether the task is overdue */
  isOverdue: boolean;
  /** Whether the task is urgent (due today or tomorrow) */
  isUrgent: boolean;
  /** Combined className for card styling */
  cardClassName: string;
  /** Combined className for badge styling */
  badgeClassName: string;
}

export interface UseDueDateStatusOptions {
  /** Custom reference date for calculating days remaining (defaults to today) */
  referenceDate?: Date;
  /** Locale for date formatting */
  locale?: string;
  /** Date format options */
  formatOptions?: Intl.DateTimeFormatOptions;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculates the number of days between two dates (ignoring time)
 */
function getDaysDifference(from: Date, to: Date): number {
  const fromDate = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const toDate = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  const diffTime = toDate.getTime() - fromDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determines the status key based on days remaining
 */
function getStatusFromDays(daysRemaining: number | null): DueDateStatusKey {
  if (daysRemaining === null) {
    return 'none';
  }

  if (daysRemaining < 0) {
    return 'overdue';
  }

  if (daysRemaining === 0) {
    return 'urgent';
  }

  if (daysRemaining <= 3) {
    return 'soon';
  }

  if (daysRemaining <= 7) {
    return 'normal';
  }

  return 'plenty';
}

/**
 * Formats a date for display
 */
function formatDate(
  date: Date,
  locale: string = 'ko-KR',
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
}

/**
 * Gets a human-readable relative date string
 */
function getRelativeLabel(daysRemaining: number | null, locale: string = 'ko-KR'): string {
  if (daysRemaining === null) {
    return locale === 'ko-KR' ? '마감일 없음' : 'No due date';
  }

  if (locale === 'ko-KR') {
    if (daysRemaining < -1) return `${Math.abs(daysRemaining)}일 지남`;
    if (daysRemaining === -1) return '어제 마감';
    if (daysRemaining === 0) return '오늘 마감';
    if (daysRemaining === 1) return '내일 마감';
    if (daysRemaining <= 7) return `${daysRemaining}일 남음`;
    return `${daysRemaining}일 남음`;
  }

  // English
  if (daysRemaining < -1) return `${Math.abs(daysRemaining)} days overdue`;
  if (daysRemaining === -1) return 'Yesterday';
  if (daysRemaining === 0) return 'Today';
  if (daysRemaining === 1) return 'Tomorrow';
  if (daysRemaining <= 7) return `${daysRemaining} days left`;
  return `${daysRemaining} days left`;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook that calculates due date status and returns styling information
 *
 * @param dueDate - The due date (Date object, ISO string, or null/undefined)
 * @param options - Optional configuration
 * @returns DueDateStatusResult with status info and styling classes
 *
 * @example
 * ```tsx
 * function TaskCard({ task }) {
 *   const { config, daysRemaining, isOverdue, cardClassName } = useDueDateStatus(task.dueDate);
 *
 *   return (
 *     <div className={cardClassName}>
 *       <span className={config.text}>
 *         {isOverdue ? 'Overdue!' : `${daysRemaining} days left`}
 *       </span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDueDateStatus(
  dueDate: Date | string | null | undefined,
  options: UseDueDateStatusOptions = {}
): DueDateStatusResult {
  const {
    referenceDate = new Date(),
    locale = 'ko-KR',
    formatOptions,
  } = options;

  return useMemo(() => {
    // Handle null/undefined due date
    if (!dueDate) {
      const config = dueDateStatus.none;
      return {
        status: 'none',
        config,
        daysRemaining: null,
        label: config.label,
        labelKo: config.labelKo,
        formattedDate: null,
        isOverdue: false,
        isUrgent: false,
        cardClassName: `${config.bg} ${config.border} border`,
        badgeClassName: config.badge,
      };
    }

    // Parse the due date
    const parsedDate = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;

    // Validate the date
    if (isNaN(parsedDate.getTime())) {
      console.warn('useDueDateStatus: Invalid date provided:', dueDate);
      const config = dueDateStatus.none;
      return {
        status: 'none',
        config,
        daysRemaining: null,
        label: config.label,
        labelKo: config.labelKo,
        formattedDate: null,
        isOverdue: false,
        isUrgent: false,
        cardClassName: `${config.bg} ${config.border} border`,
        badgeClassName: config.badge,
      };
    }

    // Calculate days remaining
    const daysRemaining = getDaysDifference(referenceDate, parsedDate);

    // Get status and config
    const status = getStatusFromDays(daysRemaining);
    const config = dueDateStatus[status];

    // Build result
    return {
      status,
      config,
      daysRemaining,
      label: getRelativeLabel(daysRemaining, 'en-US'),
      labelKo: getRelativeLabel(daysRemaining, 'ko-KR'),
      formattedDate: formatDate(parsedDate, locale, formatOptions),
      isOverdue: status === 'overdue',
      isUrgent: status === 'overdue' || status === 'urgent',
      cardClassName: `${config.bg} ${config.border} border`,
      badgeClassName: config.badge,
    };
  }, [dueDate, referenceDate, locale, formatOptions]);
}

// ============================================================================
// Standalone Utility (for non-hook usage)
// ============================================================================

/**
 * Calculate due date status without React hooks
 * Useful for server-side rendering or non-component contexts
 */
export function calculateDueDateStatus(
  dueDate: Date | string | null | undefined,
  referenceDate: Date = new Date()
): { status: DueDateStatusKey; daysRemaining: number | null; config: DueDateStatusConfig } {
  if (!dueDate) {
    return {
      status: 'none',
      daysRemaining: null,
      config: dueDateStatus.none,
    };
  }

  const parsedDate = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;

  if (isNaN(parsedDate.getTime())) {
    return {
      status: 'none',
      daysRemaining: null,
      config: dueDateStatus.none,
    };
  }

  const daysRemaining = getDaysDifference(referenceDate, parsedDate);
  const status = getStatusFromDays(daysRemaining);

  return {
    status,
    daysRemaining,
    config: dueDateStatus[status],
  };
}

export default useDueDateStatus;
