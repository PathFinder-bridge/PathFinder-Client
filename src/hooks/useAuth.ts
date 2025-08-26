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
        const result = await userApi.getProfileStatus();
        if (result.success && result.data) {
            setProfileStatus(result.data);
            return result.data;
        } else {
            console.error('프로필 상태 확인 실패:', result.error);
            return null;
        }
    }, []);

    // 사용자 프로필 정보 로드
    const loadUserProfile = useCallback(async () => {
        console.log('loadUserProfile 시작 - isLoggedIn:', isLoggedIn);

        const result = await userApi.getUserProfile();
        console.log('getUserProfile 결과:', result);

        if (result.success && result.data) {
            console.log('프로필 로드 성공:', result.data);
            setUserProfile(result.data);

            // userProfile에서 실제 사용자 정보를 추출해서 user state 업데이트
            const updatedUser = {
                userId: result.data.id,
                email: result.data.email,
                nickname: result.data.nickname
            };
            console.log('사용자 정보 업데이트:', updatedUser);
            setUser(updatedUser);

            return result.data;
        } else {
            console.error('프로필 정보 로드 실패:', result.error, 'status:', result.status);
            return null;
        }
    }, []);

    // 초기 인증 상태 확인
    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = tokenManager.getAccessToken();

            if (accessToken) {
                try {
                    // JWT 토큰에서 만료 시간 체크
                    const payload = JSON.parse(atob(accessToken.split('.')[1]));
                    const currentTime = Math.floor(Date.now() / 1000);

                    // 토큰이 만료되었으면 미리 삭제
                    if (payload.exp && payload.exp < currentTime) {
                        console.log('토큰이 만료됨 - 삭제 처리');
                        tokenManager.clearTokens();
                        setIsLoggedIn(false);
                        setUser(null);
                        setUserProfile(null);
                        setProfileStatus(null);
                        setIsLoading(false);
                        return;
                    }

                    // 토큰이 유효하면 로그인 상태 설정하고 프로필 로드
                    setIsLoggedIn(true);
                    console.log('토큰 유효 - 프로필 로드 시작');

                    try {
                        // 프로필 정보 로드 시도
                        const profileResult = await loadUserProfile();
                        await checkProfileStatus();

                        // 프로필 로드가 실패한 경우에만 JWT 정보 사용
                        if (!profileResult) {
                            console.log('프로필 로드 실패 - JWT 정보로 대체');
                            const fallbackUserData = {
                                userId: payload.userId || payload.sub,
                                email: payload.email || payload.sub,
                                nickname: payload.nickname || 'User'
                            };
                            setUser(fallbackUserData);
                        } else {
                            console.log('프로필 로드 성공 - DB 정보 사용');
                        }
                    } catch (error) {
                        console.error('프로필 로드 중 예외 발생:', error);
                        const fallbackUserData = {
                            userId: payload.userId || payload.sub,
                            email: payload.email || payload.sub,
                            nickname: payload.nickname || 'User'
                        };
                        setUser(fallbackUserData);
                    }

                } catch (error) {
                    console.error('토큰 파싱 또는 프로필 로드 오류:', error);
                    tokenManager.clearTokens();
                    setIsLoggedIn(false);
                    setUser(null);
                    setUserProfile(null);
                    setProfileStatus(null);
                }
            } else {
                setIsLoggedIn(false);
                setUser(null);
                setUserProfile(null);
                setProfileStatus(null);
            }

            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // 로그아웃
    const logout = async () => {
        // API 호출 결과와 상관없이 클라이언트 상태는 정리
        const result = await authApi.logout();
        if (!result.success) {
            console.error('로그아웃 API 실패:', result.error);
        }

        // 상태 정리
        tokenManager.clearTokens();
        setUser(null);
        setUserProfile(null);
        setProfileStatus(null);
        setIsLoggedIn(false);
        router.push('/');
    };

    // 로그인 성공 처리
    const loginSuccess = async (userData: User, accessToken: string, refreshToken: string) => {
        console.log('로그인 성공 처리 시작:', userData);

        tokenManager.setTokens(accessToken, refreshToken);
        setIsLoggedIn(true);

        try {
            await Promise.all([
                loadUserProfile(), // 실제 DB의 사용자 정보로 user state 업데이트
                checkProfileStatus()
            ]);
            console.log('로그인 후 프로필 로드 완료');
        } catch (error) {
            console.error('로그인 후 프로필 정보 로드 실패:', error);
        }

        // 홈페이지로 리다이렉트
        router.push('/');
    };

    // 프로필 업데이트 후 상태 갱신
    const refreshProfileData = async () => {
        await Promise.all([
            loadUserProfile(),
            checkProfileStatus()
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