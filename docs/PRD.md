# FlowSync PRD (Product Requirements Document)

> MCP 기반 노션 연동형 프로젝트 워크플로우 관리 시스템

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 서비스명 | FlowSync (with Notion MCP Bridge) |
| 핵심 가치 | Cloud DB의 안정성 + Notion 협업 생태계 + MCP 기반 자동화 |
| 주요 타겟 | 자체 데이터 관리와 Notion 협업을 동시에 원하는 팀/개인 |

### 핵심 컨셉

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Cloud DB       │ ←→  │  FlowSync App   │ ←→  │  Notion         │
│  (PostgreSQL)   │     │  (React/NestJS) │     │  (Workspace)    │
│  Source of Truth│     │  MCP Bridge     │     │  Collaboration  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 2. 주요 기능

### 2.1 프로젝트 워크플로우 관리

| 기능 | 설명 |
|------|------|
| **멀티 뷰 지원** | 동일 데이터를 Kanban, Calendar, List 뷰로 전환 |
| **Kanban Board** | 드래그 앤 드롭으로 상태 변경 |
| **Calendar** | FullCalendar 기반 일정 시각화 |
| **List View** | 필터링 및 정렬 가능한 테이블 |

### 2.2 워크플로우 커스터마이징

- 프로젝트별 상태(Status) 단계 직접 설정
- 예: `기획 → 디자인 → 개발 → QA → 완료`

### 2.3 Notion 연동

| 기능 | 설명 |
|------|------|
| **양방향 동기화** | App ↔ Notion 데이터 자동 동기화 |
| **속성 매핑** | Multi Select, Date, People, Relation, Status 1:1 매핑 |
| **문서 자동 생성** | 업무 완료 시 보고서 템플릿 자동 생성 |

### 2.4 협업 기능

- 실시간 상태 업데이트
- 업무별 댓글/히스토리 관리
- 담당자 지정 및 편집 (Notion 동기화 지원)
- 태그 관리

---

## 3. 시스템 아키텍처

```
React UI
    ↓
NestJS API (Port 4000)
    ↓
Cloud PostgreSQL (Supabase) ← Primary Source of Truth
    ↓
Redis Queue (BullMQ)
    ↓
Sync Worker
    ↓
MCP Client
    ↓
Notion MCP Server
    ↓
Notion API
```

### Source of Truth 정책

| 계층 | 역할 |
|------|------|
| **Primary** | Cloud PostgreSQL - 핵심 업무 데이터 관리 |
| **Secondary** | Notion Workspace - 협업 및 문서화 레이어 |

**PostgreSQL을 Primary로 선택한 이유:**
- Notion의 관계형 처리 제한
- Transaction 부재
- 대규모 Query 제약
- Rate Limit 존재

---

## 4. 동기화 전략

### 4.1 App → Notion (Queue 기반)

```
사용자 액션 → DB 저장 → Sync Queue 등록 → Worker → Notion 반영
```

**특징:**
- 거의 실시간 처리 가능
- API Rate Limit 대응
- Retry 처리 가능

### 4.2 Notion → App (Polling 기반)

```
Scheduler (1~5분 주기) → Notion 조회 → updated_time 비교 → 변경분 DB 반영
```

**특징:**
- 안정적 운영
- 충돌 감소
- 실시간 이벤트 의존성 제거

### 4.3 충돌 해결 (Conflict Resolution)

- **정책:** Last Write Wins
- **기준:** `updated_at` 타임스탬프

### 4.4 실패 처리

- 자동 재시도 (Retry)
- Dead Letter Queue로 실패 작업 별도 저장
- Sync Log 기록 (sync_status, error_message, retry_count)

---

## 5. 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React, Vite, TanStack Query, Tailwind CSS |
| UI Components | dnd-kit (Drag & Drop), FullCalendar |
| Backend | NestJS, Node.js |
| Database | PostgreSQL (Supabase) |
| Database Client | Supabase REST API (native fetch) |
| Queue | Redis, BullMQ |
| Protocol | MCP (Model Context Protocol) |
| Integration | Notion MCP Server |

---

## 6. 데이터베이스 설계

### 테이블 구조

| 테이블 | 설명 | 주요 필드 |
|--------|------|-----------|
| **profiles** | 사용자 프로필 | id, full_name, notion_user_id, avatar_url |
| **project** | 프로젝트 | id, title, notion_db_id, description |
| **task** | 업무/태스크 | id, title, status_id, notion_page_id, assignees, tags |
| **workflow_status** | 워크플로우 상태 | id, project_id, name, sort_order, notion_option_id, color |
| **sync_log** | 동기화 이력 | id, task_id, direction, sync_status, retry_count |

### Notion 연동 필드

- `project.notion_db_id` - Notion Database ID
- `task.notion_page_id` - Notion Page ID
- `workflow_status.notion_option_id` - Notion Status Option ID
- `profiles.notion_user_id` - Notion User ID

---

## 7. 개발 로드맵

### 1단계: 기반 구축
- [x] Cloud DB 환경 구성 (Supabase)
- [x] React/NestJS 기본 구조 생성
- [x] DB 스키마 설계 (Prisma)
- [x] Notion MCP Server 연결

### 2단계: 핵심 기능
- [x] Queue 및 Worker 구축 (BullMQ + Upstash Redis)
- [x] App → Notion 단방향 Sync 구현
- [x] 기본 CRUD API 완성 (Task, Project, WorkflowStatus)
- [x] Notion 속성 매핑 (Task Name, Status, Priority, Tags, Description)

### 3단계: UI 개발
- [x] Kanban Board (dnd-kit 드래그 앤 드롭)
- [x] FullCalendar 연동
- [x] List View (정렬, 필터링)
- [x] Task 생성/수정 Modal
- [x] Atomic Design 컴포넌트 구조
- [x] Dashboard 페이지 (프로젝트별 작업 현황)
- [x] Project Management 페이지 (CRUD + 워크플로우 상태 관리)
- [x] Settings 페이지 (수동 동기화 UI)
- [x] SyncLogs 페이지 (동기화 이력 조회)
- [x] Workflow Status 색상 선택 기능 (8색 팔레트)

### 4단계: 동기화 고도화
- [ ] Notion → App Polling Scheduler
- [ ] Conflict Resolution 강화
- [x] Retry & Dead Letter Queue
- [x] Settings 수동 동기화 API 연동 (ServerlessSyncModule)
- [x] 수동 동기화 성능 최적화 (토큰 버킷 Rate Limit, 배치 병렬 처리)
- [x] 담당자(Assignee) 편집 기능 및 Notion 동기화
- [ ] SyncLogs 백엔드 API 연동

### Vercel 배포
- [x] Vercel Serverless Functions 설정
- [x] API rewrites 구성
- [x] SyncModule 조건부 빌드 (Vercel 서버리스 호환)
- [x] Supabase REST API 전환 (Prisma 제거)
- [x] BullModule/SyncModule 동적 import (Vercel 빌드 호환)
- [x] UTF-8 인코딩 명시적 설정

### 5단계: 문서 자동화
- [ ] 업무 완료 시 보고서 자동 생성
- [ ] MCP 기반 콘텐츠 생성

### 6단계: 운영 기능
- [ ] Activity Log
- [ ] Audit History
- [ ] 모니터링 대시보드

---

## 8. MVP 범위

### 1차 MVP

- Cloud DB 구축
- Notion 단방향 연동 (App → Notion)
- Workflow UI (Kanban, Calendar)
- Queue 기반 Sync
- 기본 문서 자동 생성

### 2차 고도화

- 양방향 Sync 안정화
- Conflict Resolution 강화
- Activity Log / Audit History
- 부분 실시간 업데이트 (Supabase Realtime)
- 헤더 톱니바퀴 버튼 → 설정 화면 이동 및 설정 화면 구현
- /board 화면 톱니바퀴 → 프로젝트 설정 기능 구현 (프로젝트명 변경, Workflow Status 관리, Notion 동기화 설정)

---

## 버전 히스토리

| 버전 | 주요 변경 |
|------|-----------|
| v1.0 | 기본 워크플로우 관리 (MariaDB + Express) |
| v2.0 | MCP 기반 Notion 연동 추가, 실시간 양방향 동기화 |
| v3.0 | Cloud PostgreSQL 전환, Queue 기반 준실시간 동기화, Supabase 도입 |
| v3.1 | BullMQ Queue/Worker 구현, App→Notion 단방향 Sync 완성, DLQ 구현 |
| v3.2 | Kanban/Calendar/List UI 완성, Atomic Design 적용, Task CRUD 완성 |
| v3.3 | Vercel 배포 지원, SyncModule 조건부 빌드, API rewrites 구성 |
| v3.4 | Prisma → Supabase REST API 전환, Vercel Serverless Functions 적용 |
| v3.5 | Project Management 페이지, Workflow Status CRUD 및 색상 선택, Settings/SyncLogs 페이지 |
| v3.6 | SyncModule 동적 로딩, Sync 서비스 Supabase 마이그레이션, ListView 인라인 날짜 편집 |
| v3.7 | ServerlessSyncModule 추가, 수동 동기화 성능 최적화, 담당자 편집 기능 |
