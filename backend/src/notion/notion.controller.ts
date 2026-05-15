import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { NotionService } from './notion.service';

@Controller('api/notion')
export class NotionController {
  constructor(private readonly notionService: NotionService) {}

  /**
   * Notion 연결 테스트
   * GET /api/notion/test
   */
  @Get('test')
  async testConnection() {
    return this.notionService.testConnection();
  }

  /**
   * 데이터베이스 스키마 조회
   * GET /api/notion/schema
   */
  @Get('schema')
  async getSchema() {
    return this.notionService.getDatabaseSchema();
  }

  /**
   * 모든 페이지 조회
   * GET /api/notion/pages
   */
  @Get('pages')
  async getPages() {
    return this.notionService.queryDatabase();
  }

  /**
   * 특정 페이지 조회
   * GET /api/notion/pages/:id
   */
  @Get('pages/:id')
  async getPage(@Param('id') id: string) {
    return this.notionService.getPage(id);
  }

  /**
   * 새 페이지 생성
   * POST /api/notion/pages
   */
  @Post('pages')
  async createPage(@Body() body: { properties: any }) {
    return this.notionService.createPage(body.properties);
  }

  /**
   * 페이지 업데이트
   * PUT /api/notion/pages/:id
   */
  @Put('pages/:id')
  async updatePage(@Param('id') id: string, @Body() body: { properties: any }) {
    return this.notionService.updatePage(id, body.properties);
  }
}
