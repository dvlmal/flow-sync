import { IsString, IsOptional, IsEnum } from 'class-validator';
import { SyncDirection } from '../../common/types/sync.types';

/**
 * 수동 동기화 요청 DTO
 */
export class ManualSyncDto {
  /**
   * 특정 Task ID (없으면 pending 상태인 모든 Task 동기화)
   */
  @IsString()
  @IsOptional()
  taskId?: string;

  /**
   * 동기화 방향
   * - APP_TO_NOTION: App -> Notion (기본값)
   * - NOTION_TO_APP: Notion -> App
   */
  @IsEnum(SyncDirection)
  @IsOptional()
  direction?: SyncDirection;
}

/**
 * 수동 동기화 응답 인터페이스
 */
export interface ManualSyncResult {
  /** 동기화 성공 여부 */
  success: boolean;

  /** 동기화 방향 */
  direction: SyncDirection;

  /** 총 처리 항목 수 */
  totalCount: number;

  /** 성공 카운트 */
  successCount: number;

  /** 실패 카운트 */
  failedCount: number;

  /** 건너뛴 카운트 (이미 동기화된 항목) */
  skippedCount: number;

  /** 동기화된 Task ID 목록 */
  syncedTaskIds: string[];

  /** 실패한 항목 상세 */
  errors: Array<{
    taskId: string;
    error: string;
  }>;

  /** 동기화 시작 시간 */
  startedAt: string;

  /** 동기화 완료 시간 */
  completedAt: string;

  /** 소요 시간 (ms) */
  durationMs: number;
}
