/**
 * API Client Configuration
 * Axios instance with interceptors for FlowSync backend
 */

import axios, { AxiosError } from 'axios';

const API_BASE_URL = '/api';

/**
 * 사용자 친화적 에러 객체
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

/**
 * 에러 메시지 매핑
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: '잘못된 요청입니다. 입력값을 확인해주세요.',
  401: '인증이 필요합니다. 다시 로그인해주세요.',
  403: '이 작업을 수행할 권한이 없습니다.',
  404: '요청한 리소스를 찾을 수 없습니다.',
  409: '요청이 현재 리소스 상태와 충돌합니다.',
  422: '입력값을 처리할 수 없습니다. 형식을 확인해주세요.',
  429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  502: '서버와 통신 중 오류가 발생했습니다.',
  503: '서비스를 일시적으로 사용할 수 없습니다.',
  504: '서버 응답 시간이 초과되었습니다.',
};

/**
 * 에러 응답에서 메시지 추출
 */
function extractErrorMessage(error: AxiosError): string {
  const status = error.response?.status ?? 0;
  const responseData = error.response?.data as Record<string, unknown> | undefined;

  // 서버에서 제공하는 에러 메시지 우선 사용
  if (responseData?.message) {
    if (typeof responseData.message === 'string') {
      return responseData.message;
    }
    if (Array.isArray(responseData.message)) {
      return responseData.message.join(', ');
    }
  }

  // 상태 코드에 따른 기본 메시지
  if (ERROR_MESSAGES[status]) {
    return ERROR_MESSAGES[status];
  }

  // 네트워크 오류
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return '요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.';
    }
    return '네트워크 연결을 확인해주세요.';
  }

  return '알 수 없는 오류가 발생했습니다.';
}

/**
 * Axios 에러를 ApiError로 변환
 */
function createApiError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 0;
  const responseData = error.response?.data as Record<string, unknown> | undefined;

  return {
    message: extractErrorMessage(error),
    status,
    code: responseData?.code as string | undefined,
    details: responseData?.details,
  };
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 디버그 로깅 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    // 사용자 친화적 에러 객체 생성
    const apiError = createApiError(error);

    // 에러 객체에 ApiError 정보 첨부
    const enhancedError = error as AxiosError & { apiError: ApiError };
    enhancedError.apiError = apiError;

    return Promise.reject(enhancedError);
  }
);

export default apiClient;
