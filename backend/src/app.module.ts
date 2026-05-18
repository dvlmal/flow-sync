import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { NotionModule } from './notion/notion.module';
import { SyncModule } from './sync/sync.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { WorkflowStatusModule } from './workflow-status/workflow-status.module';
import configuration from './config/configuration';
import { validate } from './config/env.validation';

@Module({
  imports: [
    // 환경 설정 모듈 (환경 변수 검증 포함)
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate, // 환경 변수 검증
    }),

    // BullMQ 글로벌 설정 (Upstash Redis 지원)
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('redis.url');

        if (redisUrl) {
          // Upstash Redis URL 사용 (rediss:// TLS 지원)
          return {
            connection: {
              url: redisUrl,
              maxRetriesPerRequest: null, // BullMQ 권장 설정
              enableReadyCheck: false,
            },
          };
        }

        // Fallback: 로컬 Redis
        return {
          connection: {
            host: 'localhost',
            port: 6379,
            maxRetriesPerRequest: null,
          },
        };
      },
      inject: [ConfigService],
    }),

    // 데이터베이스
    PrismaModule,

    // 기능 모듈
    NotionModule,
    SyncModule,
    TaskModule,
    ProjectModule,
    WorkflowStatusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
