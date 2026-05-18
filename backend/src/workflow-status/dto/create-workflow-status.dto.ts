import {
  IsString,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

/**
 * WorkflowStatus 생성 DTO
 */
export class CreateWorkflowStatusDto {
  @IsUUID()
  projectId: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsString()
  notionOptionId?: string;
}
