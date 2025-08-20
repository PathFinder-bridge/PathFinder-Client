'use client';

import React from 'react';
import { Layout } from '@/layout/Layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export default function JobRecommendationsPage() {
    return (
        <ProtectedRoute requiresProfile={true}>
            <Layout>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white shadow rounded-lg p-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">직무 추천</h1>
                                <p className="text-lg text-gray-600 mb-8">
                                    AI가 분석한 나만의 맞춤형 직무를 추천받아보세요
                                </p>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                        🎉 프로필이 완성되었습니다!
                                    </h3>
                                    <p className="text-blue-700">
                                        이제 PathFinder의 모든 기능을 이용할 수 있습니다.<br/>
                                        곧 AI 기반 직무 추천 기능이 추가될 예정입니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}