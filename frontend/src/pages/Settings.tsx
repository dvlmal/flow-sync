/**
 * Settings Page Component
 * System settings and Notion sync configuration
 *
 * Design principles:
 * - Notion-style minimalism
 * - Atomic Design structure
 * - Clear sync status feedback
 * - Reduced cognitive load
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  RefreshCw,
  Database,
  ArrowRight,
  FileText,
  Cloud,
} from 'lucide-react';
import { Button, ConnectionStatus } from '../components/atoms';
import {
  SettingsCard,
  SyncStatusFeedback,
  InfoBanner,
  NavigationLink,
} from '../components/molecules';
import { syncApi, type ManualSyncResult } from '../api';
import type { SyncStatus } from '../types';

/**
 * P2: Magic Number 상수화
 * - 명확한 의도 전달 및 유지보수성 향상
 */
const AUTO_HIDE_SUCCESS_DELAY_MS = 5000;

/**
 * 에러 메시지 추출 유틸리티
 * - API 응답, Error 객체, 문자열 등 다양한 형태 처리
 */
function extractErrorMessage(error: unknown, syncResult: ManualSyncResult | null): string {
  // API 응답에서 구체적인 에러 메시지가 있는 경우
  if (syncResult?.errors && syncResult.errors.length > 0) {
    const firstError = syncResult.errors[0];
    return firstError.error || '알 수 없는 동기화 오류';
  }

  // Error 객체인 경우
  if (error instanceof Error) {
    // Axios 에러 응답 처리
    const axiosError = error as any;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    return error.message;
  }

  // 문자열인 경우
  if (typeof error === 'string') {
    return error;
  }

  return '동기화 중 오류가 발생했습니다';
}

/**
 * 동기화 결과 요약 메시지 생성
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

export function Settings() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('IDLE');
  const [syncResult, setSyncResult] = useState<ManualSyncResult | null>(null);
  const [lastError, setLastError] = useState<unknown>(null);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  const handleManualSync = useCallback(async () => {
    if (syncStatus === 'PENDING') return;

    setSyncStatus('PENDING');
    setSyncResult(null);
    setLastError(null);

    try {
      const result = await syncApi.triggerManualSync({
        direction: 'APP_TO_NOTION',
      });
      setSyncResult(result);
      setSyncStatus(result.success ? 'SUCCESS' : 'ERROR');

      // Auto-hide success after configured delay
      if (result.success) {
        syncTimeoutRef.current = setTimeout(() => {
          setSyncStatus('IDLE');
        }, AUTO_HIDE_SUCCESS_DELAY_MS);
      }
    } catch (error) {
      setLastError(error);
      setSyncStatus('ERROR');
    }
  }, [syncStatus]);

  const handleRetry = useCallback(() => {
    handleManualSync();
  }, [handleManualSync]);

  // P2: 구체적인 에러 메시지 표시
  const errorMessage = syncStatus === 'ERROR'
    ? extractErrorMessage(lastError, syncResult)
    : '동기화 실패';

  // P2: 성공 시 상세 결과 표시
  const successMessage = syncResult
    ? getSyncResultSummary(syncResult)
    : '동기화 완료';

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
          description="데이터를 Notion과 동기화합니다"
        >
          <div className="space-y-4">
            {/* Sync Direction Indicator */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Cloud className="w-4 h-4" />
                <span className="font-medium">FlowSync</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Notion</span>
              </div>
            </div>

            {/* Sync Action */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleManualSync}
                loading={syncStatus === 'PENDING'}
                disabled={syncStatus === 'PENDING'}
                size="md"
              >
                {syncStatus === 'PENDING' ? '동기화 중...' : '지금 동기화'}
              </Button>

              <SyncStatusFeedback
                status={syncStatus}
                onRetry={handleRetry}
                successMessage={successMessage}
                errorMessage={errorMessage}
              />
            </div>

            {/* Sync Result Details (when errors exist) */}
            {syncStatus === 'ERROR' && syncResult?.errors && syncResult.errors.length > 1 && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  {syncResult.errors.length}개의 오류 발생:
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {syncResult.errors.slice(0, 5).map((err, index) => (
                    <li key={index} className="truncate">
                      - {err.error}
                    </li>
                  ))}
                  {syncResult.errors.length > 5 && (
                    <li className="text-red-500">
                      ... 외 {syncResult.errors.length - 5}개
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Info Notice */}
            <InfoBanner variant="info">
              앱에서 변경한 내용이 Notion에 반영됩니다.
              Notion에서 앱으로의 동기화는 추후 지원 예정입니다.
            </InfoBanner>

            {/* Navigation to Sync Logs */}
            <NavigationLink
              to="/sync-logs"
              icon={FileText}
              title="동기화 기록"
              description="동기화 이력 및 오류 확인"
            />
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
