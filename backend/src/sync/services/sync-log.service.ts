import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { SyncDirection, SyncStatus } from '../../common/types/sync.types';

/**
 * 동기화 로그 서비스
 * - sync_log 테이블 관리
 * - 동기화 이력 추적 및 모니터링
 * - Supabase REST API 사용
 */
@Injectable()
export class SyncLogService {
  private readonly logger = new Logger(SyncLogService.name);

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
   * 동기화 완료 로그 업데이트 (SRP: sync_log만 관리)
   * Task 업데이트는 Processor에서 트랜잭션으로 처리
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
   * 동기화 완료 처리 (Task의 notion_page_id 업데이트 포함)
   * CREATE 작업 시 Notion Page ID를 Task에 저장
   * Note: Supabase REST API는 트랜잭션 미지원, 개별 요청으로 처리
   */
  async completeSyncWithTransaction(
    taskId: string,
    direction: SyncDirection,
    notionPageId?: string,
  ): Promise<void> {
    try {
      // 1. SyncLog 업데이트
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
            sync_status: SyncStatus.COMPLETED,
            synced_at: new Date().toISOString(),
          })
          .eq('id', latestLog.id);
      }

      // 2. Task의 notion_page_id 업데이트 (CREATE 시)
      if (notionPageId) {
        const { error: taskError } = await this.supabase
          .from('task')
          .update({ notion_page_id: notionPageId })
          .eq('id', taskId);

        if (taskError) {
          this.logger.error(
            `Failed to update task notion_page_id: ${taskError.message}`,
          );
          throw taskError;
        }
      }

      this.logger.debug(`Sync completed with transaction for task ${taskId}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to complete sync with transaction: ${error.message}`,
      );
      throw error;
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
   * DLQ 상태로 마킹
   */
  async markAsDlq(taskId: string, errorMessage: string): Promise<void> {
    try {
      const { error } = await this.supabase.from('sync_log').insert({
        task_id: taskId,
        direction: SyncDirection.APP_TO_NOTION,
        sync_status: SyncStatus.IN_DLQ,
        error_message: errorMessage.substring(0, 1000),
        synced_at: new Date().toISOString(),
      });

      if (error) {
        this.logger.error(`Failed to mark as DLQ: ${error.message}`);
        return;
      }

      this.logger.warn(`Task ${taskId} moved to DLQ: ${errorMessage}`);
    } catch (error: any) {
      this.logger.error(`Failed to mark as DLQ: ${error.message}`);
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
   * DLQ에 있는 Task 목록 조회
   */
  async getDlqTasks(limit = 50) {
    const { data, error } = await this.supabase
      .from('sync_log')
      .select('*, task(*)')
      .eq('sync_status', SyncStatus.IN_DLQ)
      .order('synced_at', { ascending: false })
      .limit(limit);

    if (error) {
      this.logger.error(`Failed to get DLQ tasks: ${error.message}`);
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
    };
  }
}
