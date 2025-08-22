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

// 백엔드 응답 구조에 맞춘 타입 정의
export interface BackendResponse<T> {
    timeStamp: string;
    message?: string;
    data: T;
}

// API 함수들
export const authApi = {
    // 이메일 중복 확인
    checkEmailDuplicate: async (email: string): Promise<BackendResponse<boolean>> => {
        try {
            const response = await apiClient.get<BackendResponse<boolean>>(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
            return response.data;
        } catch (error: any) {
            console.error('이메일 중복 확인 오류:', error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('이메일 중복 확인에 실패했습니다.');
            }
        }
    },

    // 이메일 인증 코드 발송
    verifyEmail: async (data: VerifyEmailRequest): Promise<BackendResponse<VerifyEmailResponse>> => {
        try {
            const response = await apiClient.post<BackendResponse<VerifyEmailResponse>>('/api/auth/verify-email', data);
            return response.data;
        } catch (error: any) {
            console.error('이메일 인증 코드 발송 오류:', error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('인증 코드 발송에 실패했습니다.');
            }
        }
    },

    // 인증 코드 검증
    verifyCode: async (data: VerifyCodeRequest): Promise<BackendResponse<VerifyCodeResponse>> => {
        try {
            const response = await apiClient.post<BackendResponse<VerifyCodeResponse>>('/api/auth/verify-code', data);
            return response.data;
        } catch (error: any) {
            console.error('인증 코드 검증 오류:', error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('인증번호 확인에 실패했습니다.');
            }
        }
    },

    // 회원가입
    signUp: async (data: SignUpRequest): Promise<BackendResponse<SignUpResponse>> => {
        try {
            const response = await apiClient.post<BackendResponse<SignUpResponse>>('/api/auth/signup', data);
            return response.data;
        } catch (error: any) {
            console.error('회원가입 오류:', error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('회원가입에 실패했습니다.');
            }
        }
    },

    // 로그인
    login: async (data: LoginRequest): Promise<BackendResponse<LoginResponse>> => {
        try {
            console.log('로그인 요청 데이터:', data);
            const response = await apiClient.post<BackendResponse<LoginResponse>>('/api/auth/login', data);
            console.log('로그인 원본 응답:', response.data);

            const result = response.data;

            // 토큰 자동 저장
            if (result.data && result.data.accessToken && result.data.refreshToken) {
                console.log('토큰 저장:', result.data.accessToken, result.data.refreshToken);
                tokenManager.setTokens(result.data.accessToken, result.data.refreshToken);
            }

            return result;
        } catch (error: any) {
            console.error('로그인 API 에러:', error);
            console.error('에러 상세:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            // 에러를 그대로 throw해서 컴포넌트에서 처리하도록 함
            throw error;
        }
    },

    // 카카오 로그인
    kakaoLogin: async (data: KakaoLoginRequest): Promise<BackendResponse<LoginResponse>> => {
        try {
            const response = await apiClient.post<BackendResponse<LoginResponse>>('/api/auth/kakao/login', data);
            const result = response.data;

            // 토큰 자동 저장
            if (result.data && result.data.accessToken && result.data.refreshToken) {
                tokenManager.setTokens(result.data.accessToken, result.data.refreshToken);
            }

            return result;
        } catch (error: any) {
            console.error('카카오 로그인 오류:', error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('카카오 로그인에 실패했습니다.');
            }
        }
    },

    // 로그아웃
    logout: async (): Promise<BackendResponse<void>> => {
        try {
            const response = await apiClient.post<BackendResponse<void>>('/api/users/logout');
            tokenManager.clearTokens();
            return response.data;
        } catch (error: any) {
            console.error('로그아웃 오류:', error);
            // 로그아웃은 실패해도 토큰 삭제
            tokenManager.clearTokens();
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('로그아웃 요청에 실패했습니다.');
            }
        }
    },

    // 현재 사용자 정보 조회
    getCurrentUser: async (): Promise<BackendResponse<LoginResponse>> => {
        try {
            const response = await apiClient.get<BackendResponse<LoginResponse>>('/api/auth/me');
            return response.data;
        } catch (error: any) {
            console.error('사용자 정보 조회 오류:', error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('사용자 정보를 가져올 수 없습니다.');
            }
        }
    },

    // 토큰 갱신 (백엔드에 refresh 엔드포인트가 있을 때 사용)
    refreshToken: async (): Promise<BackendResponse<{ accessToken: string; refreshToken: string }>> => {
        try {
            const refreshToken = tokenManager.getRefreshToken();
            if (!refreshToken) {
                throw new Error('Refresh token이 없습니다.');
            }

            const response = await apiClient.post<BackendResponse<{
                accessToken: string;
                refreshToken: string
            }>>('/api/auth/refresh', {refreshToken});
            const result = response.data;

            if (result.data) {
                tokenManager.setTokens(result.data.accessToken, result.data.refreshToken);
            }

            return result;
        } catch (error: any) {
            console.error('토큰 갱신 오류:', error);
            tokenManager.clearTokens();
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('토큰 갱신에 실패했습니다.');
            }
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