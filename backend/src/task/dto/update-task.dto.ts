import {
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  IsDateString,
  IsEnum,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { TaskPriority } from './create-task.dto';

/**
 * Task 수정 DTO
 * Note: @nestjs/mapped-types 설치 후 PartialType(CreateTaskDto)로 개선 가능
 */
export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  /**
   * Workflow Status ID
   * - undefined: 기존 값 유지
   * - null: 명시적으로 "No Status"로 설정
   * - string (UUID): 해당 status로 변경
   */
  @IsOptional()
  @ValidateIf((o) => o.statusId !== null)
  @IsUUID()
  statusId?: string | null;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  /**
   * Start Date
   * - undefined: 기존 값 유지
   * - null: 명시적으로 날짜 제거
   * - string (ISO): 해당 날짜로 변경
   */
  @IsOptional()
  @ValidateIf((o) => o.startDate !== null)
  @IsDateString()
  startDate?: string | null;

  /**
   * End Date
   * - undefined: 기존 값 유지
   * - null: 명시적으로 날짜 제거
   * - string (ISO): 해당 날짜로 변경
   */
  @IsOptional()
  @ValidateIf((o) => o.endDate !== null)
  @IsDateString()
  endDate?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignees?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
