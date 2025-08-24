'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/hooks/useAuth';

export const HeroSection: React.FC = () => {
    const router = useRouter();
    const {isLoggedIn} = useAuth();

    const handleStartRecommendation = () => {
        if (isLoggedIn) {
            router.push('/recommendations');
        } else {
            router.push('/signup');
        }
    };

    return (
        <section
            className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-600/5 via-blue-600/3 to-transparent"></div>
            <div
                className="absolute top-20 left-10 w-72 h-72 bg-slate-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div
                className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="relative max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
                    {/* Left side - Main Content */}
                    <div className="order-1 lg:order-1 text-left">
                        {/* Main heading */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 mt-4 space-y-4">
                            <div>
                                <span className="text-slate-700">PathFinder</span>와 함께
                            </div>
                            <div className="text-gray-800">
                                나만의 길을 찾아볼까요?
                            </div>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed break-keep">
                            AI 기술과 게임화된 경험을 통해 당신에게 최적화된 IT 직무를 찾고,
                            체계적인 성장 로드맵을 제공합니다.
                        </p>

                        {/* CTA Button */}
                        <div className="mb-8">
                            <button
                                onClick={handleStartRecommendation}
                                className="group inline-flex items-center px-8 py-4 bg-slate-700 hover:bg-slate-800 text-white text-lg font-semibold rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                            >
                                직무 추천 바로가기
                                <svg
                                    className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Right side - Visual Effects */}
                    <div className="order-2 lg:order-2 relative flex items-center justify-center">
                        <div className="relative w-full max-w-lg">
                            {/* Main Circle Animation */}
                            <div className="relative w-80 h-80 mx-auto">
                                {/* Outer rotating ring */}
                                <div
                                    className="absolute inset-0 rounded-full border-4 border-slate-200/30 animate-spin-slow">
                                    <div
                                        className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-500 rounded-full"></div>
                                    <div
                                        className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <div
                                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                    <div
                                        className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-slate-400 rounded-full"></div>
                                </div>

                                {/* Inner rotating ring */}
                                <div
                                    className="absolute inset-8 rounded-full border-2 border-blue-200/40 animate-reverse-spin">
                                    <div
                                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <div
                                        className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-slate-600 rounded-full"></div>
                                    <div
                                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-indigo-600 rounded-full"></div>
                                </div>

                                {/* Center content */}
                                <div
                                    className="absolute inset-16 rounded-full bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4 animate-bounce">🎯</div>
                                        <div className="text-sm font-medium text-slate-700">AI Career</div>
                                        <div className="text-xs text-slate-500">PathFinder</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute top-10 left-10 animate-float">
                                <div
                                    className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl rotate-12 shadow-lg flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute top-20 right-5 animate-float-delayed">
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-600 rounded-xl -rotate-12 shadow-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute bottom-16 left-5 animate-float-slow">
                                <div
                                    className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl rotate-6 shadow-lg flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"/>
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute bottom-10 right-10 animate-pulse">
                                <div
                                    className="w-8 h-8 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full shadow-lg"></div>
                            </div>

                            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 animate-bounce-slow">
                                <div
                                    className="w-6 h-6 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full shadow-md"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom animations */}
                <style jsx>{`
                    @keyframes spin-slow {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }

                    @keyframes reverse-spin {
                        from {
                            transform: rotate(360deg);
                        }
                        to {
                            transform: rotate(0deg);
                        }
                    }

                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-20px);
                        }
                    }

                    @keyframes float-delayed {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-15px);
                        }
                    }

                    @keyframes float-slow {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-10px);
                        }
                    }

                    @keyframes bounce-slow {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-8px);
                        }
                    }

                    .animate-spin-slow {
                        animation: spin-slow 20s linear infinite;
                    }

                    .animate-reverse-spin {
                        animation: reverse-spin 15s linear infinite;
                    }

                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }

                    .animate-float-delayed {
                        animation: float-delayed 8s ease-in-out infinite 2s;
                    }

                    .animate-float-slow {
                        animation: float-slow 10s ease-in-out infinite 4s;
                    }

                    .animate-bounce-slow {
                        animation: bounce-slow 4s ease-in-out infinite;
                    }
                `}</style>
            </div>
        </section>
    );
};
