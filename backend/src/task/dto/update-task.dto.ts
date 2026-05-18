import {
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  IsDateString,
  IsEnum,
  MaxLength,
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

  @IsOptional()
  @IsUUID()
  statusId?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignees?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
