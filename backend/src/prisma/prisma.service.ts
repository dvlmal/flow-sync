import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Prisma 데이터베이스 서비스
 * - PostgreSQL (Supabase) 연결 관리
 * - NestJS 생명주기와 통합
 * - Prisma 7.x adapter 방식 사용
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // PostgreSQL connection pool 생성
    const pool = new Pool({
      connectionString,
      max: 10,
    });

    // Prisma 7.x adapter 생성
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });

    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to PostgreSQL database');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
    this.logger.log('Disconnected from PostgreSQL database');
  }

  /**
   * 트랜잭션 헬퍼 메서드
   * - 여러 작업을 원자적으로 실행
   */
  async executeInTransaction<T>(
    fn: (
      client: Omit<
        PrismaClient,
        '$connect' | '$disconnect' | '$on' | '$extends'
      >,
    ) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(fn);
  }
}
