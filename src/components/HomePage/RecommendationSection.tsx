'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const RECOMMENDATION_TYPES = [
    {
        title: "나에게 잘 맞는 IT 직무를 찾고 싶은 분",
        description: "다양한 IT 직무 중에서 자신의 성향과 관심사에 가장 적합한 분야를 찾아보세요.",
        icon: "🎯",
        color: "blue",
        gradient: "from-blue-500 to-blue-600"
    },
    {
        title: "IT 직무가 하는 일을 체험해보고 싶은 분",
        description: "실제 업무 환경을 시뮬레이션한 게임을 통해 각 직무의 특성을 직접 경험해보세요.",
        icon: "🎮",
        color: "blue",
        gradient: "from-blue-500 to-blue-600"
    },
    {
        title: "IT 직무를 원하는 비전공자",
        description: "IT 전공이 아니어도 괜찮습니다. 체계적인 로드맵으로 목표 직무에 도전해보세요.",
        icon: "🚀",
        color: "blue",
        gradient: "from-blue-500 to-blue-600"
    }
];

export const RecommendationSection: React.FC = () => {
    const router = useRouter();

    const handleStartRecommendation = () => {
        router.push('/signup');
    };

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
                <div
                    className="absolute top-20 left-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-20">
                    <span
                        className="inline-block px-4 py-2 bg-slate-100 text-slate-800 text-sm font-medium rounded-full mb-6 border border-slate-200">
                        🌟 맞춤 추천
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 mt-4 space-y-4">
                        <div>이런 분들에게</div>
                        <div className="text-slate-700">추천해요</div>
                    </h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed break-keep">
                        PathFinder는 다양한 배경과 목표를 가진 분들을 위한
                        맞춤형 IT 커리어 솔루션을 제공합니다.
                    </p>
                </div>

                {/* Recommendation cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {RECOMMENDATION_TYPES.map((item, index) => (
                        <div
                            key={index}
                            className="group relative bg-white backdrop-blur-sm rounded-3xl p-8 border border-gray-200 hover:bg-white transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            {/* Card background effect */}
                            <div className={`absolute inset-0 bg-white opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500`}></div>

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-gray-800 transition-colors duration-300">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 break-keep">
                                    {item.description}
                                </p>

                                {/* Decorative line */}
                                <div className={`w-full h-1 bg-gradient-to-r ${item.gradient} rounded-full mt-6 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 shadow-xl">
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">
                            지금 바로 시작해보세요!
                        </h3>
                        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto break-keep">
                            몇 분만 투자하여 당신만의 IT 커리어 여정을 시작해보세요.
                            무료로 이용할 수 있습니다.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={handleStartRecommendation}
                                className="group inline-flex items-center px-8 py-4 bg-slate-700 hover:bg-slate-800 text-white text-lg font-semibold rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                            >
                                직무 추천 시작하기
                                <svg
                                    className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>

                            <div className="flex items-center space-x-4 text-gray-600">
                                <div className="flex items-center space-x-1">
                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium">서비스 이용 무료</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium">3분 완료</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium">즉시 결과 확인</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom stats */}
                        <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
                                <div className="text-sm text-gray-500 font-medium">추천 만족도</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900 mb-2">15분</div>
                                <div className="text-sm text-gray-500 font-medium">평균 소요시간</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900 mb-2">365일</div>
                                <div className="text-sm text-gray-500 font-medium">언제든 이용</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};