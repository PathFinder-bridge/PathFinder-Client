'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {JobResponse} from '@/lib/api/jobs';
import {Button} from '@/components/common/Button';

interface JobCardProps {
    job: JobResponse;
}

export const JobCard: React.FC<JobCardProps> = ({job}) => {
    const router = useRouter();

    return (
        <div
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 h-[480px] flex flex-col">
            {/* 직무 제목 - 고정 높이 */}
            <div className="h-16 mb-4 flex items-start">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {job.title}
                </h3>
            </div>

            {/* 직무 설명 - 고정 높이 (6줄) */}
            <div className="h-32 mb-4">
                <p className="text-gray-600 leading-relaxed line-clamp-6 overflow-hidden">
                    {job.description}
                </p>
            </div>

            {/* 필요 스킬 - 고정 높이 (3줄) */}
            <div className="h-24 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">필요 스킬</h4>
                <div className="flex flex-wrap gap-2 h-16 overflow-hidden">
                    {job.skills.map((skill, index) => (
                        <span
                            key={index}
                            className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full h-fit"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* 연봉 정보와 액션 버튼 - 하단 고정 */}
            <div className="mt-auto pt-4 border-t border-gray-100">
                {/* 연봉 정보 */}
                <div className="h-12 mb-4 flex flex-col justify-center">
                    <span className="text-sm text-gray-500">예상 연봉</span>
                    <p className="font-semibold text-green-600">{job.salaryRange}</p>
                </div>

                {/* 액션 버튼들 - 고정 높이 */}
                <div className="h-12 flex space-x-3">
                    <Button
                        variant="outline"
                        size="md"
                        className="flex-1 h-full"
                        onClick={() => {
                            // TODO: 상세 정보 모달이나 페이지로 이동
                            console.log('직무 상세 정보:', job);
                        }}
                    >
                        자세히 보기
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        className="flex-1 h-full"
                        onClick={() => {
                            // TODO: 로드맵 페이지로 이동
                            router.push(`/roadmaps?job=${encodeURIComponent(job.title)}`);
                        }}
                    >
                        로드맵 보기
                    </Button>
                </div>
            </div>
        </div>
    );
};