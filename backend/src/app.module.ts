import { Module, DynamicModule, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { NotionModule } from './notion/notion.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { WorkflowStatusModule } from './workflow-status/workflow-status.module';
import { ServerlessSyncModule } from './serverless-sync/serverless-sync.module';
import configuration from './config/configuration';
import { validate } from './config/env.validation';

// ConfigModule 초기화 전에 .env 파일 로드 (forRoot에서 환경 변수 접근 필요)
// Vercel 환경에서는 환경 변수가 자동 주입되므로 dotenv 불필요
if (!process.env.VERCEL) {
  require('dotenv').config();
}

/**
 * App 모듈
 * - Vercel 서버리스 호환 (Supabase JS Client 사용)
 * - Vercel 환경: ServerlessSyncModule 로드 (BullMQ 없이 수동 동기화 지원)
 * - 로컬 환경 + Redis URL: SyncModule 자동 로드 (BullMQ 큐 기반 동기화)
 */
@Module({})
export class AppModule {
  private static readonly logger = new Logger('AppModule');

  static forRoot(): DynamicModule {
    const redisUrl = process.env.REDIS_URL ?? process.env.KV_URL;
    const isVercel = !!process.env.VERCEL;

    // 기본 imports
    const imports: any[] = [
      // 환경 설정 모듈 (환경 변수 검증 포함)
      ConfigModule.forRoot({
        isGlobal: true,
        load: [configuration],
        validate,
      }),

      // 데이터베이스
      SupabaseModule,

      // 기능 모듈
      NotionModule,
      TaskModule,
      ProjectModule,
      WorkflowStatusModule,
    ];

    // Vercel 환경: ServerlessSyncModule 로드 (BullMQ 없이 수동 동기화 지원)
    if (isVercel) {
      this.logger.log(
        'Vercel environment detected - Loading ServerlessSyncModule',
      );
      imports.push(ServerlessSyncModule);
    }
    // 로컬 환경 + Redis URL이 있으면 SyncModule 로드
    else if (redisUrl) {
      this.logger.log('Redis URL detected - Loading SyncModule for local sync');

      // BullMQ와 SyncModule 동적 import (Vercel 빌드 오류 방지)
      try {
        const { BullModule } = require('@nestjs/bullmq');
        imports.push(
          BullModule.forRoot({
            connection: {
              url: redisUrl,
            },
          }),
        );

        const { SyncModule } = require('./sync/sync.module');
        imports.push(SyncModule);
        this.logger.log('SyncModule loaded successfully');
      } catch (error) {
        this.logger.warn(`Failed to load SyncModule: ${error}`);
      }
    }
    // 로컬 환경 + Redis 없음: ServerlessSyncModule 로드 (수동 동기화만 가능)
    else {
      this.logger.log(
        'No Redis URL - Loading ServerlessSyncModule for manual sync only',
      );
      imports.push(ServerlessSyncModule);
    }

    return {
      module: AppModule,
      imports,
      controllers: [AppController],
      providers: [AppService],
    };
  }
}
