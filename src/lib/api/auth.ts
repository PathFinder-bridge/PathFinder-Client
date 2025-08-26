import apiClient, {tokenManager} from './client';

// 타입 정의
export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignUpRequest {
    verificationToken: string;
    password: string;
    passwordConfirm: string;
}

export interface VerifyEmailRequest {
    email: string;
}

export interface VerifyCodeRequest {
    email: string;
    code: string;
}

export interface KakaoLoginRequest {
    authorizationCode: string;
}

export interface LoginResponse {
    userId: number;
    email: string;
    nickname: string;
    accessToken: string;
    refreshToken: string;
}

export interface VerifyEmailResponse {
    email: string;
    expiresAt: string;
    message: string;
}

export interface VerifyCodeResponse {
    email: string;
    verified: boolean;
    verificationToken: string;
    tokenExpiresAt: string;
    message: string;
}

export interface SignUpResponse {
    id: number;
    email: string;
    nickname: string;
    createdAt: string;
}

// 백엔드 응답 구조 - 수정된 구조 반영
export interface BackendResponse<T> {
    timeStamp: string;
    success: boolean;        // 추가
    message?: string;
    data?: T;
    errorCode?: string;      // 추가
}

// API 결과 타입
export interface ApiResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    errorCode?: string;
    status?: number;
}

// API 함수들
export const authApi = {
    // 이메일 중복 확인 - 새로운 구조 적용
    checkEmailDuplicate: async (email: string): Promise<ApiResult<boolean>> => {
        const response = await apiClient.get<BackendResponse<boolean>>(`/api/auth/check-email?email=${encodeURIComponent(email)}`);

        if (response.data.success) {
            return {
                success: true,
                data: response.data.data
            };
        } else {
            return {
                success: false,
                error: response.data.message,
                errorCode: response.data.errorCode
            };
        }
    },

    // 이메일 인증 코드 발송 - 새로운 구조 적용
    verifyEmail: async (data: VerifyEmailRequest): Promise<ApiResult<VerifyEmailResponse>> => {
        const response = await apiClient.post<BackendResponse<VerifyEmailResponse>>('/api/auth/verify-email', data);

        if (response.data.success) {
            return {
                success: true,
                data: response.data.data
            };
        } else {
            return {
                success: false,
                error: response.data.message,
                errorCode: response.data.errorCode
            };
        }
    },

    // 인증 코드 검증 - 새로운 구조 적용
    verifyCode: async (data: VerifyCodeRequest): Promise<ApiResult<VerifyCodeResponse>> => {
        const response = await apiClient.post<BackendResponse<VerifyCodeResponse>>('/api/auth/verify-code', data);

        if (response.data.success) {
            return {
                success: true,
                data: response.data.data
            };
        } else {
            return {
                success: false,
                error: response.data.message,
                errorCode: response.data.errorCode
            };
        }
    },

    // 회원가입
    signUp: async (data: SignUpRequest): Promise<ApiResult<SignUpResponse>> => {
        try {
            const response = await apiClient.post<BackendResponse<SignUpResponse>>('/api/auth/signup', data);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('회원가입 오류:', error);
            return {
                success: false,
                error: error.response?.data?.message || '회원가입에 실패했습니다.',
                status: error.response?.status
            };
        }
    },

    // 로그인 - 새로운 구조 적용
    login: async (data: LoginRequest): Promise<ApiResult<LoginResponse>> => {
        const response = await apiClient.post<BackendResponse<LoginResponse>>('/api/auth/login', data);

        if (response.data.success) {
            // 성공 시 토큰 자동 저장
            if (response.data.data && response.data.data.accessToken && response.data.data.refreshToken) {
                tokenManager.setTokens(response.data.data.accessToken, response.data.data.refreshToken);
            }

            return {
                success: true,
                data: response.data.data
            };
        } else {
            return {
                success: false,
                error: response.data.message,
                errorCode: response.data.errorCode
            };
        }
    },

    // 카카오 로그인
    kakaoLogin: async (data: KakaoLoginRequest): Promise<ApiResult<LoginResponse>> => {
        try {
            const response = await apiClient.post<BackendResponse<LoginResponse>>('/api/auth/kakao/login', data);
            const result = response.data;

            // 토큰 자동 저장
            if (result.data && result.data.accessToken && result.data.refreshToken) {
                tokenManager.setTokens(result.data.accessToken, result.data.refreshToken);
            }

            return {
                success: true,
                data: result.data
            };
        } catch (error: any) {
            console.error('카카오 로그인 오류:', error);
            return {
                success: false,
                error: error.response?.data?.message || '카카오 로그인에 실패했습니다.',
                status: error.response?.status
            };
        }
    },

    // 로그아웃
    logout: async (): Promise<ApiResult<void>> => {
        try {
            const response = await apiClient.post<BackendResponse<void>>('/api/users/logout');
            tokenManager.clearTokens();
            return {
                success: true
            };
        } catch (error: any) {
            console.error('로그아웃 오류:', error);
            // 로그아웃은 실패해도 토큰 삭제
            tokenManager.clearTokens();
            return {
                success: false,
                error: error.response?.data?.message || '로그아웃 요청에 실패했습니다.',
                status: error.response?.status
            };
        }
    },

    // 현재 사용자 정보 조회
    getCurrentUser: async (): Promise<ApiResult<LoginResponse>> => {
        try {
            const response = await apiClient.get<BackendResponse<LoginResponse>>('/api/auth/me');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('사용자 정보 조회 오류:', error);
            return {
                success: false,
                error: error.response?.data?.message || '사용자 정보를 가져올 수 없습니다.',
                status: error.response?.status
            };
        }
    },

    // 토큰 갱신
    refreshToken: async (): Promise<ApiResult<{ accessToken: string; refreshToken: string }>> => {
        try {
            const refreshToken = tokenManager.getRefreshToken();
            if (!refreshToken) {
                return {
                    success: false,
                    error: 'Refresh token이 없습니다.'
                };
            }

            const response = await apiClient.post<BackendResponse<{
                accessToken: string;
                refreshToken: string
            }>>('/api/auth/refresh', {refreshToken});
            const result = response.data;

            if (result.data) {
                tokenManager.setTokens(result.data.accessToken, result.data.refreshToken);
            }

            return {
                success: true,
                data: result.data
            };
        } catch (error: any) {
            console.error('토큰 갱신 오류:', error);
            tokenManager.clearTokens();
            return {
                success: false,
                error: error.response?.data?.message || '토큰 갱신에 실패했습니다.',
                status: error.response?.status
            };
        }
    },
};

// 카카오 OAuth URL 생성
export const getKakaoAuthUrl = (): string => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        throw new Error('카카오 OAuth 설정이 누락되었습니다.');
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'profile_nickname,account_email'
    });

    return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
};

// tokenManager를 다른 곳에서도 사용할 수 있도록 export
export {tokenManager};