'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuth } from '@/hooks/useAuth';

export default function KakaoCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loginSuccess } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const handleKakaoCallback = async () => {
            try {
                const code = searchParams.get('code');
                const error = searchParams.get('error');

                if (error) {
                    setStatus('error');
                    setErrorMessage('카카오 로그인이 취소되었습니다.');
                    setTimeout(() => {
                        router.push('/login?error=kakao_code_missing');
                    }, 2000);
                    return;
                }

                if (!code) {
                    setStatus('error');
                    setErrorMessage('인증 코드가 없습니다.');
                    setTimeout(() => {
                        router.push('/login?error=kakao_code_missing');
                    }, 2000);
                    return;
                }

                console.log('카카오 인증 코드:', code);
                const response = await authApi.kakaoLogin({ authorizationCode: code });

                // 백엔드 응답 구조에 맞춰 수정
                if (response.data) {
                    setStatus('success');

                    // useAuth의 loginSuccess 호출
                    await loginSuccess(
                        {
                            userId: response.data.userId,
                            email: response.data.email,
                            nickname: response.data.nickname
                        },
                        response.data.accessToken,
                        response.data.refreshToken
                    );

                    setTimeout(() => {
                        router.push('/');
                    }, 1000);
                } else {
                    throw new Error('로그인 응답 데이터가 없습니다.');
                }
            } catch (error: any) {
                console.error('카카오 로그인 처리 실패:', error);
                setStatus('error');
                setErrorMessage(error.message || '카카오 로그인에 실패했습니다.');
                setTimeout(() => {
                    router.push('/login?error=kakao_login_failed');
                }, 2000);
            }
        };

        handleKakaoCallback();
    }, [searchParams, router, loginSuccess]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    {status === 'loading' && (
                        <>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#103D5E] mx-auto mb-4"></div>
                            <h2 className="text-xl font-semibold text-gray-900">카카오 로그인 처리 중...</h2>
                            <p className="text-gray-600 mt-2">잠시만 기다려주세요.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">로그인 성공!</h2>
                            <p className="text-gray-600 mt-2">홈페이지로 이동합니다.</p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">로그인 실패</h2>
                            <p className="text-gray-600 mt-2">{errorMessage}</p>
                            <p className="text-sm text-gray-500 mt-2">로그인 페이지로 돌아갑니다.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}