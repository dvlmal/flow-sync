import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase 데이터베이스 서비스
 * - Supabase JS Client를 사용한 PostgreSQL 연결
 * - Vercel serverless 환경 완벽 호환
 */
@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  public readonly client: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required',
      );
    }

    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const isVercel = !!process.env.VERCEL;
    this.logger.log(
      `SupabaseService initialized [env: ${isVercel ? 'Vercel' : 'Local'}]`,
    );
  }

  async onModuleInit() {
    // 연결 테스트
    const { error } = await this.client.from('project').select('id').limit(1);
    if (error) {
      this.logger.error('Failed to connect to Supabase:', error.message);
      throw error;
    }
    this.logger.log('Successfully connected to Supabase');
  }

  /**
   * 헬스 체크
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; latencyMs: number }> {
    const startTime = Date.now();

    try {
      const { error } = await this.client.from('project').select('id').limit(1);
      return {
        status: error ? 'error' : 'ok',
        latencyMs: Date.now() - startTime,
      };
    } catch {
      return {
        status: 'error',
        latencyMs: Date.now() - startTime,
      };
    }
  }
}
