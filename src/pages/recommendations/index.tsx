'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/layout/Layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { jobAnimals } from '@/lib/data';
import { Job } from '@/lib/types';

export default function JobRecommendationsPage() {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const handleCardClick = (job: Job) => {
        setSelectedJob(selectedJob?.jobTitle === job.jobTitle ? null : job);
    };

    return (
        <ProtectedRoute requiresProfile={true}>
            <Layout>
                <div className="min-h-screen bg-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <JobRecommendationHeader />

                        <div className="relative bg-gradient-to-br from-purple-500 to-indigo-700 p-8 rounded-3xl shadow-2xl">
                            <JobGrid
                                jobs={jobAnimals}
                                selectedJob={selectedJob}
                                onCardClick={handleCardClick}
                            />

                            {selectedJob && (
                                <JobDetailCard job={selectedJob} />
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}

function JobRecommendationHeader() {
    return (
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                동물 친구들과 직무 체험
            </h1>
            <p className="mt-4 text-xl text-gray-600">
                귀여운 동물 친구를 선택하고 직무 모험을 시작해보세요!
            </p>
        </div>
    );
}

interface JobGridProps {
    jobs: Job[];
    selectedJob: Job | null;
    onCardClick: (job: Job) => void;
}

function JobGrid({ jobs, selectedJob, onCardClick }: JobGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {jobs.map((job) => (
                <JobAnimalCard
                    key={job.jobTitle}
                    job={job}
                    isSelected={selectedJob?.jobTitle === job.jobTitle}
                    onClick={() => onCardClick(job)}
                />
            ))}
        </div>
    );
}

interface JobAnimalCardProps {
    job: Job;
    isSelected: boolean;
    onClick: () => void;
}

function JobAnimalCard({ job, isSelected, onClick }: JobAnimalCardProps) {
    return (
        <div
            onClick={onClick}
            className={`group flex flex-col items-center justify-center p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg text-white text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-white/30 ${
                isSelected ? 'ring-4 ring-yellow-300 scale-105' : 'ring-2 ring-transparent'
            }`}
            style={{ minHeight: '160px' }}
        >
            <div className="text-5xl mb-2 transition-transform duration-300 group-hover:scale-110">
                {job.emoji}
            </div>
            <p className="text-sm font-semibold text-purple-200">{job.animalName}</p>
            <h3 className="text-base font-bold mt-1">{job.jobTitle}</h3>
        </div>
    );
}

interface JobDetailCardProps {
    job: Job;
}

function JobDetailCard({ job }: JobDetailCardProps) {
    const isBackendDeveloper = job.jobTitle === '백엔드 개발자';

    return (
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 transition-all duration-500 ease-in-out animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <JobDetailIcon job={job} />
                <JobDetailContent job={job} isBackendDeveloper={isBackendDeveloper} />
            </div>
        </div>
    );
}

function JobDetailIcon({ job }: { job: Job }) {
    return (
        <div className="flex-shrink-0 flex flex-col items-center text-center">
            <div className="bg-gray-100 rounded-full p-4">
                <span className="text-8xl">{job.emoji}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-4">{job.animalName}</h3>
            <span className="mt-1 text-sm font-semibold text-green-800 bg-green-100 px-3 py-1 rounded-full">
                {job.jobTitle}
            </span>
        </div>
    );
}

function JobDetailContent({ job, isBackendDeveloper }: { job: Job; isBackendDeveloper: boolean }) {
    return (
        <div className="flex-grow">
            <h4 className="text-lg font-bold text-gray-900 mb-3">개발 특성</h4>
            <FeatureList features={job.features} />
            <ActionButton isBackendDeveloper={isBackendDeveloper} />
        </div>
    );
}

function FeatureList({ features }: { features: string[] }) {
    return (
        <ul className="space-y-2 mb-6">
            {features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    {feature}
                </li>
            ))}
        </ul>
    );
}

function ActionButton({ isBackendDeveloper }: { isBackendDeveloper: boolean }) {
    if (isBackendDeveloper) {
        return (
            <Link href="/recommendations/quest" passHref>
                <button className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform duration-200 hover:scale-105">
                    모험 시작하기 →
                </button>
            </Link>
        );
    }

    return (
        <button
            disabled
            className="w-full sm:w-auto bg-gray-400 text-white font-bold py-3 px-8 rounded-full cursor-not-allowed"
        >
            모험 준비중...
        </button>
    );
}