/**
 * Settings Page Component
 * System settings and Notion sync configuration
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  Database,
  Bell,
  AlertCircle,
  Play,
  FileText,
  ChevronRight,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../components/atoms';

export function Settings() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<'success' | 'error' | null>(null);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    // TODO: 실제 백엔드 API 연동
    // 현재는 UI 데모용 타이머
    setTimeout(() => {
      setIsSyncing(false);
      setSyncResult('success'); // or 'error'

      // 3초 후 결과 메시지 숨김
      setTimeout(() => setSyncResult(null), 3000);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          설정
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          시스템 설정 및 동기화 구성
        </p>
      </div>

      <div className="space-y-6">
        {/* Manual Sync */}
        <SettingsCard
          icon={RefreshCw}
          title="수동 동기화"
          description="Notion과 데이터를 즉시 동기화합니다"
        >
          <div className="space-y-4">
            {/* Sync Button */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="min-w-[140px]"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    동기화 중...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    동기화 실행
                  </>
                )}
              </Button>

              {syncResult === 'success' && (
                <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  동기화 완료
                </span>
              )}
              {syncResult === 'error' && (
                <span className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  동기화 실패
                </span>
              )}
            </div>

            {/* Notice */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>App → Notion:</strong> 앱에서 변경된 내용을 Notion에 반영합니다.
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Notion → App 동기화는 개발 예정입니다.
              </p>
            </div>

            {/* View Logs Link */}
            <Link
              to="/sync-logs"
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    동기화 로그 보기
                  </p>
                  <p className="text-sm text-gray-500">
                    동기화 이력 및 오류 확인
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </SettingsCard>

        {/* Notion Sync Settings */}
        <SettingsCard
          icon={RefreshCw}
          title="자동 동기화"
          description="Notion과의 자동 데이터 동기화 설정"
        >
          <div className="space-y-4">
            {/* Sync Status */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Notion → App 자동 동기화 미구현
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    현재 App → Notion 단방향 동기화만 지원됩니다
                  </p>
                </div>
              </div>
            </div>

            {/* Sync Direction Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    App → Notion
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  앱에서 작업을 수정하면 Notion에 자동 반영됩니다
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Notion → App
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  개발 예정 - Notion 변경사항 자동 동기화
                </p>
              </div>
            </div>

            {/* Future Settings (Disabled) */}
            <div className="opacity-50 pointer-events-none">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                동기화 주기 (개발 예정)
              </h4>
              <div className="flex items-center gap-4">
                <select
                  disabled
                  className="px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                >
                  <option>1분</option>
                  <option>5분</option>
                  <option>15분</option>
                  <option>30분</option>
                </select>
                <span className="text-sm text-gray-500">마다 Notion 변경사항 확인</span>
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* Database Info */}
        <SettingsCard
          icon={Database}
          title="데이터베이스"
          description="Supabase PostgreSQL 연결 정보"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">상태</span>
              <span className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                연결됨
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">제공자</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Supabase
              </span>
            </div>
          </div>
        </SettingsCard>

        {/* Notifications (Future) */}
        <SettingsCard
          icon={Bell}
          title="알림"
          description="알림 설정 (개발 예정)"
          disabled
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            추후 동기화 오류 알림, 마감일 알림 등이 추가될 예정입니다.
          </p>
        </SettingsCard>
      </div>
    </div>
  );
}

// Settings Card Component
interface SettingsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  disabled?: boolean;
  children: React.ReactNode;
}

function SettingsCard({ icon: Icon, title, description, disabled, children }: SettingsCardProps) {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6',
        disabled && 'opacity-60'
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default Settings;
