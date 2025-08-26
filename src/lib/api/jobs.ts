import apiClient from './client';
import { BackendResponse, ApiResult } from './common';

// 직무 관련 타입 정의
export interface JobResponse {
    title: string;
    description: string;
    skills: string[];
    salaryRange: string;
}

export interface JobCategoryResponse {
    name: string;
    jobs: JobResponse[];
}

export interface JobListResponse {
    categories: JobCategoryResponse[];
    totalJobs: number;
    lastUpdated: string;
}

// 직무 API 함수들
export const jobsApi = {
    // 모든 직무 목록 조회
    getAllJobs: async (): Promise<ApiResult<JobListResponse>> => {
        try {
            console.log('직무 목록 조회 요청 시작');
            const response = await apiClient.get<BackendResponse<JobListResponse>>('/api/jobs');

            // 백엔드에서 항상 ResponseDto 구조로 응답하므로 success 필드로 판단
            if (response.data.success) {
                console.log('직무 목록 조회 성공:', response.data.data);
                return {
                    success: true,
                    data: response.data.data
                };
            } else {
                return {
                    success: false,
                    error: response.data.message || '직무 목록 조회에 실패했습니다.',
                    errorCode: response.data.errorCode
                };
            }
        } catch (error: any) {
            console.error('직무 목록 조회 네트워크 오류:', error);

            // 네트워크 오류나 예상치 못한 에러의 경우
            let errorMessage = '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
            if (error.response?.status === 404) {
                errorMessage = '직무 정보를 찾을 수 없습니다.';
            } else if (error.response?.status >= 500) {
                errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            }

            return {
                success: false,
                error: errorMessage,
                status: error.response?.status
            };
        }
    }
};