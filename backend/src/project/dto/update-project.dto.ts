import { IsString, IsOptional, MaxLength } from 'class-validator';

/**
 * Project 수정 DTO
 */
export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
