import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

/**
 * React Query 캐시 설정 상수
 * 캐시 전략 및 재시도 정책을 중앙 관리
 */
const QUERY_CONFIG = {
  /** 데이터가 stale 상태로 전환되기까지의 시간 (ms) */
  STALE_TIME: 1000 * 60, // 1분

  /** 캐시에서 데이터가 제거되기까지의 시간 (ms) */
  GC_TIME: 1000 * 60 * 5, // 5분

  /** 쿼리 실패 시 재시도 횟수 */
  RETRY_COUNT: 1,

  /** 재시도 간격 (ms) - 지수 백오프 적용 시 기본값 */
  RETRY_DELAY: 1000,

  /** 백그라운드에서 데이터 자동 갱신 간격 (ms) - 0이면 비활성화 */
  REFETCH_INTERVAL: 0,

  /** 윈도우 포커스 시 자동 갱신 여부 */
  REFETCH_ON_WINDOW_FOCUS: true,
} as const

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.STALE_TIME,
      gcTime: QUERY_CONFIG.GC_TIME,
      retry: QUERY_CONFIG.RETRY_COUNT,
      refetchOnWindowFocus: QUERY_CONFIG.REFETCH_ON_WINDOW_FOCUS,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
