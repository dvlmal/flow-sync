import { IsString, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

/**
 * WorkflowStatus 수정 DTO
 */
export class UpdateWorkflowStatusDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsString()
  notionOptionId?: string;
}
