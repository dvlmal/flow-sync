import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from '@notionhq/client';

/**
 * Notion API 페이지네이션 설정
 * Notion API는 한 번에 최대 100개 항목만 반환하므로 페이지네이션 처리 필요
 */
const NOTION_PAGE_SIZE = 100;

@Injectable()
export class NotionService implements OnModuleInit {
  private readonly logger = new Logger(NotionService.name);
  private notion: Client;
  private databaseId: string;
  private dataSourceId: string;

  /** 초기화 완료를 추적하는 Promise */
  private initializationPromise: Promise<void>;
  private resolveInitialization: () => void;
  private isInitialized = false;

  constructor() {
    // 초기화 완료 대기를 위한 Promise 생성
    this.initializationPromise = new Promise<void>((resolve) => {
      this.resolveInitialization = resolve;
    });
  }

  async onModuleInit() {
    try {
      this.notion = new Client({
        auth: process.env.NOTION_API_KEY,
      });
      this.databaseId = process.env.NOTION_DATABASE_ID || '';

      // 데이터베이스에서 data_source_id 추출
      try {
        const db = await this.notion.databases.retrieve({
          database_id: this.databaseId,
        });
        this.dataSourceId = (db as any).data_sources?.[0]?.id || this.databaseId;
        this.logger.log(`Notion client initialized with data source: ${this.dataSourceId}`);
      } catch (error) {
        this.dataSourceId = this.databaseId;
        this.logger.log('Notion client initialized');
      }

      this.isInitialized = true;
      this.resolveInitialization();
    } catch (error) {
      this.logger.error('Failed to initialize Notion client', error);
      throw error;
    }
  }

  /**
   * 초기화 완료를 보장하는 메서드
   * 모든 public 메서드에서 호출하여 초기화 전 요청에 의한 undefined 참조 방지
   */
  private async ensureInitialized(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    await this.initializationPromise;
  }

  /**
   * Notion 연결 테스트
   */
  async testConnection(): Promise<{ success: boolean; database?: any; error?: string }> {
    await this.ensureInitialized();

    try {
      const response = await this.notion.databases.retrieve({
        database_id: this.databaseId,
      });
      this.logger.log(`Connected to Notion database: ${response.id}`);
      return { success: true, database: response };
    } catch (error) {
      this.logger.error('Failed to connect to Notion', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 데이터베이스에서 모든 페이지 조회 (페이지네이션 처리 포함)
   * Notion API는 한 번에 최대 100개 항목만 반환하므로 has_more, next_cursor를 활용하여
   * 모든 데이터를 순회하며 조회
   *
   * @param filter - Notion API 필터 조건
   * @param sorts - 정렬 조건
   * @returns 전체 페이지 결과 배열
   */
  async queryDatabase(filter?: any, sorts?: any[]) {
    await this.ensureInitialized();

    try {
      const allResults: any[] = [];
      let hasMore = true;
      let nextCursor: string | undefined = undefined;

      while (hasMore) {
        const queryParams: any = {
          data_source_id: this.dataSourceId,
          page_size: NOTION_PAGE_SIZE,
        };
        if (filter) queryParams.filter = filter;
        if (sorts) queryParams.sorts = sorts;
        if (nextCursor) queryParams.start_cursor = nextCursor;

        const response = await this.notion.dataSources.query(queryParams);

        allResults.push(...response.results);

        hasMore = response.has_more ?? false;
        nextCursor = response.next_cursor ?? undefined;

        if (hasMore) {
          this.logger.debug(`Fetching next page, current count: ${allResults.length}`);
        }
      }

      this.logger.log(`Total pages fetched: ${allResults.length}`);
      return allResults;
    } catch (error) {
      this.logger.error('Failed to query database', error);
      throw error;
    }
  }

  /**
   * 특정 페이지 조회
   */
  async getPage(pageId: string) {
    await this.ensureInitialized();

    try {
      const response = await this.notion.pages.retrieve({
        page_id: pageId,
      });
      return response;
    } catch (error) {
      this.logger.error(`Failed to get page: ${pageId}`, error);
      throw error;
    }
  }

  /**
   * 새 페이지 생성
   */
  async createPage(properties: any) {
    await this.ensureInitialized();

    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties,
      });
      this.logger.log(`Created new page: ${response.id}`);
      return response;
    } catch (error) {
      this.logger.error('Failed to create page', error);
      throw error;
    }
  }

  /**
   * 페이지 업데이트
   *
   * TODO: 동시성 제어 구현 필요
   * - 현재 동일 페이지에 대한 동시 업데이트 요청 시 race condition 발생 가능
   * - 향후 BullMQ 큐를 통한 순차 처리로 동시성 제어 예정
   * - 참고: async-mutex 또는 분산 락(Redis)을 사용한 대안도 검토 가능
   * - 관련 이슈: 동일 pageId에 대한 요청을 큐에서 직렬화하여 처리
   */
  async updatePage(pageId: string, properties: any) {
    await this.ensureInitialized();

    try {
      const response = await this.notion.pages.update({
        page_id: pageId,
        properties,
      });
      this.logger.log(`Updated page: ${pageId}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to update page: ${pageId}`, error);
      throw error;
    }
  }

  /**
   * 마지막 수정 시간 이후 변경된 페이지 조회 (페이지네이션 처리 포함)
   * 대량 업데이트 시에도 모든 변경 페이지를 누락 없이 조회
   *
   * @param lastSyncTime - 마지막 동기화 시간
   * @returns 변경된 전체 페이지 배열 (last_edited_time 내림차순)
   */
  async getUpdatedPages(lastSyncTime: Date) {
    await this.ensureInitialized();

    try {
      const allResults: any[] = [];
      let hasMore = true;
      let nextCursor: string | undefined = undefined;

      while (hasMore) {
        const queryParams: any = {
          data_source_id: this.dataSourceId,
          page_size: NOTION_PAGE_SIZE,
          filter: {
            timestamp: 'last_edited_time',
            last_edited_time: {
              after: lastSyncTime.toISOString(),
            },
          },
          sorts: [
            {
              timestamp: 'last_edited_time',
              direction: 'descending',
            },
          ],
        };
        if (nextCursor) queryParams.start_cursor = nextCursor;

        const response = await this.notion.dataSources.query(queryParams);

        allResults.push(...response.results);

        hasMore = response.has_more ?? false;
        nextCursor = response.next_cursor ?? undefined;

        if (hasMore) {
          this.logger.debug(`Fetching next updated pages, current count: ${allResults.length}`);
        }
      }

      this.logger.log(`Total updated pages fetched since ${lastSyncTime.toISOString()}: ${allResults.length}`);
      return allResults;
    } catch (error) {
      this.logger.error('Failed to get updated pages', error);
      throw error;
    }
  }

  /**
   * 데이터베이스 스키마(속성) 조회
   */
  async getDatabaseSchema() {
    await this.ensureInitialized();

    try {
      const response = await this.notion.databases.retrieve({
        database_id: this.databaseId,
      });
      return (response as any).properties;
    } catch (error) {
      this.logger.error('Failed to get database schema', error);
      throw error;
    }
  }
}
