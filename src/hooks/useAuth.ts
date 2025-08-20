'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager, authApi } from '@/lib/api/auth';
import { userApi, ProfileStatusResponse, UserProfileResponse } from '@/lib/api/user';

interface User {
    userId: number;
    email: string;
    nickname: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
    const [profileStatus, setProfileStatus] = useState<ProfileStatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    // 프로필 상태 확인
    const checkProfileStatus = useCallback(async () => {
        if (!isLoggedIn) return;

        try {
            const response = await userApi.getProfileStatus();
            setProfileStatus(response.data);
            return response.data;
        } catch (error) {
            console.error('프로필 상태 확인 실패:', error);
            return null;
        }
    }, [isLoggedIn]);

    // 사용자 프로필 정보 로드
    const loadUserProfile = useCallback(async () => {
        if (!isLoggedIn) return;

        try {
            const response = await userApi.getUserProfile();
            setUserProfile(response.data);
            return response.data;
        } catch (error) {
            console.error('프로필 정보 로드 실패:', error);
            return null;
        }
    }, [isLoggedIn]);

    // 초기 인증 상태 확인
    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = tokenManager.getAccessToken();

            if (accessToken) {
                try {
                    // JWT 토큰에서 사용자 정보 추출
                    const payload = JSON.parse(atob(accessToken.split('.')[1]));
                    const userData = {
                        userId: payload.userId || payload.sub,
                        email: payload.email || payload.sub,
                        nickname: payload.nickname || 'User'
                    };

                    console.log('토큰에서 추출한 사용자 정보:', userData);
                    setUser(userData);
                    setIsLoggedIn(true);

                    // 로그인 상태면 프로필 정보도 함께 로드
                    await Promise.all([
                        checkProfileStatus(),
                        loadUserProfile()
                    ]);
                } catch (error) {
                    console.error('토큰 파싱 오류:', error);
                    tokenManager.clearTokens();
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }

            setIsLoading(false);
        };

        checkAuth();
    }, [checkProfileStatus, loadUserProfile]);

    // 로그아웃
    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('로그아웃 요청 실패:', error);
        } finally {
            tokenManager.clearTokens();
            setUser(null);
            setUserProfile(null);
            setProfileStatus(null);
            setIsLoggedIn(false);
            router.push('/');
        }
    };

    // 로그인 성공 처리
    const loginSuccess = async (userData: User, accessToken: string, refreshToken: string) => {
        console.log('로그인 성공 처리 시작:', userData);

        tokenManager.setTokens(accessToken, refreshToken);
        setUser(userData);
        setIsLoggedIn(true);

        // 로그인 후 프로필 정보 로드
        try {
            await Promise.all([
                checkProfileStatus(),
                loadUserProfile()
            ]);
        } catch (error) {
            console.error('로그인 후 프로필 정보 로드 실패:', error);
        }

        // 홈페이지로 리다이렉트
        router.push('/');
    };

    // 프로필 업데이트 후 상태 갱신
    const refreshProfileData = async () => {
        await Promise.all([
            checkProfileStatus(),
            loadUserProfile()
        ]);
    };

    return {
        user,
        userProfile,
        profileStatus,
        isLoggedIn,
        isLoading,
        logout,
        loginSuccess,
        checkProfileStatus,
        loadUserProfile,
        refreshProfileData,
        // 편의 속성들
        isProfileComplete: profileStatus?.isBasicComplete ?? false,
        missingFields: profileStatus?.missingBasicFields ?? [],
        canUseRecommendation: profileStatus?.canUseRecommendation ?? false
    };
};