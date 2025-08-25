'use client';

import React, { useMemo } from 'react';
import { Layout } from '@/layout/Layout';
import { useRouter, useSearchParams } from 'next/navigation';
import { JobRecommendationEngine } from '@/lib/jobRecommendation';
import { RecommendedJob } from '@/lib/types';

export default function FinalResultsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const recommendedJobs: RecommendedJob[] = useMemo(() => {
        const surveyAnswersParam = searchParams.get('answers');
        const selectedSkillsParam = searchParams.get('skills');

        const { surveyAnswers, selectedSkills } = JobRecommendationEngine.parseUrlParams(
            surveyAnswersParam,
            selectedSkillsParam
        );

        if (!surveyAnswers || !selectedSkills) {
            return [];
        }

        return JobRecommendationEngine.calculateRecommendations(surveyAnswers, selectedSkills);
    }, [searchParams]);

    const handleGoToRoadmap = () => {
        if (recommendedJobs.length === 0) return;
        const jobsQueryParam = encodeURIComponent(JSON.stringify(recommendedJobs));
        router.push(`/roadmaps?jobs=${jobsQueryParam}`);
    };

    if (recommendedJobs.length === 0) {
        return (
            <Layout>
                <div className="bg-white min-h-screen py-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600">추천 직무를 계산 중입니다...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-white min-h-screen py-20">
                <div className="w-full max-w-5xl mx-auto px-4 text-center">
                    <header className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-800">당신에게 추천하는 직무</h1>
                        <p className="mt-4 text-lg text-gray-600">추가적으로 궁금한 직무가 있다면 카드를 클릭해보세요.</p>
                    </header>

                    <main className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {recommendedJobs.map((job, index) => (
                            <JobCard key={job.id} job={job} rank={index + 1} />
                        ))}
                    </main>

                    <footer className="text-center">
                        <button
                            onClick={handleGoToRoadmap}
                            className="bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            직무 로드맵 제공받으러 가기
                        </button>
                    </footer>
                </div>
            </div>
        </Layout>
    );
}

interface JobCardProps {
    job: RecommendedJob;
    rank: number;
}

function JobCard({ job, rank }: JobCardProps) {
    const rankColors = {
        1: 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50',
        2: 'border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100',
        3: 'border-orange-400 bg-gradient-to-br from-orange-50 to-red-50'
    };

    const rankIcons = {
        1: '🥇',
        2: '🥈',
        3: '🥉'
    };

    return (
        <div className={`relative bg-white border-2 rounded-xl p-8 text-left shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${rankColors[rank as keyof typeof rankColors] || 'border-gray-200'}`}>
            <div className="absolute top-4 right-4 text-2xl">
                {rankIcons[rank as keyof typeof rankIcons]}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h2>
            <p className="text-lg font-bold text-orange-500 mb-4">{job.matchRate}% 일치</p>
            <p className="text-gray-600 text-sm leading-relaxed">{job.description}</p>
        </div>
    );
}