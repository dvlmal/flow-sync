# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlowSync is an MCP-based Notion-integrated project workflow management system. It combines a React frontend with a NestJS backend, using PostgreSQL (Supabase) as the primary database and Prisma as the ORM. The system enables Kanban-style workflow management with bidirectional Notion synchronization via MCP (Model Context Protocol).

## Build and Development Commands

### Backend (NestJS) - `/backend`

```bash
npm run start:dev          # Development mode with hot reload
npm run build              # Compile TypeScript
npm run start:prod         # Production mode

npm run lint               # ESLint with auto-fix
npm run format             # Prettier formatting

npm run test               # Run unit tests
npm run test:watch         # Tests in watch mode
npm run test:e2e           # End-to-end tests

npx prisma migrate dev     # Create/apply migrations
npx prisma generate        # Generate Prisma client
npx prisma db pull         # Pull schema from existing DB
```

### Frontend (React + Vite) - `/frontend`

```bash
npm run dev                # Dev server on port 3000
npm run build              # TypeScript compile + Vite build
npm run lint               # ESLint
npm run preview            # Preview production build
```

## Architecture

```
React Frontend (port 3000)
    │ /api proxy
    ▼
NestJS Backend (port 4000)
    ├── AppModule
    ├── NotionModule ─── NotionService, NotionController
    │       │
    │       ▼
    │   Notion API (@notionhq/client v5)
    │       │
    │       ▼
    │   FlowSync Tasks DB (Notion)
    │
    ▼
PostgreSQL (Supabase) ─── Primary Source of Truth
    │
    ▼
Sync Queue (BullMQ/Redis) [TODO: 2단계]
    │
    ▼
Sync Worker → MCP Client → Notion MCP Server → Notion API
```

### Backend Modules

| Module | Description |
|--------|-------------|
| AppModule | Root module |
| NotionModule | Notion API integration (CRUD, pagination, sync) |

**Data Flow:**
- App → Notion: User action → PostgreSQL → Sync Queue → Worker → MCP → Notion
- Notion → App: Scheduler polls Notion (1-5 min) → Compare updated_time → Update DB

**Conflict Resolution:** Last Write Wins (based on updated_at timestamp)

## Database Schema

Five main tables in Prisma schema:

- **profiles**: User profiles with Notion user mapping
- **project**: Projects linked to Notion databases via `notion_db_id`
- **task**: Tasks with `notion_page_id`, assignees (JSON), tags, raw_notion_data (JSON)
- **workflow_status**: Kanban status columns per project with `notion_option_id`
- **sync_log**: Sync history tracking direction, status, retry_count, errors

## Key Configuration

- Frontend proxies `/api` requests to `http://localhost:4000` (configured in vite.config.ts)
- Backend uses `DATABASE_URL` for pooled connections, `DIRECT_URL` for Prisma migrations
- React Query: 1-minute stale time, 1 retry default (constants in `QUERY_CONFIG`)
- Code style: single quotes, trailing commas (Prettier)

### Environment Variables (backend/.env)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase pooled connection URL |
| `DIRECT_URL` | Direct connection for Prisma migrations |
| `NOTION_API_KEY` | Notion Integration API key |
| `NOTION_DATABASE_ID` | FlowSync Tasks database ID |

### Notion Integration

- **Database ID**: `b677321d18c345428eece748ce04e9de`
- **Data Source ID**: `2ff9fc48-6c3e-4d88-96e7-edbfdde683bf`
- **API Endpoints**: `/api/notion/test`, `/api/notion/schema`, `/api/notion/pages`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TanStack Query, React Router, Tailwind CSS, Axios |
| Backend | NestJS 11, Prisma 7, TypeScript, @notionhq/client 5.x |
| Database | PostgreSQL (Supabase), Notion Database |
| Sync | BullMQ, Redis, MCP (TODO: 2단계) |

## Development Progress

### Completed (1단계)
- [x] Cloud DB 환경 구성 (Supabase)
- [x] React/NestJS 기본 구조 생성
- [x] DB 스키마 설계 (Prisma)
- [x] Notion MCP Server 연결
- [x] NotionService 구현 (CRUD, 페이지네이션, 초기화 보장)
- [x] 코드 리뷰 및 성능 최적화

### Next (2단계)
- [ ] Queue 및 Worker 구축 (BullMQ)
- [ ] App → Notion 단방향 Sync 구현
- [ ] 기본 CRUD API 완성 (Task)
