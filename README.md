# FlowSync

MCP 기반 노션 연동형 프로젝트 워크플로우 관리 시스템

## 주요 기능

- **멀티 뷰 지원**: Kanban Board, Calendar, List View
- **Notion 양방향 동기화**: MCP(Model Context Protocol) 기반 자동 동기화
- **워크플로우 커스터마이징**: 프로젝트별 상태 단계 설정
- **문서 자동 생성**: 업무 완료 시 Notion 보고서 템플릿 자동 생성

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React, Vite, TanStack Query, Tailwind CSS |
| Backend | NestJS, Prisma |
| Database | PostgreSQL (Supabase) |
| Queue | Redis, BullMQ |
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
DATABASE_URL="postgresql://..."      # Supabase connection pooler URL
DIRECT_URL="postgresql://..."        # Direct connection for migrations
```

### 데이터베이스 설정

```bash
cd backend
npx prisma generate    # Prisma Client 생성
npx prisma migrate dev # 마이그레이션 실행
```

### 실행

```bash
# 백엔드 (포트 4000)
cd backend
npm run start:dev

# 프론트엔드 (포트 3000)
cd frontend
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 프로젝트 구조

```
flow-sync/
├── backend/                 # NestJS 백엔드
│   ├── src/                 # 소스 코드
│   ├── prisma/              # Prisma 스키마 및 마이그레이션
│   └── test/                # E2E 테스트
├── frontend/                # React 프론트엔드
│   ├── src/                 # 소스 코드
│   └── public/              # 정적 파일
└── docs/                    # PRD 문서
```

## 아키텍처

```
React UI → NestJS API → PostgreSQL (Primary)
                ↓
          Sync Queue (BullMQ)
                ↓
          Sync Worker → MCP Client → Notion
```

- **Source of Truth**: PostgreSQL
- **동기화 방식**: Queue + Batch 기반 준실시간 동기화
- **충돌 해결**: Last Write Wins (updated_at 기준)

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
# flow-sync
