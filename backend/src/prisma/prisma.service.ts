import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '../generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * 트랜잭션 옵션 인터페이스
 */
export interface TransactionOptions {
  /** 트랜잭션 시작 대기 최대 시간 (ms) */
  maxWait?: number;
  /** 트랜잭션 실행 타임아웃 (ms) */
  timeout?: number;
  /** 트랜잭션 격리 수준 */
  isolationLevel?: Prisma.TransactionIsolationLevel;
}

/**
 * 연결 재시도 설정
 */
interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
}

/**
 * Prisma 데이터베이스 서비스
 * - PostgreSQL (Supabase) 연결 관리
 * - NestJS 생명주기와 통합
 * - Prisma 7.x adapter 방식 사용 (필수)
 * - Vercel serverless 환경 최적화
 * - 트랜잭션 타임아웃/격리 수준 지원
 * - 연결 실패 시 지수 백오프 재시도
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly isVercel: boolean;
  private readonly retryConfig: RetryConfig;

  /** 기본 트랜잭션 옵션 (환경별) */
  private readonly defaultTransactionOptions: Required<
    Omit<TransactionOptions, 'isolationLevel'>
  >;

  /** Slow query 임계값 (ms) */
  private readonly slowQueryThresholdMs = 300;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Vercel serverless 환경 감지
    const isVercel = !!process.env.VERCEL;

    // 환경 변수로 풀 설정 오버라이드 가능
    const poolMax = process.env.DB_POOL_MAX
      ? parseInt(process.env.DB_POOL_MAX, 10)
      : isVercel
        ? 1
        : 10;

    const idleTimeoutMs = process.env.DB_IDLE_TIMEOUT
      ? parseInt(process.env.DB_IDLE_TIMEOUT, 10)
      : isVercel
        ? 10000
        : 30000;

    const connectionTimeoutMs = process.env.DB_CONNECTION_TIMEOUT
      ? parseInt(process.env.DB_CONNECTION_TIMEOUT, 10)
      : isVercel
        ? 5000
        : 10000;

    // Prisma 7.x: PrismaPg는 pg.PoolConfig 또는 connectionString을 직접 받음
    const adapter = new PrismaPg({
      connectionString,
      max: poolMax,
      idleTimeoutMillis: idleTimeoutMs,
      connectionTimeoutMillis: connectionTimeoutMs,
    });

    // 로그 설정: 개발 환경에서는 상세 로그, 프로덕션에서는 에러만
    const logConfig: Prisma.LogLevel[] =
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'];

    super({
      adapter,
      log: logConfig,
    });

    this.isVercel = isVercel;

    // 재시도 설정: Vercel은 cold start 고려하여 적은 횟수
    this.retryConfig = {
      maxRetries: isVercel ? 3 : 5,
      baseDelayMs: 2000,
    };

    // 트랜잭션 기본 옵션: Vercel은 짧은 타임아웃
    this.defaultTransactionOptions = {
      maxWait: isVercel ? 5000 : 10000,
      timeout: isVercel ? 10000 : 30000,
    };

    this.logger.log(
      `PrismaService initialized [env: ${isVercel ? 'Vercel' : 'Local'}] ` +
        `[pool: max=${poolMax}, idle=${idleTimeoutMs}ms, connect=${connectionTimeoutMs}ms]`,
    );
  }

  async onModuleInit() {
    await this.connectWithRetry();
    this.setupSlowQueryLogging();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from PostgreSQL database');
  }

  /**
   * 지수 백오프를 사용한 연결 재시도
   * - Vercel: 3회 재시도
   * - 로컬: 5회 재시도
   * - 지수 백오프: baseDelayMs * attempt
   */
  private async connectWithRetry(): Promise<void> {
    const { maxRetries, baseDelayMs } = this.retryConfig;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.$connect();
        this.logger.log(
          `Successfully connected to PostgreSQL database (attempt ${attempt}/${maxRetries})`,
        );
        return;
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;

        if (isLastAttempt) {
          this.logger.error(
            `Failed to connect to database after ${maxRetries} attempts`,
            error instanceof Error ? error.stack : error,
          );
          throw error;
        }

        const delayMs = baseDelayMs * attempt;
        this.logger.warn(
          `Database connection attempt ${attempt}/${maxRetries} failed. ` +
            `Retrying in ${delayMs}ms...`,
          error instanceof Error ? error.message : error,
        );

        await this.sleep(delayMs);
      }
    }
  }

  /**
   * Slow query 로깅 설정
   * - 프로덕션에서도 300ms 이상 쿼리 감지
   */
  private setupSlowQueryLogging(): void {
    // Prisma 7.x에서는 $on('query') 이벤트 사용
    // 개발 환경에서만 활성화 (프로덕션에서는 log: ['error']로 쿼리 로그 비활성화)
    if (process.env.NODE_ENV === 'development') {
      this.$on('query' as never, (e: unknown) => {
        const event = e as { duration?: number; query?: string };
        if (event.duration && event.duration > this.slowQueryThresholdMs) {
          this.logger.warn(
            `[SLOW QUERY] ${event.duration}ms - ${event.query?.substring(0, 200)}...`,
          );
        }
      });
    }
  }

  /**
   * 트랜잭션 헬퍼 메서드
   * - 여러 작업을 원자적으로 실행
   * - 환경별 기본 타임아웃 적용
   * - 격리 수준 설정 가능
   *
   * @param fn 트랜잭션 내에서 실행할 함수
   * @param options 트랜잭션 옵션 (maxWait, timeout, isolationLevel)
   * @returns 트랜잭션 결과
   *
   * @example
   * // 기본 사용 (환경별 기본 타임아웃 적용)
   * await prisma.executeInTransaction(async (tx) => {
   *   await tx.task.create({ data: taskData });
   *   await tx.syncLog.create({ data: logData });
   * });
   *
   * @example
   * // 커스텀 옵션
   * await prisma.executeInTransaction(
   *   async (tx) => { ... },
   *   { timeout: 5000, isolationLevel: 'Serializable' }
   * );
   */
  async executeInTransaction<T>(
    fn: (
      client: Omit<
        PrismaClient,
        '$connect' | '$disconnect' | '$on' | '$extends'
      >,
    ) => Promise<T>,
    options?: TransactionOptions,
  ): Promise<T> {
    const mergedOptions = {
      maxWait: options?.maxWait ?? this.defaultTransactionOptions.maxWait,
      timeout: options?.timeout ?? this.defaultTransactionOptions.timeout,
      ...(options?.isolationLevel && {
        isolationLevel: options.isolationLevel,
      }),
    };

    const startTime = Date.now();

    try {
      const result = await this.$transaction(fn, mergedOptions);
      const duration = Date.now() - startTime;

      if (duration > this.slowQueryThresholdMs) {
        this.logger.warn(
          `[SLOW TRANSACTION] ${duration}ms (timeout: ${mergedOptions.timeout}ms)`,
        );
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      // 트랜잭션 에러 상세 로깅
      this.logger.error(
        `Transaction failed after ${duration}ms ` +
          `[maxWait: ${mergedOptions.maxWait}ms, timeout: ${mergedOptions.timeout}ms]`,
        error instanceof Error ? error.stack : error,
      );

      // 타임아웃 에러인 경우 추가 컨텍스트 제공
      if (
        error instanceof Error &&
        (error.message.includes('timeout') ||
          error.message.includes('Transaction'))
      ) {
        this.logger.error(
          `Transaction timeout hint: Consider increasing timeout or optimizing queries. ` +
            `Current env: ${this.isVercel ? 'Vercel' : 'Local'}`,
        );
      }

      throw error;
    }
  }

  /**
   * 헬스 체크 메서드
   * - 데이터베이스 연결 상태 확인
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; latencyMs: number }> {
    const startTime = Date.now();

    try {
      await this.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        latencyMs: Date.now() - startTime,
      };
    } catch {
      return {
        status: 'error',
        latencyMs: Date.now() - startTime,
      };
    }
  }

  /**
   * sleep 유틸리티
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
