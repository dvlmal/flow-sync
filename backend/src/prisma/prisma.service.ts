import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '../generated/client';

/**
 * Prisma 데이터베이스 서비스
 * - PostgreSQL (Supabase) 연결 관리
 * - NestJS 생명주기와 통합
 * - 표준 Prisma 연결 방식 (Vercel 서버리스 호환)
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
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
