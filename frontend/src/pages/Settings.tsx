/**
 * Settings Page Component
 * System settings and Notion sync configuration
 *
 * Design principles:
 * - Notion-style minimalism
 * - Atomic Design structure
 * - Clear sync status feedback
 * - Reduced cognitive load
 * - Bidirectional sync support
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  RefreshCw,
  Database,
  ArrowRight,
  ArrowLeft,
  FileText,
  Cloud,
} from 'lucide-react';
import { Button, ConnectionStatus } from '../components/atoms';
import {
  SettingsCard,
  SyncStatusFeedback,
  NavigationLink,
} from '../components/molecules';
import { syncApi, type ManualSyncResult, type SyncDirection } from '../api';
import type { SyncStatus } from '../types';

/**
 * P2: Magic Number constants
 * - Clear intent and improved maintainability
 */
const AUTO_HIDE_SUCCESS_DELAY_MS = 5000;

/**
 * Sync direction configuration
 */
interface SyncDirectionConfig {
  direction: SyncDirection;
  title: string;
  description: string;
  fromLabel: string;
  toLabel: string;
  fromIcon: typeof Cloud;
  buttonLabel: string;
  pendingLabel: string;
}

const SYNC_DIRECTIONS: Record<SyncDirection, SyncDirectionConfig> = {
  APP_TO_NOTION: {
    direction: 'APP_TO_NOTION',
    title: 'App to Notion',
    description: '앱에서 변경한 내용을 Notion에 반영합니다',
    fromLabel: 'FlowSync',
    toLabel: 'Notion',
    fromIcon: Cloud,
    buttonLabel: '동기화',
    pendingLabel: '동기화 중...',
  },
  NOTION_TO_APP: {
    direction: 'NOTION_TO_APP',
    title: 'Notion to App',
    description: 'Notion에서 변경한 내용을 앱에 반영합니다',
    fromLabel: 'Notion',
    toLabel: 'FlowSync',
    fromIcon: Cloud,
    buttonLabel: '동기화',
    pendingLabel: '동기화 중...',
  },
};

/**
 * Error message extraction utility
 * - Handles API responses, Error objects, strings
 */
function extractErrorMessage(error: unknown, syncResult: ManualSyncResult | null): string {
  // API response with specific error messages
  if (syncResult?.errors && syncResult.errors.length > 0) {
    const firstError = syncResult.errors[0];
    return firstError.error || '알 수 없는 동기화 오류';
  }

  // Error object
  if (error instanceof Error) {
    // Axios error response handling
    const axiosError = error as any;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    return error.message;
  }

  // String
  if (typeof error === 'string') {
    return error;
  }

  return '동기화 중 오류가 발생했습니다';
}

/**
 * Sync result summary message generation
 */
function getSyncResultSummary(result: ManualSyncResult): string {
  const parts: string[] = [];

  if (result.successCount > 0) {
    parts.push(`${result.successCount}개 성공`);
  }
  if (result.failedCount > 0) {
    parts.push(`${result.failedCount}개 실패`);
  }
  if (result.skippedCount > 0) {
    parts.push(`${result.skippedCount}개 건너뜀`);
  }

  if (parts.length === 0) {
    return '동기화할 항목이 없습니다';
  }

  const summary = parts.join(', ');
  const duration = result.durationMs ? ` (${(result.durationMs / 1000).toFixed(1)}초)` : '';

  return `${summary}${duration}`;
}

/**
 * Individual sync state for each direction
 */
interface DirectionSyncState {
  status: SyncStatus;
  result: ManualSyncResult | null;
  error: unknown;
}

const initialSyncState: DirectionSyncState = {
  status: 'IDLE',
  result: null,
  error: null,
};

export function Settings() {
  // Independent state for each direction
  const [appToNotionState, setAppToNotionState] = useState<DirectionSyncState>(initialSyncState);
  const [notionToAppState, setNotionToAppState] = useState<DirectionSyncState>(initialSyncState);

  const appToNotionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notionToAppTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (appToNotionTimeoutRef.current) {
        clearTimeout(appToNotionTimeoutRef.current);
      }
      if (notionToAppTimeoutRef.current) {
        clearTimeout(notionToAppTimeoutRef.current);
      }
    };
  }, []);

  const handleSync = useCallback(async (direction: SyncDirection) => {
    const isAppToNotion = direction === 'APP_TO_NOTION';
    const setState = isAppToNotion ? setAppToNotionState : setNotionToAppState;
    const timeoutRef = isAppToNotion ? appToNotionTimeoutRef : notionToAppTimeoutRef;
    const currentState = isAppToNotion ? appToNotionState : notionToAppState;

    if (currentState.status === 'PENDING') return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setState({
      status: 'PENDING',
      result: null,
      error: null,
    });

    try {
      const result = await syncApi.triggerManualSync({ direction });
      setState({
        status: result.success ? 'SUCCESS' : 'ERROR',
        result,
        error: null,
      });

      // Auto-hide success after configured delay
      if (result.success) {
        timeoutRef.current = setTimeout(() => {
          setState(prev => ({ ...prev, status: 'IDLE' }));
        }, AUTO_HIDE_SUCCESS_DELAY_MS);
      }
    } catch (error) {
      setState({
        status: 'ERROR',
        result: null,
        error,
      });
    }
  }, [appToNotionState.status, notionToAppState.status]);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          설정
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          동기화 및 연결 상태를 관리합니다
        </p>
      </header>

      <div className="space-y-4">
        {/* Manual Sync Section */}
        <SettingsCard
          icon={RefreshCw}
          title="Notion 동기화"
          description="데이터를 Notion과 양방향으로 동기화합니다"
        >
          <div className="space-y-6">
            {/* App to Notion Sync */}
            <SyncDirectionPanel
              config={SYNC_DIRECTIONS.APP_TO_NOTION}
              state={appToNotionState}
              onSync={() => handleSync('APP_TO_NOTION')}
              icon={<ArrowRight className="w-4 h-4 text-blue-500" />}
            />

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Notion to App Sync */}
            <SyncDirectionPanel
              config={SYNC_DIRECTIONS.NOTION_TO_APP}
              state={notionToAppState}
              onSync={() => handleSync('NOTION_TO_APP')}
              icon={<ArrowLeft className="w-4 h-4 text-green-500" />}
            />

            {/* Navigation to Sync Logs */}
            <div className="pt-2">
              <NavigationLink
                to="/sync-logs"
                icon={FileText}
                title="동기화 기록"
                description="동기화 이력 및 오류 확인"
              />
            </div>
          </div>
        </SettingsCard>

        {/* Connection Status Section */}
        <SettingsCard
          icon={Database}
          title="연결 상태"
          description="서비스 연결 상태를 확인합니다"
        >
          <div className="space-y-2">
            <ConnectionStatusRow label="Supabase" state="connected" />
            <ConnectionStatusRow label="Notion API" state="connected" />
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}

/**
 * SyncDirectionPanel - Individual sync direction UI component
 */
interface SyncDirectionPanelProps {
  config: SyncDirectionConfig;
  state: DirectionSyncState;
  onSync: () => void;
  icon: React.ReactNode;
}

function SyncDirectionPanel({ config, state, onSync, icon }: SyncDirectionPanelProps) {
  const isPending = state.status === 'PENDING';

  // Error message for display
  const errorMessage = state.status === 'ERROR'
    ? extractErrorMessage(state.error, state.result)
    : '동기화 실패';

  // Success message for display
  const successMessage = state.result
    ? getSyncResultSummary(state.result)
    : '동기화 완료';

  return (
    <div className="space-y-3">
      {/* Direction Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Direction Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {config.fromLabel}
            </span>
            {icon}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {config.toLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {config.description}
      </p>

      {/* Sync Action */}
      <div className="flex items-center gap-3">
        <Button
          onClick={onSync}
          loading={isPending}
          disabled={isPending}
          size="md"
          variant={config.direction === 'APP_TO_NOTION' ? 'primary' : 'secondary'}
        >
          {isPending ? config.pendingLabel : config.buttonLabel}
        </Button>

        <SyncStatusFeedback
          status={state.status}
          onRetry={onSync}
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
      </div>

      {/* Sync Result Details (when errors exist) */}
      {state.status === 'ERROR' && state.result?.errors && state.result.errors.length > 1 && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            {state.result.errors.length}개의 오류 발생:
          </p>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            {state.result.errors.slice(0, 5).map((err, index) => (
              <li key={index} className="truncate">
                - {err.error}
              </li>
            ))}
            {state.result.errors.length > 5 && (
              <li className="text-red-500">
                ... 외 {state.result.errors.length - 5}개
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * ConnectionStatusRow - Internal component for connection status display
 */
interface ConnectionStatusRowProps {
  label: string;
  state: 'connected' | 'disconnected' | 'pending';
}

function ConnectionStatusRow({ label, state }: ConnectionStatusRowProps) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <ConnectionStatus state={state} />
    </div>
  );
}

export default Settings;
