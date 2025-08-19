'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export const HeroSection: React.FC = () => {
    const router = useRouter();
    const { isLoggedIn } = useAuth();

    const handleStartRecommendation = () => {
        if (isLoggedIn) {
            router.push('/recommendations');
        } else {
            router.push('/signup');
        }
    };

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <div className="border-2 border-gray-300 border-dashed rounded-lg p-16 bg-white/50 backdrop-blur-sm">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        <span className="text-blue-600">AI 직무 추천 플랫폼</span> PathFinder와
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
                        함께 나만의 길을 찾아볼까요?
                    </h2>

                    <button
                        onClick={handleStartRecommendation}
                        className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        직무 추천 바로가기
                        <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};