# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlowSync is an MCP-based Notion-integrated project workflow management system. It combines a React frontend with a NestJS backend, using PostgreSQL (Supabase) as the primary database with native Supabase REST API. The system enables Kanban-style workflow management with bidirectional Notion synchronization via MCP (Model Context Protocol).

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
    │ /api proxy (dev) or Vercel rewrites (prod)
    ▼
NestJS Backend (port 4000)
    ├── AppModule
    ├── TaskModule ─── TaskService, TaskController (CRUD)
    ├── ProjectModule ─── ProjectService, ProjectController
    ├── WorkflowStatusModule ─── WorkflowStatusService, WorkflowStatusController
    ├── SyncModule ─── (선택적, 로컬 환경만) SyncQueueService, SyncProcessor, NotionSyncService
    ├── NotionModule ─── NotionService, NotionController
    ├── SupabaseModule ─── SupabaseService (PostgreSQL 연결)
    └── ConfigModule ─── 환경 변수 관리
    │
    ▼
PostgreSQL (Supabase) ─── Primary Source of Truth
    │
    ▼ (로컬 환경만)
Sync Queue (BullMQ + Upstash Redis)
    │
    ▼
Sync Worker → Notion API → FlowSync Tasks DB (Notion)
```

### Vercel 배포 아키텍처

```
Vercel Frontend (/)
    │ rewrites: /api/* → /api (Serverless Function)
    ▼
Vercel Serverless Function (/api/index.ts)
    │ NestJS + Express
    ▼
Supabase REST API (PostgREST)
    │
    ▼
PostgreSQL (Supabase)
```

**Vercel Serverless Function 구조:**
- `/api/index.ts`: NestJS 앱을 Vercel 네이티브 핸들러로 래핑
- `includeFiles: "backend/**"`: 백엔드 소스 코드 포함
- 경로 재구성: Vercel rewrites로 전달된 path 파라미터를 URL로 복원

**Vercel 환경 제한사항:**
- SyncModule 비활성화 (BullMQ 미지원)
- Notion 동기화는 별도 서버에서 실행 필요

### Backend Modules

| Module | Description |
|--------|-------------|
| AppModule | Root module, global imports |
| TaskModule | Task CRUD API, Soft Delete |
| ProjectModule | Project CRUD API |
| WorkflowStatusModule | Workflow Status CRUD, 순서 재정렬 |
| SyncModule | BullMQ Queue/Worker, DLQ, Notion 동기화 **(로컬 전용, Vercel 제외)** |
| NotionModule | Notion API integration (CRUD, pagination) |
| SupabaseModule | Supabase REST API (native fetch), PostgreSQL 연결 |
| ConfigModule | 환경 변수 검증 및 관리 |

**Data Flow:**
- App → Notion: User action → PostgreSQL → Sync Queue → Worker → MCP → Notion
- Notion → App: Scheduler polls Notion (1-5 min) → Compare updated_time → Update DB

**Conflict Resolution:** Last Write Wins (based on updated_at timestamp)

## Database Schema

Five main tables in Supabase PostgreSQL:

- **profiles**: User profiles with Notion user mapping
- **project**: Projects linked to Notion databases via `notion_db_id`
- **task**: Tasks with `notion_page_id`, assignees (JSON), tags, raw_notion_data (JSON)
- **workflow_status**: Kanban status columns per project with `notion_option_id`, `color` (8색 지원)
- **sync_log**: Sync history tracking direction, status, retry_count, errors

## Key Configuration

- Frontend proxies `/api` requests to `http://localhost:4000` (configured in vite.config.ts)
- Vercel에서는 rewrites로 `/api/*` → `/api` (Serverless Function) 라우팅
- Backend uses Supabase REST API (native fetch) for database connections
- React Query: 1-minute stale time, 1 retry default (constants in `QUERY_CONFIG`)
- Code style: single quotes, trailing commas (Prettier)
- **tsconfig.build.json**: SyncModule 빌드 제외 (Vercel 호환)
- **tsconfig.local.json**: 로컬 개발 시 SyncModule 포함 빌드
- **dotenv 조건부 로드**: Vercel 환경에서는 자동 주입, 로컬에서만 dotenv 사용
- **UTF-8 인코딩**: Express json 미들웨어로 명시적 설정

### Environment Variables (backend/.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `NOTION_API_KEY` | Notion Integration API key | ✅ |
| `NOTION_DATABASE_ID` | FlowSync Tasks database ID | ✅ |
| `REDIS_URL` | Upstash Redis URL (로컬 Sync용) | |
| `VERCEL_URL` | Vercel 자동 제공 (CORS용) | |

### Notion Integration

- **Database ID**: `b677321d18c345428eece748ce04e9de`
- **Data Source ID**: `2ff9fc48-6c3e-4d88-96e7-edbfdde683bf`
- **API Endpoints**: `/api/notion/test`, `/api/notion/schema`, `/api/notion/pages`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TanStack Query, React Router, Tailwind CSS, Axios |
| UI Components | dnd-kit (Drag & Drop), FullCalendar, Lucide Icons |
| Backend | NestJS 11, Supabase REST API (native fetch), TypeScript, @notionhq/client 5.x |
| Database | PostgreSQL (Supabase), Notion Database |
| Sync | BullMQ, Upstash Redis, Last Write Wins 충돌 해결 **(로컬 전용)** |
| Deployment | Vercel Serverless Functions, Supabase |

### Frontend Structure (Atomic Design)

```
frontend/src/
├── components/
│   ├── atoms/       # Button, Input, Tag, Avatar, StatusDot, PriorityIcon
│   ├── molecules/   # Dropdown, ViewSwitcher, LoadingSpinner, AvatarGroup, StatusBadge
│   └── organisms/   # KanbanBoard, CalendarView, ListView, TaskCard, TaskModal
├── pages/           # Dashboard, TaskBoard, ProjectManagement, Settings, SyncLogs
├── hooks/           # useTasks, useProjects, useWorkflowStatuses (CRUD 지원)
├── api/             # API 클라이언트 (tasks, projects, workflow-statuses)
└── types/           # TypeScript 타입 정의 (WorkflowStatusColor 포함)
```

## Development Progress

### Completed (1단계: 기반 구축)
- [x] Cloud DB 환경 구성 (Supabase)
- [x] React/NestJS 기본 구조 생성
- [x] DB 스키마 설계 (Supabase)
- [x] Notion MCP Server 연결
- [x] NotionService 구현 (CRUD, 페이지네이션, 초기화 보장)

### Completed (2단계: 핵심 기능)
- [x] Queue 및 Worker 구축 (BullMQ + Upstash Redis)
- [x] App → Notion 단방향 Sync 구현
- [x] 기본 CRUD API 완성 (Task, Project, WorkflowStatus)
- [x] Dead Letter Queue (DLQ) 구현
- [x] Sync Log 기록

### Completed (3단계: UI 개발)
- [x] Kanban Board (dnd-kit 드래그 앤 드롭)
- [x] Calendar View (FullCalendar, 한글화, 공휴일 표시)
- [x] List View (정렬, 필터링)
- [x] Task 생성/수정 Modal (시작일/종료일 지원)
- [x] Atomic Design 컴포넌트 구조
- [x] Dashboard 페이지 (프로젝트별 작업 현황)
- [x] Project Management 페이지 (CRUD + 워크플로우 상태 관리)
- [x] Settings 페이지 (수동 동기화, 동기화 로그 연결)
- [x] SyncLogs 페이지 (동기화 이력 및 오류 조회)
- [x] Workflow Status 색상 선택 기능 (8색 팔레트)

### Completed (Vercel 배포)
- [x] Vercel Serverless Functions 설정 (`/api/index.ts`)
- [x] API rewrites 구성 (`/api/:path*` → `/api`)
- [x] SyncModule 조건부 빌드 (tsconfig.build.json)
- [x] BullMQ optionalDependencies로 이동
- [x] Supabase REST API로 전환 (Prisma 제거, native fetch 사용)
- [x] Vercel 네이티브 핸들러 구현 (@vercel/node 타입 사용)

### Completed (동기화 개선)
- [x] SyncModule 동적 로딩 (로컬 환경에서 Redis 감지 시 자동 로드)
- [x] BullModule/SyncModule 동적 import (Vercel 빌드 호환)
- [x] Sync 서비스 Supabase 마이그레이션 (SyncLogService, DlqService)
- [x] TaskService DI 개선 (injection token으로 SyncQueueService 주입)
- [x] 날짜 필드 null 지원 (startDate/endDate 명시적 제거 가능)
- [x] CalendarView 종료일 처리 수정 (FullCalendar exclusive end date 보정)
- [x] ListView 인라인 날짜 편집 기능 추가
- [x] UTF-8 인코딩 명시적 설정

### Next (4단계: 동기화 고도화)
- [ ] Notion → App Polling Scheduler (백엔드 스케줄러 구현 필요)
- [ ] Conflict Resolution 강화 (Last Write Wins → 사용자 선택 옵션)
- [ ] Supabase Realtime 연동 (실시간 UI 업데이트)
- [ ] Sync Worker 별도 서버 배포 (Railway/Render)
- [ ] Settings 페이지 백엔드 API 연동 (수동 동기화)
- [ ] SyncLogs 페이지 백엔드 API 연동
