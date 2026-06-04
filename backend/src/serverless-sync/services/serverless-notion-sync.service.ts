import { Injectable, Logger } from '@nestjs/common';
import { NotionService } from '../../notion/notion.service';
import { TaskSyncPayload } from '../../common/types/sync.types';

/**
 * Serverless Notion 동기화 서비스
 * - Task 데이터를 Notion 페이지 properties 형식으로 변환
 * - Notion API 호출 추상화
 * - BullMQ 의존성 없음
 */
@Injectable()
export class ServerlessNotionSyncService {
  private readonly logger = new Logger(ServerlessNotionSyncService.name);

  // App Status -> Notion Status 매핑
  private readonly statusMapping: Record<string, string> = {
    'To Do': '시작 전',
    'In Progress': '진행 중',
    Done: '완료',
    // 이미 한글인 경우
    '시작 전': '시작 전',
    '진행 중': '진행 중',
    완료: '완료',
  };

  constructor(private readonly notionService: NotionService) {}

  /**
   * Task 데이터를 Notion properties 형식으로 변환
   * Notion 데이터베이스 스키마에 맞게 속성 이름 매핑:
   * - Task Name (title)
   * - Status: "시작 전", "진행 중", "완료"
   * - Priority: "High", "Medium", "Low"
   * - Due Date (date)
   * - Tags (multi_select)
   * - Description (text)
   */
  private buildNotionProperties(payload: TaskSyncPayload): Record<string, any> {
    const properties: Record<string, any> = {};

    // Title (필수) - Notion 속성명: "Task Name"
    if (payload.title) {
      properties['Task Name'] = {
        title: [
          {
            text: {
              content: payload.title,
            },
          },
        ],
      };
    }

    // Status - Notion 속성명: "Status" (한글 값: "시작 전", "진행 중", "완료")
    if (payload.status) {
      const notionStatus = this.statusMapping[payload.status] || payload.status;
      properties['Status'] = {
        status: {
          name: notionStatus,
        },
      };
    }

    // Priority - Notion 속성명: "Priority" ("High", "Medium", "Low")
    if (payload.priority) {
      properties['Priority'] = {
        select: {
          name: payload.priority,
        },
      };
    }

    // Due Date - Notion 속성명: "Due Date"
    if (payload.startDate || payload.endDate) {
      properties['Due Date'] = {
        date: {
          start: payload.startDate || payload.endDate,
          end: payload.startDate && payload.endDate ? payload.endDate : null,
        },
      };
    }

    // Tags - Notion 속성명: "Tags"
    if (payload.tags && payload.tags.length > 0) {
      properties['Tags'] = {
        multi_select: payload.tags.map((tag) => ({ name: tag })),
      };
    }

    // Description - Notion 속성명: "Description"
    if (payload.content) {
      properties['Description'] = {
        rich_text: [
          {
            text: {
              content: payload.content,
            },
          },
        ],
      };
    }

    // Assignees - Notion 속성명: "Assignees" (rich_text로 저장, 이름 쉼표 구분)
    if (payload.assignees && payload.assignees.length > 0) {
      properties['Assignees'] = {
        rich_text: [
          {
            text: {
              content: payload.assignees.join(', '),
            },
          },
        ],
      };
    }

    return properties;
  }

  /**
   * Notion 페이지 생성
   */
  async createNotionPage(payload: TaskSyncPayload): Promise<any> {
    this.logger.log(`Creating Notion page: ${payload.title}`);

    const properties = this.buildNotionProperties(payload);

    try {
      const result = await this.notionService.createPage(properties);
      this.logger.log(`Notion page created: ${result.id}`);
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to create Notion page: ${error.message}`);
      throw error;
    }
  }

  /**
   * Notion 페이지 업데이트
   * - 속성이 존재하지 않으면 해당 속성 제외 후 재시도
   */
  async updateNotionPage(
    notionPageId: string,
    payload: TaskSyncPayload,
  ): Promise<any> {
    this.logger.log(`Updating Notion page: ${notionPageId}`);
    this.logger.log(`Sync payload: ${JSON.stringify(payload)}`);

    let properties = this.buildNotionProperties(payload);

    try {
      const result = await this.notionService.updatePage(
        notionPageId,
        properties,
      );
      this.logger.log(`Notion page updated: ${notionPageId}`);
      return result;
    } catch (error: any) {
      // 속성이 존재하지 않는 경우 해당 속성 제외 후 재시도
      if (error.message?.includes('is not a property that exists')) {
        const match = error.message.match(/^(.+?) is not a property/);
        if (match) {
          const missingProperty = match[1];
          this.logger.warn(
            `Property "${missingProperty}" does not exist in Notion. Retrying without it.`,
          );
          delete properties[missingProperty];

          // 재시도
          const result = await this.notionService.updatePage(
            notionPageId,
            properties,
          );
          this.logger.log(`Notion page updated (without ${missingProperty}): ${notionPageId}`);
          return result;
        }
      }
      this.logger.error(`Failed to update Notion page: ${error.message}`);
      throw error;
    }
  }

  /**
   * Notion 페이지 아카이브 (논리적 삭제)
   * - Notion API는 페이지를 완전 삭제하지 않고 archived=true로 설정
   */
  async archiveNotionPage(notionPageId: string): Promise<any> {
    this.logger.log(`Archiving Notion page: ${notionPageId}`);

    try {
      const result = await this.notionService.archivePage(notionPageId);
      this.logger.log(`Notion page archived: ${notionPageId}`);
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to archive Notion page: ${error.message}`);
      throw error;
    }
  }
}
