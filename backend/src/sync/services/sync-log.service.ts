import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SyncDirection, SyncStatus } from '../../common/types/sync.types';

/**
 * 동기화 로그 서비스
 * - sync_log 테이블 관리
 * - 동기화 이력 추적 및 모니터링
 */
@Injectable()
export class SyncLogService {
  private readonly logger = new Logger(SyncLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 동기화 시작 로그 생성
   */
  async logSyncStart(taskId: string, direction: SyncDirection): Promise<void> {
    try {
      await this.prisma.sync_log.create({
        data: {
          task_id: taskId,
          direction: direction,
          sync_status: SyncStatus.PROCESSING,
          retry_count: 0,
          synced_at: new Date(),
        },
      });

      this.logger.debug(
        `Sync started for task ${taskId}, direction: ${direction}`,
      );
    } catch (error) {
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
      // 가장 최근 로그 업데이트
      const latestLog = await this.prisma.sync_log.findFirst({
        where: {
          task_id: taskId,
          direction: direction,
          sync_status: SyncStatus.PROCESSING,
        },
        orderBy: {
          synced_at: 'desc',
        },
      });

      if (latestLog) {
        await this.prisma.sync_log.update({
          where: { id: latestLog.id },
          data: {
            sync_status: SyncStatus.COMPLETED,
            synced_at: new Date(),
          },
        });
      }

      this.logger.debug(`Sync completed for task ${taskId}`);
    } catch (error) {
      this.logger.error(`Failed to log sync complete: ${error.message}`);
    }
  }

  /**
   * 동기화 완료 처리 (트랜잭션: Task + SyncLog 함께 업데이트)
   * CREATE 작업 시 Notion Page ID를 Task에 저장
   */
  async completeSyncWithTransaction(
    taskId: string,
    direction: SyncDirection,
    notionPageId?: string,
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. SyncLog 업데이트
        const latestLog = await tx.sync_log.findFirst({
          where: {
            task_id: taskId,
            direction: direction,
            sync_status: SyncStatus.PROCESSING,
          },
          orderBy: {
            synced_at: 'desc',
          },
        });

        if (latestLog) {
          await tx.sync_log.update({
            where: { id: latestLog.id },
            data: {
              sync_status: SyncStatus.COMPLETED,
              synced_at: new Date(),
            },
          });
        }

        // 2. Task의 notion_page_id 업데이트 (CREATE 시)
        if (notionPageId) {
          await tx.task.update({
            where: { id: taskId },
            data: { notion_page_id: notionPageId },
          });
        }
      });

      this.logger.debug(`Sync completed with transaction for task ${taskId}`);
    } catch (error) {
      this.logger.error(
        `Failed to complete sync with transaction: ${error.message}`,
      );
      throw error; // 트랜잭션 실패는 상위로 전파
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
      // 가장 최근 로그 업데이트
      const latestLog = await this.prisma.sync_log.findFirst({
        where: {
          task_id: taskId,
          direction: direction,
          sync_status: SyncStatus.PROCESSING,
        },
        orderBy: {
          synced_at: 'desc',
        },
      });

      if (latestLog) {
        await this.prisma.sync_log.update({
          where: { id: latestLog.id },
          data: {
            sync_status: SyncStatus.FAILED,
            error_message: errorMessage.substring(0, 1000), // 에러 메시지 길이 제한
            retry_count: retryCount,
            synced_at: new Date(),
          },
        });
      } else {
        // 새 로그 생성
        await this.prisma.sync_log.create({
          data: {
            task_id: taskId,
            direction: direction,
            sync_status: SyncStatus.FAILED,
            error_message: errorMessage.substring(0, 1000),
            retry_count: retryCount,
            synced_at: new Date(),
          },
        });
      }

      this.logger.debug(
        `Sync error logged for task ${taskId}: ${errorMessage}`,
      );
    } catch (error) {
      this.logger.error(`Failed to log sync error: ${error.message}`);
    }
  }

  /**
   * DLQ 상태로 마킹
   */
  async markAsDlq(taskId: string, errorMessage: string): Promise<void> {
    try {
      await this.prisma.sync_log.create({
        data: {
          task_id: taskId,
          direction: SyncDirection.APP_TO_NOTION,
          sync_status: SyncStatus.IN_DLQ,
          error_message: errorMessage.substring(0, 1000),
          synced_at: new Date(),
        },
      });

      this.logger.warn(`Task ${taskId} moved to DLQ: ${errorMessage}`);
    } catch (error) {
      this.logger.error(`Failed to mark as DLQ: ${error.message}`);
    }
  }

  /**
   * Task의 동기화 이력 조회
   */
  async getSyncHistory(taskId: string, limit = 10) {
    return this.prisma.sync_log.findMany({
      where: { task_id: taskId },
      orderBy: { synced_at: 'desc' },
      take: limit,
    });
  }

  /**
   * DLQ에 있는 Task 목록 조회
   */
  async getDlqTasks(limit = 50) {
    return this.prisma.sync_log.findMany({
      where: { sync_status: SyncStatus.IN_DLQ },
      orderBy: { synced_at: 'desc' },
      take: limit,
      include: {
        task: true,
      },
    });
  }

  /**
   * 실패한 동기화 통계 조회
   */
  async getFailureStats(since: Date) {
    const [failed, inDlq, completed] = await Promise.all([
      this.prisma.sync_log.count({
        where: {
          sync_status: SyncStatus.FAILED,
          synced_at: { gte: since },
        },
      }),
      this.prisma.sync_log.count({
        where: {
          sync_status: SyncStatus.IN_DLQ,
          synced_at: { gte: since },
        },
      }),
      this.prisma.sync_log.count({
        where: {
          sync_status: SyncStatus.COMPLETED,
          synced_at: { gte: since },
        },
      }),
    ]);

    return {
      failed,
      inDlq,
      completed,
      total: failed + inDlq + completed,
      successRate: completed / (failed + inDlq + completed) || 0,
    };
  }
}
