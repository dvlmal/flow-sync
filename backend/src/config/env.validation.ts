import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  validateSync,
} from 'class-validator';

/**
 * 환경 변수 검증 클래스
 * - class-validator 기반 타입 안전한 환경 변수 검증
 */
export class EnvironmentVariables {
  /**
   * 애플리케이션 포트
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT?: number = 4000;

  /**
   * Redis 설정 (Upstash Redis URL 또는 로컬 Redis)
   */
  @IsOptional()
  @IsString()
  REDIS_URL?: string;

  @IsOptional()
  @IsString()
  KV_URL?: string; // Vercel KV alias

  /**
   * Notion 설정 (필수)
   */
  @IsString()
  @IsNotEmpty({ message: 'NOTION_API_KEY is required' })
  NOTION_API_KEY: string;

  @IsString()
  @IsNotEmpty({ message: 'NOTION_DATABASE_ID is required' })
  NOTION_DATABASE_ID: string;

  /**
   * 데이터베이스 설정 (필수)
   */
  @IsString()
  @IsNotEmpty({ message: 'DATABASE_URL is required' })
  DATABASE_URL: string;

  @IsOptional()
  @IsString()
  DIRECT_URL?: string;

  /**
   * 동기화 설정
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  SYNC_MAX_RETRIES?: number = 5;

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(10000)
  SYNC_BASE_DELAY_MS?: number = 1000;

  @IsOptional()
  @IsNumber()
  @Min(1000)
  @Max(60000)
  SYNC_MAX_DELAY_MS?: number = 30000;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  NOTION_RATE_LIMIT?: number = 3;

  /**
   * 환경 (개발/프로덕션)
   */
  @IsOptional()
  @IsString()
  NODE_ENV?: string = 'development';
}

/**
 * 환경 변수 검증 함수
 * - ConfigModule.forRoot()의 validate 옵션에 전달
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors.map((error) => {
      const constraints = error.constraints
        ? Object.values(error.constraints).join(', ')
        : 'Unknown error';
      return `${error.property}: ${constraints}`;
    });

    throw new Error(
      `Environment validation failed:\n${errorMessages.join('\n')}`,
    );
  }

  return validatedConfig;
}
