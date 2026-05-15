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
    │
    ▼
PostgreSQL (Supabase) ─── Primary Source of Truth
    │
    ▼
Sync Queue (BullMQ/Redis)
    │
    ▼
Sync Worker → MCP Client → Notion MCP Server → Notion API
```

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
- React Query: 1-minute stale time, 1 retry default
- Code style: single quotes, trailing commas (Prettier)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TanStack Query, React Router, Tailwind CSS, Axios |
| Backend | NestJS 11, Prisma 7, TypeScript |
| Database | PostgreSQL (Supabase) |
| Sync | BullMQ, Redis, MCP |
