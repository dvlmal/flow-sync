/**
 * 애플리케이션 환경 설정
 * - Redis, Notion, 동기화 관련 설정값 관리
 */
export default () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),

  // Redis 설정 (Upstash Redis URL 사용)
  redis: {
    url: process.env.REDIS_URL ?? process.env.KV_URL,
  },

  // Notion 설정
  notion: {
    apiKey: process.env.NOTION_API_KEY,
    databaseId: process.env.NOTION_DATABASE_ID,
  },

  // 동기화 설정
  sync: {
    // 재시도 설정
    maxRetries: parseInt(process.env.SYNC_MAX_RETRIES ?? '5', 10),
    baseDelayMs: parseInt(process.env.SYNC_BASE_DELAY_MS ?? '1000', 10),
    maxDelayMs: parseInt(process.env.SYNC_MAX_DELAY_MS ?? '30000', 10),

    // Rate Limit 설정 (Notion API: 3 req/sec)
    rateLimitPerSecond: parseInt(process.env.NOTION_RATE_LIMIT ?? '3', 10),
  },
});
