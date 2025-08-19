import axios from 'axios';

// API 클라이언트 생성
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ML API 클라이언트 (나중에 사용할 용도)
export const mlClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8080',
    timeout: 30000,
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

// 응답 인터셉터 - 401 에러 시 토큰 갱신 시도
apiClient.interceptors.response.use(
    (response) => response,    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = tokenManager.getRefreshToken();
                if (refreshToken) {
                    // 토큰 갱신 시도 (백엔드에 refresh 엔드포인트가 있을 때)
                    // const response = await axios.post('/api/auth/refresh', { refreshToken });
                    // const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                    // tokenManager.setTokens(accessToken, newRefreshToken);
                    // originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    // return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error('토큰 갱신 실패:', refreshError);
            }

            // 토큰 갱신 실패 시 로그아웃 처리
            tokenManager.clearTokens();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;