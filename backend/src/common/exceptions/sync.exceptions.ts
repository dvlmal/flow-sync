/**
 * 동기화 관련 커스텀 Exception 클래스
 * - 일관된 에러 처리를 위한 계층 구조 정의
 */

/**
 * 동기화 에러 기본 클래스
 */
export class SyncError extends Error {
  public readonly isRetryable: boolean;
  public readonly errorCode: string;

  constructor(message: string, errorCode: string, isRetryable = false) {
    super(message);
    this.name = 'SyncError';
    this.errorCode = errorCode;
    this.isRetryable = isRetryable;
    Object.setPrototypeOf(this, SyncError.prototype);
  }
}

/**
 * Notion API Rate Limit 에러
 */
export class NotionRateLimitError extends SyncError {
  public readonly retryAfter?: number;

  constructor(message = 'Notion API rate limit exceeded', retryAfter?: number) {
    super(message, 'NOTION_RATE_LIMIT', true);
    this.name = 'NotionRateLimitError';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, NotionRateLimitError.prototype);
  }
}

/**
 * Notion API 서버 에러 (5xx)
 */
export class NotionServerError extends SyncError {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message, 'NOTION_SERVER_ERROR', true);
    this.name = 'NotionServerError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, NotionServerError.prototype);
  }
}

/**
 * Notion API 클라이언트 에러 (4xx, 재시도 불가)
 */
export class NotionClientError extends SyncError {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message, 'NOTION_CLIENT_ERROR', false);
    this.name = 'NotionClientError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, NotionClientError.prototype);
  }
}

/**
 * 네트워크 연결 에러
 */
export class NetworkError extends SyncError {
  public readonly code: string;

  constructor(message: string, code: string) {
    super(message, 'NETWORK_ERROR', true);
    this.name = 'NetworkError';
    this.code = code;
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Task를 찾을 수 없는 경우
 */
export class TaskNotFoundError extends SyncError {
  public readonly taskId: string;

  constructor(taskId: string) {
    super(`Task not found: ${taskId}`, 'TASK_NOT_FOUND', false);
    this.name = 'TaskNotFoundError';
    this.taskId = taskId;
    Object.setPrototypeOf(this, TaskNotFoundError.prototype);
  }
}

/**
 * Notion Page를 찾을 수 없는 경우
 */
export class NotionPageNotFoundError extends SyncError {
  public readonly notionPageId: string;

  constructor(notionPageId: string) {
    super(
      `Notion page not found: ${notionPageId}`,
      'NOTION_PAGE_NOT_FOUND',
      false,
    );
    this.name = 'NotionPageNotFoundError';
    this.notionPageId = notionPageId;
    Object.setPrototypeOf(this, NotionPageNotFoundError.prototype);
  }
}

/**
 * 동기화 충돌 에러 (동시 수정 감지)
 */
export class SyncConflictError extends SyncError {
  public readonly taskId: string;
  public readonly conflictType: 'CONCURRENT_MODIFICATION' | 'VERSION_MISMATCH';

  constructor(
    taskId: string,
    conflictType: 'CONCURRENT_MODIFICATION' | 'VERSION_MISMATCH',
  ) {
    super(
      `Sync conflict detected for task ${taskId}: ${conflictType}`,
      'SYNC_CONFLICT',
      true,
    );
    this.name = 'SyncConflictError';
    this.taskId = taskId;
    this.conflictType = conflictType;
    Object.setPrototypeOf(this, SyncConflictError.prototype);
  }
}

/**
 * DLQ 최대 재시도 초과 에러
 */
export class MaxRetriesExceededError extends SyncError {
  public readonly taskId: string;
  public readonly totalAttempts: number;

  constructor(taskId: string, totalAttempts: number) {
    super(
      `Max retries exceeded for task ${taskId}: ${totalAttempts} attempts`,
      'MAX_RETRIES_EXCEEDED',
      false,
    );
    this.name = 'MaxRetriesExceededError';
    this.taskId = taskId;
    this.totalAttempts = totalAttempts;
    Object.setPrototypeOf(this, MaxRetriesExceededError.prototype);
  }
}

/**
 * 에러 객체의 타입 가드
 */
interface ErrorWithCode {
  code?: string;
  message?: string;
}

interface ErrorWithStatus {
  status?: number;
  message?: string;
  retryAfter?: number;
}

function hasCode(error: unknown): error is ErrorWithCode {
  return typeof error === 'object' && error !== null && 'code' in error;
}

function hasStatus(error: unknown): error is ErrorWithStatus {
  return typeof error === 'object' && error !== null && 'status' in error;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const msg = (error as { message: unknown }).message;
    return typeof msg === 'string' ? msg : 'Unknown sync error';
  }
  return 'Unknown sync error';
}

/**
 * 에러를 SyncError로 래핑
 */
export function wrapToSyncError(error: unknown): SyncError {
  if (error instanceof SyncError) {
    return error;
  }

  const message = getErrorMessage(error);

  // Notion Rate Limit
  if (hasCode(error) && error.code === 'rate_limited') {
    return new NotionRateLimitError(message);
  }

  if (hasStatus(error) && error.status === 429) {
    return new NotionRateLimitError(message, error.retryAfter);
  }

  // Notion Server Error
  if (
    hasStatus(error) &&
    typeof error.status === 'number' &&
    error.status >= 500 &&
    error.status < 600
  ) {
    return new NotionServerError(message, error.status);
  }

  // Notion Client Error
  if (
    hasStatus(error) &&
    typeof error.status === 'number' &&
    error.status >= 400 &&
    error.status < 500
  ) {
    return new NotionClientError(message, error.status);
  }

  // Network Error
  if (hasCode(error) && typeof error.code === 'string') {
    if (
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ENOTFOUND'
    ) {
      return new NetworkError(message, error.code);
    }
  }

  // 기타 에러
  return new SyncError(message, 'UNKNOWN_ERROR', false);
}
