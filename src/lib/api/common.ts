// 백엔드 공통 응답 구조
export interface BackendResponse<T> {
    timeStamp: string;
    success: boolean;
    message?: string;
    data?: T;
    errorCode?: string;
}

// API 결과 공통 타입
export interface ApiResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    errorCode?: string;
    status?: number;
}

// 공통 에러 처리 유틸리티
export const handleApiError = (error: any, defaultMessage: string): ApiResult<any> => {
    // 백엔드 응답 구조에 맞춘 에러 처리
    if (error.response?.data?.success === false) {
        return {
            success: false,
            error: error.response.data.message || defaultMessage,
            errorCode: error.response.data.errorCode,
            status: error.response?.status
        };
    }

    // 일반적인 에러 처리
    return {
        success: false,
        error: error.response?.data?.message || defaultMessage,
        status: error.response?.status
    };
};