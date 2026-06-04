/**
 * ConnectionStatus Atom Component
 * Status indicator for service connections
 * Following Notion's minimal status patterns
 */

import { clsx } from 'clsx';

type ConnectionState = 'connected' | 'disconnected' | 'pending';

interface ConnectionStatusProps {
  state: ConnectionState;
  label?: string;
  className?: string;
}

const stateConfig: Record<
  ConnectionState,
  { dotClass: string; textClass: string; defaultLabel: string }
> = {
  connected: {
    dotClass: 'bg-green-500',
    textClass: 'text-green-600 dark:text-green-400',
    defaultLabel: '연결됨',
  },
  disconnected: {
    dotClass: 'bg-red-500',
    textClass: 'text-red-600 dark:text-red-400',
    defaultLabel: '연결 끊김',
  },
  pending: {
    dotClass: 'bg-yellow-500 animate-pulse',
    textClass: 'text-yellow-600 dark:text-yellow-400',
    defaultLabel: '연결 중...',
  },
};

export function ConnectionStatus({
  state,
  label,
  className,
}: ConnectionStatusProps) {
  const config = stateConfig[state];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 text-sm font-medium',
        config.textClass,
        className
      )}
    >
      <span
        className={clsx('w-2 h-2 rounded-full flex-shrink-0', config.dotClass)}
        aria-hidden="true"
      />
      {label ?? config.defaultLabel}
    </span>
  );
}

export default ConnectionStatus;
