import apiClient, {tokenManager} from './client';
import { BackendResponse, ApiResult } from './common';

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

// API 함수들
export const authApi = {
    // 이메일 중복 확인
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

    // 이메일 인증 코드 발송
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

    // 인증 코드 검증
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

            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                };
            } else {
                return {
                    success: false,
                    error: response.data.message || '회원가입에 실패했습니다.',
                    errorCode: response.data.errorCode
                };
            }
        } catch (error: any) {
            console.error('회원가입 오류:', error);

            // 백엔드 응답 구조에 맞춘 에러 처리
            if (error.response?.data?.success === false) {
                return {
                    success: false,
                    error: error.response.data.message || '회원가입에 실패했습니다.',
                    errorCode: error.response.data.errorCode,
                    status: error.response?.status
                };
            }

            return {
                success: false,
                error: error.response?.data?.message || '회원가입에 실패했습니다.',
                status: error.response?.status
            };
        }
    },

    // 로그인
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

            if (response.data.success) {
                // 토큰 자동 저장
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
                    error: response.data.message || '카카오 로그인에 실패했습니다.',
                    errorCode: response.data.errorCode
                };
            }
        } catch (error: any) {
            console.error('카카오 로그인 오류:', error);

            // 백엔드 응답 구조에 맞춘 에러 처리
            if (error.response?.data?.success === false) {
                return {
                    success: false,
                    error: error.response.data.message || '카카오 로그인에 실패했습니다.',
                    errorCode: error.response.data.errorCode,
                    status: error.response?.status
                };
            }

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

            if (response.data.success) {
                return {
                    success: true
                };
            } else {
                return {
                    success: false,
                    error: response.data.message || '로그아웃 요청에 실패했습니다.',
                    errorCode: response.data.errorCode
                };
            }
        } catch (error: any) {
            console.error('로그아웃 오류:', error);
            // 로그아웃은 실패해도 토큰 삭제
            tokenManager.clearTokens();

            // 백엔드 응답 구조에 맞춘 에러 처리
            if (error.response?.data?.success === false) {
                return {
                    success: false,
                    error: error.response.data.message || '로그아웃 요청에 실패했습니다.',
                    errorCode: error.response.data.errorCode,
                    status: error.response?.status
                };
            }

            return {
                success: false,
                error: error.response?.data?.message || '로그아웃 요청에 실패했습니다.',
                status: error.response?.status
            };
        }
    },

    // 토큰 갱신
    refreshToken: async (): Promise<ApiResult<{ accessToken: string; refreshToken: string; accessTokenExpiresIn: number; refreshTokenExpiresIn: number }>> => {
        const currentRefreshToken = tokenManager.getRefreshToken();
        if (!currentRefreshToken) {
            return {
                success: false,
                error: 'Refresh token이 없습니다.'
            };
        }

        const response = await apiClient.post<BackendResponse<{
            accessToken: string;
            refreshToken: string;
            accessTokenExpiresIn: number;
            refreshTokenExpiresIn: number;
        }>>('/api/auth/refresh', { refreshToken: currentRefreshToken });

        if (response.data.success && response.data.data) {
            tokenManager.setTokens(response.data.data.accessToken, response.data.data.refreshToken);
            return {
                success: true,
                data: response.data.data
            };
        } else {
            tokenManager.clearTokens();
            return {
                success: false,
                error: response.data.message || '토큰 갱신에 실패했습니다.',
                errorCode: response.data.errorCode
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