/**
 * 동기화 관련 타입 정의
 */

/**
 * 동기화 작업 유형
 */
export enum SyncOperation {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

/**
 * 동기화 방향
 */
export enum SyncDirection {
  APP_TO_NOTION = 'APP_TO_NOTION',
  NOTION_TO_APP = 'NOTION_TO_APP',
}

/**
 * 동기화 상태
 */
export enum SyncStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  IN_DLQ = 'IN_DLQ',
}

/**
 * 동기화 Job 데이터 인터페이스
 */
export interface SyncJobData {
  /** 고유 Job ID (idempotency key) */
  jobId: string;

  /** Task ID (PostgreSQL) */
  taskId: string;

  /** Notion Page ID (있을 경우) */
  notionPageId?: string;

  /** 동기화 작업 유형 */
  operation: SyncOperation;

  /** Task 데이터 (Notion에 반영할 속성들) */
  payload: TaskSyncPayload;

  /** 생성 시간 */
  createdAt: Date;

  /** 재시도 횟수 */
  retryCount: number;

  /** 마지막 에러 메시지 */
  lastError?: string;
}

/**
 * Task 동기화 페이로드
 */
export interface TaskSyncPayload {
  title?: string;
  content?: string;
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  assignees?: string[];
  tags?: string[];
}

/**
 * 재시도 설정
 */
export interface RetryConfig {
  /** 최대 재시도 횟수 */
  maxRetries: number;

  /** 기본 지연 시간 (ms) */
  baseDelayMs: number;

  /** 최대 지연 시간 (ms) */
  maxDelayMs: number;

  /** 지수 백오프 기본값 */
  exponentialBase: number;

  /** 지터 비율 (0-1) */
  jitterFactor: number;
}

/**
 * Dead Letter Queue 항목
 */
export interface DlqEntry {
  /** 원본 Job 데이터 */
  originalJob: SyncJobData;

  /** 실패 원인 */
  failureReason: string;

  /** 실패 시간 */
  failedAt: Date;

  /** 총 시도 횟수 */
  totalAttempts: number;

  /** 재처리 가능 여부 */
  isRetryable: boolean;
}

/**
 * Rate Limit 에러인지 확인
 */
export function isRateLimitError(error: any): boolean {
  if (!error) return false;

  if (error.code === 'rate_limited') return true;
  if (error.status === 429) return true;
  if (
    typeof error.message === 'string' &&
    error.message.toLowerCase().includes('rate limit')
  ) {
    return true;
  }

  return false;
}

/**
 * 재시도 가능한 에러인지 확인
 */
export function isRetryableError(error: any): boolean {
  // Rate limit
  if (isRateLimitError(error)) return true;

  // 서버 에러 (5xx)
  if (error?.status >= 500 && error?.status < 600) return true;

  // 네트워크 에러
  if (error?.code === 'ECONNRESET' || error?.code === 'ETIMEDOUT') return true;

  // Notion 일시적 에러
  if (error?.code === 'service_unavailable') return true;
  if (error?.code === 'internal_server_error') return true;

  return false;
}

/**
 * 지수 백오프 + 지터 지연 시간 계산
 */
export function calculateBackoffDelay(
  attempt: number,
  config: RetryConfig,
): number {
  const exponentialDelay =
    config.baseDelayMs * Math.pow(config.exponentialBase, attempt);
  const cappedDelay = Math.min(exponentialDelay, config.maxDelayMs);

  // 지터 추가 (thundering herd 방지)
  const jitter = cappedDelay * config.jitterFactor * Math.random();

  return Math.floor(cappedDelay + jitter);
}
