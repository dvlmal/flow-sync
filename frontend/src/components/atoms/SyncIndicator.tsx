/**
 * SyncIndicator Atom Component
 * Visual indicator for sync states (spinner, checkmark, error)
 */

import { Loader2, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import type { SyncStatus } from '../../types';

interface SyncIndicatorProps {
  status: SyncStatus;
  onRetry?: () => void;
  className?: string;
}

export function SyncIndicator({ status, onRetry, className }: SyncIndicatorProps) {
  if (status === 'IDLE') return null;

  return (
    <span className={clsx('inline-flex items-center', className)}>
      {status === 'PENDING' && (
        <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
      )}
      {status === 'SUCCESS' && (
        <Check className="w-3.5 h-3.5 text-green-500 animate-pulse" />
      )}
      {status === 'ERROR' && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
          title="Retry sync"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          {onRetry && <RefreshCw className="w-3 h-3" />}
        </button>
      )}
    </span>
  );
}

export default SyncIndicator;
