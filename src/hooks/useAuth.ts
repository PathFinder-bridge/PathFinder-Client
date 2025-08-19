'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager, authApi } from '@/lib/api/auth';

interface User {
    userId: number;
    email: string;
    nickname: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const accessToken = tokenManager.getAccessToken();

            if (accessToken) {
                // JWT 토큰에서 사용자 정보 추출 (간단한 방법)
                try {
                    const payload = JSON.parse(atob(accessToken.split('.')[1]));
                    setUser({
                        userId: payload.userId,
                        email: payload.email,
                        nickname: payload.nickname
                    });
                    setIsLoggedIn(true);
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
    }, []);

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('로그아웃 요청 실패:', error);
        } finally {
            tokenManager.clearTokens();
            setUser(null);
            setIsLoggedIn(false);
            router.push('/');
        }
    };

    const loginSuccess = (userData: User, accessToken: string, refreshToken: string) => {
        tokenManager.setTokens(accessToken, refreshToken);
        setUser(userData);
        setIsLoggedIn(true);
    };

    return {
        user,
        isLoggedIn,
        isLoading,
        logout,
        loginSuccess
    };
};