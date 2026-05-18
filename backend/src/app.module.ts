import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { NotionModule } from './notion/notion.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { WorkflowStatusModule } from './workflow-status/workflow-status.module';
import configuration from './config/configuration';
import { validate } from './config/env.validation';

// Redis/BullMQ 사용 가능 여부 확인
const isRedisAvailable = !!(
  process.env.REDIS_URL ||
  process.env.KV_URL ||
  (process.env.REDIS_HOST && !process.env.VERCEL)
);

// 조건부 imports 빌드
const conditionalImports: any[] = [];

if (isRedisAvailable) {
  try {
    // 동적 import를 피하고 조건부로 모듈 추가
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { BullModule } = require('@nestjs/bullmq');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { SyncModule } = require('./sync/sync.module');

    conditionalImports.push(
      BullModule.forRoot({
        connection: {
          url: process.env.REDIS_URL || process.env.KV_URL,
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
        },
      }),
      SyncModule,
    );
    Logger.log('BullMQ and SyncModule loaded', 'AppModule');
  } catch (error) {
    Logger.warn('BullMQ not available, sync features disabled', 'AppModule');
  }
} else {
  Logger.log(
    'Redis not configured, sync features disabled (Vercel serverless mode)',
    'AppModule',
  );
}

@Module({
  imports: [
    // 환경 설정 모듈 (환경 변수 검증 포함)
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate, // 환경 변수 검증
    }),

    // 데이터베이스
    PrismaModule,

    // 기능 모듈
    NotionModule,
    TaskModule,
    ProjectModule,
    WorkflowStatusModule,

    // 조건부 모듈 (Redis 사용 가능 시)
    ...conditionalImports,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
