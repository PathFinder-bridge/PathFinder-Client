'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const fieldLabels: Record<string, string> = {
    gender: '성별',
    birthYear: '출생년도',
    major: '전공'
};

export const ProfileStatus: React.FC = () => {
    const { userProfile, profileStatus, user } = useAuth();

    if (!userProfile || !profileStatus) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                </div>
            </div>
        );
    }

    const completionPercentage = Math.round(
        ((3 - profileStatus.missingBasicFields.length) / 3) * 100
    );

    return (
        <div className="bg-white shadow rounded-lg p-6">
            {/* 사용자 정보 */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#103D5E] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl font-semibold">
                        {userProfile.nickname.charAt(0).toUpperCase()}
                    </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{userProfile.nickname}</h3>
                <p className="text-sm text-gray-500">{userProfile.email}</p>
                <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userProfile.provider === 'LOCAL'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {userProfile.provider === 'LOCAL' ? '로컬 계정' : '카카오 계정'}
                    </span>
                </div>
            </div>

            {/* 프로필 완성도 */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">프로필 완성도</span>
                    <span className="text-sm font-medium text-gray-900">{completionPercentage}%</span>
                </div>

                {/* 진행바 */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                            completionPercentage === 100
                                ? 'bg-green-500'
                                : completionPercentage >= 66
                                    ? 'bg-blue-500'
                                    : 'bg-yellow-500'
                        }`}
                        style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* 상태 메시지 */}
            <div className={`p-4 rounded-lg mb-4 ${
                profileStatus.isBasicComplete
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-yellow-50 border border-yellow-200'
            }`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {profileStatus.isBasicComplete ? (
                            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <div className="ml-3">
                        <p className={`text-sm ${
                            profileStatus.isBasicComplete ? 'text-green-700' : 'text-yellow-700'
                        }`}>
                            {profileStatus.message}
                        </p>
                    </div>
                </div>
            </div>

            {/* 누락된 정보 목록 */}
            {!profileStatus.isBasicComplete && profileStatus.missingBasicFields.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">입력 필요한 정보:</h4>
                    <ul className="space-y-1">
                        {profileStatus.missingBasicFields.map((field) => (
                            <li key={field} className="flex items-center text-sm text-gray-600">
                                <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                                {fieldLabels[field] || field}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 완성된 정보 목록 */}
            {profileStatus.isBasicComplete && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">완성된 정보:</h4>
                    <ul className="space-y-1">
                        <li className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                            성별
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                            출생년도
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                            전공
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};