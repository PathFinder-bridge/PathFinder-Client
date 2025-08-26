import axios from 'axios';

// API 클라이언트 생성
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 토큰 관리 유틸리티 (SSR 안전)
export const tokenManager = {
    setTokens: (accessToken: string, refreshToken: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        }
    },

    getAccessToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('accessToken');
    },

    getRefreshToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('refreshToken');
    },

    clearTokens: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    },

    isLoggedIn: (): boolean => {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('accessToken');
    }
};

// 요청 인터셉터
apiClient.interceptors.request.use(
    (config) => {
        const token = tokenManager.getAccessToken();
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`
            };
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 로그인/회원가입/토큰 관련 요청이면 에러를 그대로 전달 (무한루프 방지)
        if (originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/signup') ||
            originalRequest.url?.includes('/auth/verify-email') ||
            originalRequest.url?.includes('/auth/verify-code') ||
            originalRequest.url?.includes('/auth/check-email') ||
            originalRequest.url?.includes('/auth/kakao/login') ||
            originalRequest.url?.includes('/auth/refresh')) {
            console.log('인증 관련 요청 에러 - 자동 갱신 건너뛰기');
            return Promise.reject(error);
        }

        // 401 Unauthorized 에러이고 아직 재시도하지 않은 경우 토큰 갱신 시도
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = tokenManager.getRefreshToken();
            if (!refreshToken) {
                console.log('Refresh token 없음 - 로그인 페이지로 이동');
                tokenManager.clearTokens();
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            try {
                console.log('토큰 갱신 시도');
                // 토큰 갱신 API 직접 호출
                const refreshResponse = await axios.post<{
                    success: boolean;
                    data?: {
                        accessToken: string;
                        refreshToken: string;
                        accessTokenExpiresIn: number;
                        refreshTokenExpiresIn: number;
                    };
                    message?: string;
                    errorCode?: string;
                }>(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/auth/refresh`,
                    {refreshToken},
                    {headers: {'Content-Type': 'application/json'}}
                );

                // 백엔드에서 항상 ResponseDto 구조로 응답하므로 success 필드 확인
                if (refreshResponse.data.success && refreshResponse.data.data) {
                    const {accessToken, refreshToken: newRefreshToken} = refreshResponse.data.data;
                    console.log('토큰 갱신 성공');

                    tokenManager.setTokens(accessToken, newRefreshToken);

                    // 원래 요청에 새 토큰 설정하고 재시도
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                } else {
                    // 백엔드에서 success: false로 응답한 경우
                    console.log('토큰 갱신 실패 - 백엔드 응답:', refreshResponse.data.message);
                    throw new Error(refreshResponse.data.message || '토큰 갱신에 실패했습니다.');
                }
            } catch (refreshError: any) {
                console.error('토큰 갱신 중 오류:', refreshError);

                // 토큰 갱신 실패 시 로그아웃 처리
                tokenManager.clearTokens();
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    console.log('토큰 갱신 실패 - 로그인 페이지로 리다이렉트');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        }

        // 다른 HTTP 에러들 처리
        if (error.response?.status >= 500) {
            console.error('서버 에러:', error.response.status, error.response.data);
        } else if (error.response?.status === 404) {
            console.error('API 엔드포인트를 찾을 수 없음:', originalRequest.url);
        }

        return Promise.reject(error);
    }
);

export default apiClient;