import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { SyncDirection, SyncStatus } from '../../common/types/sync.types';

/**
 * Serverless 동기화 로그 서비스
 * - sync_log 테이블 관리
 * - 동기화 이력 추적 및 모니터링
 * - BullMQ 의존성 없음
 */
@Injectable()
export class ServerlessSyncLogService {
  private readonly logger = new Logger(ServerlessSyncLogService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * 동기화 시작 로그 생성
   */
  async logSyncStart(taskId: string, direction: SyncDirection): Promise<void> {
    try {
      const { error } = await this.supabase.from('sync_log').insert({
        task_id: taskId,
        direction: direction,
        sync_status: SyncStatus.PROCESSING,
        retry_count: 0,
        synced_at: new Date().toISOString(),
      });

      if (error) {
        this.logger.error(`Failed to log sync start: ${error.message}`);
        return;
      }

      this.logger.debug(
        `Sync started for task ${taskId}, direction: ${direction}`,
      );
    } catch (error: any) {
      this.logger.error(`Failed to log sync start: ${error.message}`);
      // 로그 실패는 동기화 실패로 이어지지 않음
    }
  }

  /**
   * 동기화 완료 로그 업데이트
   */
  async logSyncComplete(
    taskId: string,
    direction: SyncDirection,
  ): Promise<void> {
    try {
      // 가장 최근 로그 조회
      const { data: latestLog, error: findError } = await this.supabase
        .from('sync_log')
        .select('*')
        .eq('task_id', taskId)
        .eq('direction', direction)
        .eq('sync_status', SyncStatus.PROCESSING)
        .order('synced_at', { ascending: false })
        .limit(1)
        .single();

      if (findError || !latestLog) {
        this.logger.debug(`No processing log found for task ${taskId}`);
        return;
      }

      const { error: updateError } = await this.supabase
        .from('sync_log')
        .update({
          sync_status: SyncStatus.COMPLETED,
          synced_at: new Date().toISOString(),
        })
        .eq('id', latestLog.id);

      if (updateError) {
        this.logger.error(`Failed to update sync log: ${updateError.message}`);
        return;
      }

      this.logger.debug(`Sync completed for task ${taskId}`);
    } catch (error: any) {
      this.logger.error(`Failed to log sync complete: ${error.message}`);
    }
  }

  /**
   * 동기화 에러 로그 기록
   */
  async logSyncError(
    taskId: string,
    direction: SyncDirection,
    errorMessage: string,
    retryCount: number,
  ): Promise<void> {
    try {
      // 가장 최근 로그 조회
      const { data: latestLog } = await this.supabase
        .from('sync_log')
        .select('*')
        .eq('task_id', taskId)
        .eq('direction', direction)
        .eq('sync_status', SyncStatus.PROCESSING)
        .order('synced_at', { ascending: false })
        .limit(1)
        .single();

      if (latestLog) {
        await this.supabase
          .from('sync_log')
          .update({
            sync_status: SyncStatus.FAILED,
            error_message: errorMessage.substring(0, 1000),
            retry_count: retryCount,
            synced_at: new Date().toISOString(),
          })
          .eq('id', latestLog.id);
      } else {
        // 새 로그 생성
        await this.supabase.from('sync_log').insert({
          task_id: taskId,
          direction: direction,
          sync_status: SyncStatus.FAILED,
          error_message: errorMessage.substring(0, 1000),
          retry_count: retryCount,
          synced_at: new Date().toISOString(),
        });
      }

      this.logger.debug(
        `Sync error logged for task ${taskId}: ${errorMessage}`,
      );
    } catch (error: any) {
      this.logger.error(`Failed to log sync error: ${error.message}`);
    }
  }

  /**
   * Task의 동기화 이력 조회
   */
  async getSyncHistory(taskId: string, limit = 10) {
    const { data, error } = await this.supabase
      .from('sync_log')
      .select('*')
      .eq('task_id', taskId)
      .order('synced_at', { ascending: false })
      .limit(limit);

    if (error) {
      this.logger.error(`Failed to get sync history: ${error.message}`);
      return [];
    }

    return data || [];
  }

  /**
   * 최근 동기화 로그 조회
   */
  async getRecentLogs(limit = 50) {
    const { data, error } = await this.supabase
      .from('sync_log')
      .select('*, task:task_id(id, title)')
      .order('synced_at', { ascending: false })
      .limit(limit);

    if (error) {
      this.logger.error(`Failed to get recent logs: ${error.message}`);
      return [];
    }

    return data || [];
  }

  /**
   * 실패한 동기화 통계 조회
   */
  async getFailureStats(since: Date) {
    const sinceStr = since.toISOString();

    const [failedResult, dlqResult, completedResult] = await Promise.all([
      this.supabase
        .from('sync_log')
        .select('id', { count: 'exact', head: true })
        .eq('sync_status', SyncStatus.FAILED)
        .gte('synced_at', sinceStr),
      this.supabase
        .from('sync_log')
        .select('id', { count: 'exact', head: true })
        .eq('sync_status', SyncStatus.IN_DLQ)
        .gte('synced_at', sinceStr),
      this.supabase
        .from('sync_log')
        .select('id', { count: 'exact', head: true })
        .eq('sync_status', SyncStatus.COMPLETED)
        .gte('synced_at', sinceStr),
    ]);

    const failed = failedResult.count || 0;
    const inDlq = dlqResult.count || 0;
    const completed = completedResult.count || 0;
    const total = failed + inDlq + completed;

    return {
      failed,
      inDlq,
      completed,
      total,
      successRate: total > 0 ? completed / total : 0,
      environment: 'serverless',
    };
  }
}
