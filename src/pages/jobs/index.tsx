'use client';

import React, {useState, useMemo} from 'react';
import {Layout} from '@/layout/Layout';
import {useJobs} from '@/hooks/useJobs';
import {JobCard} from '@/components/Jobs/JobCard';
import {FormInput} from '@/components/common/FormInput';
import {Button} from '@/components/common/Button';
import {Alert, useAlert} from '@/components/common/Alert';
import {JobResponse} from '@/lib/api/jobs';

export default function JobListPage() {
    const {
        categories,
        totalJobs,
        isLoading,
        error,
        refreshJobs,
        searchJobs
    } = useJobs();

    const {alerts, removeAlert} = useAlert();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // 필터링된 직무 목록
    const filteredJobs = useMemo(() => {
        let jobs: JobResponse[] = [];

        if (selectedCategory === 'all') {
            // 모든 카테고리의 직무
            jobs = categories.flatMap(category => category.jobs);
        } else {
            // 특정 카테고리의 직무
            const category = categories.find(cat => cat.name === selectedCategory);
            jobs = category?.jobs || [];
        }

        // 검색어로 필터링
        if (searchKeyword.trim()) {
            jobs = searchJobs(searchKeyword);
        }

        return jobs;
    }, [categories, selectedCategory, searchKeyword, searchJobs]);

    // 로딩 상태
    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#103D5E] mx-auto mb-4"></div>
                        <p className="text-gray-600">직무 정보를 불러오고 있습니다...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="mb-4">
                            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">직무 정보를 불러올 수 없습니다</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button onClick={refreshJobs}>
                            다시 시도
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* 페이지 헤더 */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">IT 직무 탐색</h1>
                        <p className="text-gray-600">
                            다양한 IT 직무를 탐색하고 자신에게 맞는 커리어 경로를 찾아보세요.
                            총 <span className="font-semibold text-[#103D5E]">{totalJobs}개</span>의 직무 정보를 제공합니다.
                        </p>
                    </div>

                    {/* 알림 표시 */}
                    {alerts.map(alert => (
                        <Alert
                            key={alert.id}
                            type={alert.type}
                            message={alert.message}
                            onClose={() => removeAlert(alert.id)}
                        />
                    ))}

                    {/* 검색 및 필터 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 검색창 */}
                            <FormInput
                                type="text"
                                placeholder="직무명, 설명, 기술 스택으로 검색..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full"
                            />

                            {/* 카테고리 필터 */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">모든 분야</option>
                                {categories.map((category) => (
                                    <option key={category.name} value={category.name}>
                                        {category.name} ({category.jobs.length}개)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 검색 결과 정보 */}
                        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                            <span>
                                {searchKeyword || selectedCategory !== 'all'
                                    ? `${filteredJobs.length}개의 직무를 찾았습니다`
                                    : `총 ${totalJobs}개의 직무`
                                }
                            </span>
                            {(searchKeyword || selectedCategory !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchKeyword('');
                                        setSelectedCategory('all');
                                    }}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    필터 초기화
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 직무 목록 */}
                    {selectedCategory === 'all' ? (
                        // 전체 선택 시: 카테고리별 섹션으로 표시
                        <div className="space-y-12">
                            {categories
                                .filter(category => {
                                    // 검색어가 있으면 해당 카테고리에 검색 결과가 있는 경우만 표시
                                    if (!searchKeyword.trim()) return true;

                                    const categoryJobs = searchJobs(searchKeyword).filter(job =>
                                        category.jobs.some(catJob => catJob.title === job.title)
                                    );
                                    return categoryJobs.length > 0;
                                })
                                .map((category) => {
                                    const categoryJobs = searchKeyword.trim()
                                        ? searchJobs(searchKeyword).filter(job =>
                                            category.jobs.some(catJob => catJob.title === job.title)
                                        )
                                        : category.jobs;

                                    return (
                                        <div key={category.name}>
                                            {/* 카테고리 섹션 헤더 */}
                                            <div className="mb-6 pt-8">
                                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                                    {category.name}
                                                </h2>
                                                <div
                                                    className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                                            </div>

                                            {/* 해당 카테고리의 직무 카드들 */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                                {categoryJobs.map((job, index) => (
                                                    <JobCard
                                                        key={`${category.name}-${job.title}-${index}`}
                                                        job={job}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        // 특정 카테고리 선택 시: 선택된 카테고리 헤더와 함께 표시
                        <div>
                            {/* 선택된 카테고리 헤더 */}
                            <div className="mb-6 pt-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {selectedCategory}
                                </h2>
                                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                            </div>

                            {/* 직무 카드들 */}
                            {filteredJobs.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredJobs.map((job, index) => (
                                        <JobCard
                                            key={`${job.title}-${index}`}
                                            job={job}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none"
                                         stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                                    <p className="text-gray-500">다른 검색어나 카테고리를 시도해보세요.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}