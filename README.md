# FlowSync

MCP 기반 노션 연동형 프로젝트 워크플로우 관리 시스템

## 주요 기능

- **멀티 뷰 지원**: Kanban Board, Calendar, List View
- **Notion 양방향 동기화**: MCP(Model Context Protocol) 기반 자동 동기화
- **워크플로우 커스터마이징**: 프로젝트별 상태 단계 설정 (8색 팔레트 지원)
- **프로젝트 관리**: 프로젝트 CRUD 및 워크플로우 상태 관리
- **담당자 관리**: Task별 담당자 지정 및 Notion 동기화
- **동기화 모니터링**: 동기화 로그 조회 및 수동 동기화 기능
- **문서 자동 생성**: 업무 완료 시 Notion 보고서 템플릿 자동 생성

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 19, Vite, TanStack Query, Tailwind CSS |
| Backend | NestJS 11, Supabase REST API |
| Database | PostgreSQL (Supabase) |
| Queue | Redis, BullMQ (로컬 전용) |
| Deployment | Vercel Serverless Functions |
| Protocol | MCP (Model Context Protocol) |

## 시작하기

### 요구사항

- Node.js 20+
- PostgreSQL (Supabase 권장)
- Redis (동기화 Queue용)

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd flow-sync

# 백엔드 설정
cd backend
npm install
cp .env.example .env  # 환경변수 설정

# 프론트엔드 설정
cd ../frontend
npm install
```

### 환경변수 설정

`backend/.env` 파일에 다음 값을 설정:

```env
# Supabase Configuration
SUPABASE_URL="https://[project-ref].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJ..."   # Supabase service_role key

# Notion API
NOTION_API_KEY="ntn_..."             # Notion Integration API key
NOTION_DATABASE_ID="..."             # FlowSync Tasks database ID

# Optional: Redis (로컬 동기화용)
REDIS_URL="rediss://..."             # Upstash Redis URL
```

### Supabase 권한 설정

Supabase SQL Editor에서 다음 명령을 실행하여 service_role 권한 부여:

```sql
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
```

### 실행

```bash
# Windows: start.bat 실행
start.bat

# 또는 수동 실행
npm run dev    # 백엔드(4000) + 프론트엔드(3000) 동시 실행
```

브라우저에서 http://localhost:3000 접속

### Vercel 배포

프로젝트는 Vercel Serverless Functions로 배포됩니다:

- Production URL: https://flow-sync-dusky.vercel.app
- API: `/api/*` → Vercel Serverless Function

## 프로젝트 구조

```
flow-sync/
├── api/                     # Vercel Serverless Function
│   └── index.ts             # NestJS 앱 핸들러
├── backend/                 # NestJS 백엔드
│   ├── src/
│   │   ├── task/            # Task CRUD 모듈
│   │   ├── project/         # Project 모듈
│   │   ├── workflow-status/ # 워크플로우 상태 모듈
│   │   ├── notion/          # Notion 연동 모듈
│   │   ├── supabase/        # Supabase REST API 클라이언트
│   │   ├── sync/            # 동기화 모듈 (로컬 전용, BullMQ)
│   │   ├── serverless-sync/ # 수동 동기화 모듈 (Vercel 호환)
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── test/                # E2E 테스트
├── frontend/                # React 프론트엔드
│   ├── src/
│   │   ├── components/      # Atomic Design 컴포넌트
│   │   ├── pages/           # Dashboard, TaskBoard, ProjectManagement, Settings, SyncLogs
│   │   ├── hooks/           # React Query 훅 (CRUD 지원)
│   │   └── api/             # API 클라이언트
│   └── public/
├── .claude/
│   └── commands/            # 커스텀 Claude 명령어
├── vercel.json              # Vercel 배포 설정
└── docs/                    # PRD 문서
```

## 아키텍처

```
React UI → NestJS API → Supabase REST API → PostgreSQL (Primary)
                ↓ (로컬 환경만)
          Sync Queue (BullMQ)
                ↓
          Sync Worker → MCP Client → Notion
```

**Vercel 배포 시:**
```
React (Vercel Static) → Serverless Function → Supabase REST API → PostgreSQL
```

- **Source of Truth**: PostgreSQL (Supabase)
- **API 클라이언트**: Native fetch 기반 Supabase REST API
- **동기화 방식**: Queue + Batch 기반 준실시간 동기화 (로컬 전용)
- **수동 동기화**: 양방향 지원 (App → Notion, Notion → App)
- **충돌 해결**: Last Write Wins (updated_at vs last_edited_time 비교)

## API 엔드포인트

### Notion API (`/api/notion`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notion/test` | Notion 연결 테스트 |
| GET | `/api/notion/schema` | 데이터베이스 스키마 조회 |
| GET | `/api/notion/pages` | 전체 페이지 조회 (페이지네이션 지원) |
| GET | `/api/notion/pages/:id` | 특정 페이지 조회 |
| POST | `/api/notion/pages` | 새 페이지 생성 |
| PUT | `/api/notion/pages/:id` | 페이지 업데이트 |

### Sync API (`/api/sync`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sync/manual` | 수동 동기화 실행 (App → Notion) |
| POST | `/api/sync/manual/notion-to-app` | 수동 동기화 실행 (Notion → App) |

**App → Notion 수동 동기화 Request:**
```json
{
  "projectId": "uuid",        // 선택: 특정 프로젝트만 동기화
  "forceFullSync": false      // true: 전체 재동기화
}
```

**App → Notion 수동 동기화 Response:**
```json
{
  "success": true,
  "syncedCount": 5,
  "failedCount": 0,
  "errors": [],
  "duration": 3990
}
```

**Notion → App 수동 동기화 Request:**
```json
{
  "projectId": "uuid"         // 선택: 특정 프로젝트만 동기화
}
```

**Notion → App 수동 동기화 Response:**
```json
{
  "success": true,
  "syncedCount": 6,
  "createdCount": 2,
  "updatedCount": 4,
  "skippedCount": 0,
  "failedCount": 0,
  "errors": [],
  "duration": 2680
}
```

## 스크립트

### Backend

| 명령어 | 설명 |
|--------|------|
| `npm run start:dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run test` | 단위 테스트 |
| `npm run lint` | ESLint 검사 |

### Frontend

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 미리보기 |

## 라이선스

MIT
