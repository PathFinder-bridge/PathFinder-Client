'use client';

import React from 'react';
import { Layout } from '@/layout/Layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export default function JobRoadmapsPage() {
    return (
        <ProtectedRoute requiresProfile={true}>
            <Layout>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white shadow rounded-lg p-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">직무 로드맵</h1>
                                <p className="text-lg text-gray-600 mb-8">
                                    단계별 학습 계획으로 목표 직무에 도달해보세요
                                </p>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                                        📈 로드맵 기능 준비 중
                                    </h3>
                                    <p className="text-green-700">
                                        개인화된 학습 로드맵과 커리어 가이드를<br/>
                                        제공하는 기능을 개발 중입니다.
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