import { IsString, IsOptional, MaxLength } from 'class-validator';

/**
 * Project 생성 DTO
 */
export class CreateProjectDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  notionDbId: string;
}
