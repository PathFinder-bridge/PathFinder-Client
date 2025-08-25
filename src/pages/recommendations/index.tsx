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
                <div className="min-h-screen bg-gray-50 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <JobRecommendationHeader />

                        <div className="bg-gradient-to-br from-indigo-500/10 via-purple-50 to-pink-500/10 rounded-2xl shadow-lg p-8 border-2 border-indigo-200/50 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">캐릭터 선택</h2>
                                    <p className="text-gray-600">마음에 드는 직업 캐릭터를 클릭해보세요!</p>
                                </div>

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
                </div>
            </Layout>
        </ProtectedRoute>
    );
}

function JobRecommendationHeader() {
    return (
        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-5xl mb-5">
                🎮 직업 월드 탐험하기
            </h1>
            <p className="text-xl text-gray-600 mb-4">
                체험하고 싶은 캐릭터를 선택하고 직업 모험을 시작해보세요!
            </p>
            <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                    🏆 Level 1
                </span>
                <span>•</span>
                <span>직업 탐험가</span>
            </div>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
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
            className={`group flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm border-2 rounded-xl text-center cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:scale-110 hover:-translate-y-1 ${
                isSelected
                    ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-110 -translate-y-1 ring-4 ring-purple-200'
                    : 'border-gray-200 hover:border-purple-300 shadow-md'
            }`}
            style={{ minHeight: '180px' }}
        >
            <div className={`text-5xl mb-3 transition-all duration-300 group-hover:scale-125 ${isSelected ? 'animate-bounce' : ''}`}>
                {job.emoji}
            </div>
            <div className={`w-2 h-2 rounded-full mb-2 transition-colors duration-300 ${
                isSelected ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'
            }`}></div>
            <p className="text-sm font-medium text-gray-500 mb-1">{job.animalName}</p>
            <h3 className={`text-base font-semibold transition-colors duration-300 ${
                isSelected ? 'text-purple-700' : 'text-gray-800'
            }`}>{job.jobTitle}</h3>
        </div>
    );
}

interface JobDetailCardProps {
    job: Job;
}

function JobDetailCard({ job }: JobDetailCardProps) {
    const isBackendDeveloper = job.jobTitle === '백엔드 개발자';

    return (
        <div className="mt-8 bg-gradient-to-r from-white to-purple-50/50 rounded-xl p-8 border-2 border-purple-200 shadow-lg transition-all duration-500 ease-in-out animate-fade-in-up relative overflow-hidden">
            {/* 게임 느낌 장식 */}

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🎯</span>
                    <h3 className="text-2xl font-bold text-gray-800">캐릭터 정보</h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    <JobDetailIcon job={job} />
                    <JobDetailContent job={job} isBackendDeveloper={isBackendDeveloper} />
                </div>
            </div>
        </div>
    );
}

function JobDetailIcon({ job }: { job: Job }) {
    return (
        <div className="flex-shrink-0 flex flex-col items-center text-center">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <span className="text-8xl">{job.emoji}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-4">{job.animalName}</h3>
            <span className="mt-2 text-sm font-semibold text-purple-700 bg-purple-100 px-4 py-2 rounded-full">
                {job.jobTitle}
            </span>
        </div>
    );
}

function JobDetailContent({ job, isBackendDeveloper }: { job: Job; isBackendDeveloper: boolean }) {
    return (
        <div className="flex-grow">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">⚡</span>
                <h4 className="text-xl font-bold text-gray-900">스킬 & 특성</h4>
            </div>
            <FeatureList features={job.features} />
            <ActionButton isBackendDeveloper={isBackendDeveloper} />
        </div>
    );
}

function FeatureList({ features }: { features: string[] }) {
    return (
        <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start text-gray-700">
                    <div className="w-6 h-6 mr-3 mt-0.5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <span className="text-gray-800">{feature}</span>
                </li>
            ))}
        </ul>
    );
}

function ActionButton({ isBackendDeveloper }: { isBackendDeveloper: boolean }) {
    if (isBackendDeveloper) {
        return (
            <Link href="/recommendations/quest" passHref>
                <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5">
                    🚀 모험 시작하기
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </Link>
        );
    }

    return (
        <button
            disabled
            className="inline-flex items-center px-6 py-3 bg-gray-400 text-white font-semibold rounded-xl cursor-not-allowed opacity-75"
        >
            🔒 준비 중...
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        </button>
    );
}