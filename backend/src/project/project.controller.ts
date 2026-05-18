import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

/**
 * Project CRUD API 컨트롤러
 */
@Controller('api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * Project 생성
   * POST /api/projects
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  /**
   * Project 목록 조회
   * GET /api/projects
   */
  @Get()
  async findAll() {
    return this.projectService.findAll();
  }

  /**
   * Project 단건 조회
   * GET /api/projects/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.findOne(id);
  }

  /**
   * Notion DB ID로 Project 조회
   * GET /api/projects/notion/:notionDbId
   */
  @Get('notion/:notionDbId')
  async findByNotionDbId(@Param('notionDbId') notionDbId: string) {
    return this.projectService.findByNotionDbId(notionDbId);
  }

  /**
   * Project 수정
   * PUT /api/projects/:id
   */
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) dto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, dto);
  }

  /**
   * Project 삭제
   * DELETE /api/projects/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.remove(id);
  }
}
