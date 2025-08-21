import apiClient from './client';

// 백엔드 응답 구조에 맞춘 타입 정의
export interface BackendResponse<T> {
    timeStamp: string;
    message?: string;
    data: T;
}

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
    // 모든 직무 목록 조회 (유일한 백엔드 API)
    getAllJobs: async (): Promise<BackendResponse<JobListResponse>> => {
        try {
            console.log('직무 목록 조회 요청 시작');
            const response = await apiClient.get<BackendResponse<JobListResponse>>('/api/jobs');
            console.log('직무 목록 조회 성공:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('직무 목록 조회 오류:', error);

            // 에러 응답에서 메시지 추출
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else if (error.response?.status === 404) {
                throw new Error('직무 정보를 찾을 수 없습니다.');
            } else if (error.response?.status >= 500) {
                throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            } else {
                throw new Error('직무 목록을 불러오는데 실패했습니다.');
            }
        }
    }
};