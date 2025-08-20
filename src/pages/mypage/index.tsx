'use client';

import React, {useState, useEffect} from 'react';
import {Layout} from '@/layout/Layout';
import {useAuth} from '@/hooks/useAuth';
import {ProfileForm} from '@/components/MyPage/ProfileForm';
import {PasswordForm} from '@/components/MyPage/PasswordForm';
import {ProfileStatus} from '@/components/MyPage/ProfileStatus';
import {Button} from '@/components/common/Button';

export default function MyPage() {
    const {userProfile, isLoading, refreshProfileData} = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

    // 프로필 데이터 로드
    useEffect(() => {
        if (!userProfile && !isLoading) {
            refreshProfileData();
        }
    }, [userProfile, isLoading, refreshProfileData]);

    if (isLoading || !userProfile) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#103D5E]"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* 페이지 헤더 */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
                        <p className="mt-2 text-gray-600">개인정보를 관리하고 프로필을 완성해보세요</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 왼쪽: 프로필 상태 */}
                        <div className="lg:col-span-1">
                            <ProfileStatus/>
                        </div>

                        {/* 오른쪽: 메인 콘텐츠 */}
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow rounded-lg">
                                {/* 탭 헤더 */}
                                <div className="border-b border-gray-200">
                                    <nav className="flex">
                                        <button
                                            onClick={() => setActiveTab('profile')}
                                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                                activeTab === 'profile'
                                                    ? 'border-[#103D5E] text-[#103D5E]'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            프로필 정보
                                        </button>
                                        {userProfile.hasPassword && (
                                            <button
                                                onClick={() => setActiveTab('password')}
                                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                                    activeTab === 'password'
                                                        ? 'border-[#103D5E] text-[#103D5E]'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                비밀번호 변경
                                            </button>
                                        )}
                                    </nav>
                                </div>

                                {/* 탭 콘텐츠 */}
                                <div className="p-6">
                                    {activeTab === 'profile' && (
                                        <ProfileForm userProfile={userProfile} onUpdate={refreshProfileData}/>
                                    )}
                                    {activeTab === 'password' && userProfile.hasPassword && (
                                        <PasswordForm/>
                                    )}
                                </div>
                            </div>

                            {/* 소셜 로그인 사용자 안내 */}
                            {!userProfile.hasPassword && (
                                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-400" fill="currentColor"
                                                 viewBox="0 0 20 20">
                                                <path fillRule="evenodd"
                                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-blue-700">
                                                {userProfile.provider === 'KAKAO' ? '카카오' : '소셜'} 로그인 사용자는 비밀번호를 변경할 수
                                                없습니다.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}