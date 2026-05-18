/**
 * BullMQ 큐 관련 상수
 */

/** 동기화 큐 이름 */
export const SYNC_QUEUE_NAME = 'sync-queue';

/** Dead Letter 큐 이름 */
export const DLQ_QUEUE_NAME = 'sync-dlq';

/**
 * 시간 관련 상수 (Magic Number 제거)
 */
export const TIME_CONSTANTS = {
  /** 1초 (밀리초) */
  ONE_SECOND_MS: 1000,

  /** 1분 (초) */
  ONE_MINUTE_SEC: 60,

  /** 1시간 (초) */
  ONE_HOUR_SEC: 60 * 60,

  /** 24시간 (초) */
  ONE_DAY_SEC: 24 * 60 * 60,

  /** 7일 (초) */
  SEVEN_DAYS_SEC: 7 * 24 * 60 * 60,

  /** 24시간 (밀리초) */
  ONE_DAY_MS: 24 * 60 * 60 * 1000,
} as const;

/**
 * Job 유지 설정
 */
export const JOB_RETENTION = {
  /** 완료된 Job 최대 유지 개수 */
  COMPLETED_JOB_COUNT: 1000,

  /** DLQ 재시도 횟수 */
  DLQ_RETRY_ATTEMPTS: 3,
} as const;

/**
 * Notion API Rate Limit 설정
 */
export const NOTION_RATE_LIMIT = {
  /** 초당 최대 요청 수 */
  MAX_REQUESTS_PER_SECOND: 3,

  /** Rate Limit 윈도우 (밀리초) */
  WINDOW_MS: TIME_CONSTANTS.ONE_SECOND_MS,
} as const;

/** 기본 Job 옵션 */
export const DEFAULT_JOB_OPTIONS = {
  /** 완료된 Job 유지 시간 */
  removeOnComplete: {
    age: TIME_CONSTANTS.ONE_DAY_SEC,
    count: JOB_RETENTION.COMPLETED_JOB_COUNT,
  },

  /** 실패한 Job 유지 시간 */
  removeOnFail: {
    age: TIME_CONSTANTS.SEVEN_DAYS_SEC,
  },

  /** 최대 재시도 횟수 */
  attempts: 5,

  /** 백오프 설정 */
  backoff: {
    type: 'exponential' as const,
    delay: TIME_CONSTANTS.ONE_SECOND_MS,
  },
};

/** 기본 재시도 설정 */
export const DEFAULT_RETRY_CONFIG = {
  maxRetries: 5,
  baseDelayMs: TIME_CONSTANTS.ONE_SECOND_MS,
  maxDelayMs: 30 * TIME_CONSTANTS.ONE_SECOND_MS,
  exponentialBase: 2,
  jitterFactor: 0.2,
};
