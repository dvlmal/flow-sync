import { Module } from '@nestjs/common';
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

/**
 * App 모듈
 * - Vercel 서버리스 호환 (BullMQ/Sync 모듈 제외)
 * - 로컬에서 Sync 기능 사용 시 SyncModule 별도 실행 필요
 */
@Module({
  imports: [
    // 환경 설정 모듈 (환경 변수 검증 포함)
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),

    // 데이터베이스
    PrismaModule,

    // 기능 모듈
    NotionModule,
    TaskModule,
    ProjectModule,
    WorkflowStatusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
