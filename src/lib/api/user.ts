import apiClient from './client';

// 타입 정의
export interface ProfileStatusResponse {
    isBasicComplete: boolean;
    missingBasicFields: string[];
    canUseRecommendation: boolean;
    message: string;
}

export interface UserProfileResponse {
    id: number;
    email: string;
    nickname: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
    birthYear: number | null;
    major: string | null;
    provider: 'LOCAL' | 'KAKAO';
    hasPassword: boolean;
    isBasicComplete: boolean;
}

export interface UpdateProfileRequest {
    nickname: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    birthYear: number;
    major: string;
}

export interface ChangePasswordRequest {
    newPassword: string;
    confirmPassword: string;
}

// 백엔드 응답 구조에 맞춘 타입 정의
export interface BackendResponse<T> {
    timestamp: string;
    message?: string;
    data: T;
}

// API 결과 타입
export interface ApiResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    status?: number;
}

// API 함수들
export const userApi = {
    // 프로필 완성도 확인
    getProfileStatus: async (): Promise<ApiResult<ProfileStatusResponse>> => {
        try {
            const response = await apiClient.get<BackendResponse<ProfileStatusResponse>>('/api/users/profile-status');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('프로필 상태 확인 오류:', error);
            return {
                success: false,
                error: error.response?.data?.message || '프로필 상태를 확인할 수 없습니다.',
                status: error.response?.status
            };
        }
    },

    // 마이페이지 조회
    getUserProfile: async (): Promise<ApiResult<UserProfileResponse>> => {
        try {
            const response = await apiClient.get<BackendResponse<UserProfileResponse>>('/api/users/profile');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('프로필 조회 오류:', error);
            return {
                success: false,
                error: error.response?.data?.message || '프로필 정보를 불러올 수 없습니다.',
                status: error.response?.status
            };
        }
    },

    // 프로필 업데이트
    updateProfile: async (data: UpdateProfileRequest): Promise<ApiResult<UserProfileResponse>> => {
        try {
            const response = await apiClient.put<BackendResponse<UserProfileResponse>>('/api/users/profile', data);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('프로필 업데이트 오류:', error);
            return {
                success: false,
                error: error.response?.data?.message || '프로필 업데이트에 실패했습니다.',
                status: error.response?.status
            };
        }
    },

    // 비밀번호 변경
    changePassword: async (data: ChangePasswordRequest): Promise<ApiResult<void>> => {
        try {
            const response = await apiClient.put<BackendResponse<void>>('/api/users/password', data);
            return {
                success: true
            };
        } catch (error: any) {
            console.error('비밀번호 변경 오류:', error);
            return {
                success: false,
                error: error.response?.data?.message || '비밀번호 변경에 실패했습니다.',
                status: error.response?.status
            };
        }
    },

    // 닉네임 중복 확인
    checkNickname: async (nickname: string): Promise<ApiResult<boolean>> => {
        try {
            const response = await apiClient.get<BackendResponse<boolean>>(`/api/users/check-nickname?nickname=${encodeURIComponent(nickname)}`);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('닉네임 중복 확인 오류:', error);
            return {
                success: false,
                error: error.response?.data?.message || '닉네임 중복 확인에 실패했습니다.',
                status: error.response?.status
            };
        }
    }
};