/**
 * SyncLogs Page Component
 * View sync history and error logs
 */

import { useState } from 'react';
import {
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  ChevronDown,
  Inbox,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../components/atoms';

// Mock data for UI development (백엔드 연동 전)
const MOCK_SYNC_LOGS = [
  {
    id: '1',
    taskId: 'task-001',
    taskTitle: '프로젝트 기획서 작성',
    direction: 'APP_TO_NOTION',
    status: 'COMPLETED',
    syncedAt: '2024-01-15T10:30:00Z',
    errorMessage: null,
    retryCount: 0,
  },
  {
    id: '2',
    taskId: 'task-002',
    taskTitle: 'API 설계 문서',
    direction: 'APP_TO_NOTION',
    status: 'FAILED',
    syncedAt: '2024-01-15T10:25:00Z',
    errorMessage: 'Rate limit exceeded. Please retry after 60 seconds.',
    retryCount: 3,
  },
  {
    id: '3',
    taskId: 'task-003',
    taskTitle: 'UI 디자인 검토',
    direction: 'APP_TO_NOTION',
    status: 'IN_DLQ',
    syncedAt: '2024-01-15T10:20:00Z',
    errorMessage: 'Page not found in Notion. The page may have been deleted.',
    retryCount: 5,
  },
  {
    id: '4',
    taskId: 'task-004',
    taskTitle: '테스트 케이스 작성',
    direction: 'APP_TO_NOTION',
    status: 'COMPLETED',
    syncedAt: '2024-01-15T10:15:00Z',
    errorMessage: null,
    retryCount: 0,
  },
];

type SyncStatus = 'ALL' | 'COMPLETED' | 'FAILED' | 'IN_DLQ' | 'PROCESSING';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  COMPLETED: { label: '완료', color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20', icon: CheckCircle },
  FAILED: { label: '실패', color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20', icon: XCircle },
  IN_DLQ: { label: 'DLQ', color: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20', icon: AlertCircle },
  PROCESSING: { label: '처리 중', color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20', icon: Clock },
};

export function SyncLogs() {
  const [statusFilter, setStatusFilter] = useState<SyncStatus>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter logs based on status
  const filteredLogs = statusFilter === 'ALL'
    ? MOCK_SYNC_LOGS
    : MOCK_SYNC_LOGS.filter((log) => log.status === statusFilter);

  // Calculate stats
  const stats = {
    total: MOCK_SYNC_LOGS.length,
    completed: MOCK_SYNC_LOGS.filter((l) => l.status === 'COMPLETED').length,
    failed: MOCK_SYNC_LOGS.filter((l) => l.status === 'FAILED').length,
    inDlq: MOCK_SYNC_LOGS.filter((l) => l.status === 'IN_DLQ').length,
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            동기화 로그
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Notion 동기화 이력 및 오류 확인
          </p>
        </div>
        <Button variant="secondary" disabled>
          <RefreshCw className="w-4 h-4" />
          새로고침
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="전체" value={stats.total} />
        <StatCard label="완료" value={stats.completed} color="text-green-600" />
        <StatCard label="실패" value={stats.failed} color="text-red-600" />
        <StatCard label="DLQ" value={stats.inDlq} color="text-orange-600" />
      </div>

      {/* Notice */}
      <div className="flex items-center gap-3 p-4 mb-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
        <div>
          <p className="font-medium text-yellow-800 dark:text-yellow-200">
            백엔드 API 연동 예정
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            현재 표시되는 데이터는 UI 개발용 샘플 데이터입니다.
          </p>
        </div>
      </div>

      {/* Filter & Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Filter className="w-4 h-4" />
              상태: {statusFilter === 'ALL' ? '전체' : STATUS_CONFIG[statusFilter]?.label}
              <ChevronDown className="w-4 h-4" />
            </button>
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                {(['ALL', 'COMPLETED', 'FAILED', 'IN_DLQ'] as SyncStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setIsFilterOpen(false);
                    }}
                    className={clsx(
                      'w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700',
                      statusFilter === status && 'bg-gray-50 dark:bg-gray-700'
                    )}
                  >
                    {status === 'ALL' ? '전체' : STATUS_CONFIG[status]?.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {filteredLogs.length}개 항목
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  작업
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">
                  상태
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">
                  시간
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  오류 메시지
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">
                      해당 조건의 로그가 없습니다
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const statusConfig = STATUS_CONFIG[log.status];
                  const StatusIcon = statusConfig?.icon || Clock;

                  return (
                    <tr
                      key={log.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {log.taskTitle}
                        </p>
                        <p className="text-xs text-gray-500">{log.taskId}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={clsx(
                            'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
                            statusConfig?.color
                          )}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(log.syncedAt).toLocaleString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {log.errorMessage ? (
                          <p className="text-sm text-red-600 dark:text-red-400 line-clamp-2">
                            {log.errorMessage}
                          </p>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={clsx('text-2xl font-bold', color || 'text-gray-900 dark:text-gray-100')}>
        {value}
      </p>
    </div>
  );
}

export default SyncLogs;
