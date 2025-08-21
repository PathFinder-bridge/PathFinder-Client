'use client';

import {useState, useEffect, useCallback} from 'react';
import {jobsApi, JobListResponse, JobResponse, JobCategoryResponse} from '@/lib/api/jobs';

export const useJobs = () => {
    const [jobData, setJobData] = useState<JobListResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    // 직무 목록 로드
    const loadJobs = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await jobsApi.getAllJobs();
            setJobData(response.data);
            setLastUpdated(response.timeStamp);

            console.log('직무 데이터 로드 완료:', response.data);
        } catch (err: any) {
            const errorMessage = err.message || '직무 목록을 불러오는데 실패했습니다.';
            setError(errorMessage);
            console.error('직무 데이터 로드 실패:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    // 특정 카테고리의 직무 가져오기
    const getJobsByCategory = useCallback((categoryName: string): JobResponse[] => {
        if (!jobData) return [];

        const category = jobData.categories.find(cat => cat.name === categoryName);
        return category?.jobs || [];
    }, [jobData]);

    // 모든 직무를 평면 배열로 가져오기
    const getAllJobsFlat = useCallback((): JobResponse[] => {
        if (!jobData) return [];

        return jobData.categories.flatMap(category => category.jobs);
    }, [jobData]);

    // 직무 검색
    const searchJobs = useCallback((keyword: string): JobResponse[] => {
        const allJobs = getAllJobsFlat();

        if (!keyword.trim()) {
            return allJobs;
        }

        const searchTerm = keyword.toLowerCase();
        return allJobs.filter(job =>
            job.title.toLowerCase().includes(searchTerm) ||
            job.description.toLowerCase().includes(searchTerm) ||
            job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
        );
    }, [getAllJobsFlat]);

    // 카테고리 목록 가져오기
    const getCategories = useCallback((): JobCategoryResponse[] => {
        return jobData?.categories || [];
    }, [jobData]);

    // 데이터 새로고침
    const refreshJobs = useCallback(() => {
        loadJobs();
    }, [loadJobs]);

    return {
        // 데이터
        jobData,
        categories: getCategories(),
        totalJobs: jobData?.totalJobs || 0,
        lastUpdated,

        // 상태
        isLoading,
        error,

        // 함수들
        loadJobs,
        refreshJobs,
        getJobsByCategory,
        getAllJobsFlat,
        searchJobs, // 클라이언트 사이드 검색 함수

        // 편의 속성들
        hasData: !!jobData,
        isEmpty: jobData?.totalJobs === 0,
    };
};