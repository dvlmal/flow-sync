/**
 * SyncStatusFeedback Molecule Component
 * Animated feedback for sync operations
 * Following Notion's subtle feedback patterns
 */

import { clsx } from 'clsx';
import { Check, AlertCircle, RefreshCw } from 'lucide-react';
import type { SyncStatus } from '../../types';

interface SyncStatusFeedbackProps {
  status: SyncStatus;
  onRetry?: () => void;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
}

export function SyncStatusFeedback({
  status,
  onRetry,
  successMessage = '완료',
  errorMessage = '실패',
  className,
}: SyncStatusFeedbackProps) {
  if (status === 'IDLE' || status === 'PENDING') return null;

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 text-sm font-medium',
        'transition-all duration-200',
        status === 'SUCCESS' && 'text-green-600 dark:text-green-400 animate-fade-in',
        status === 'ERROR' && 'text-red-600 dark:text-red-400',
        className
      )}
    >
      {status === 'SUCCESS' && (
        <>
          <Check className="w-4 h-4" />
          <span>{successMessage}</span>
        </>
      )}
      {status === 'ERROR' && (
        <>
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={clsx(
                'ml-1 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30',
                'transition-colors duration-150'
              )}
              title="재시도"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default SyncStatusFeedback;
