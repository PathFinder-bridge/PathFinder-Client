'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api/auth';

export default function KakaoCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState('');

    useEffect(() => {
        const handleKakaoCallback = async () => {
            try {
                const authorizationCode = searchParams.get('code');
                const errorParam = searchParams.get('error');

                if (errorParam) {
                    throw new Error('카카오 로그인이 취소되었습니다.');
                }

                if (!authorizationCode) {
                    throw new Error('인증 코드를 받지 못했습니다.');
                }

                const response = await authApi.kakaoLogin({ authorizationCode });

                if (response.success) {
                    setStatus('success');
                    setTimeout(() => {
                        router.push('/');
                    }, 1000);
                }
            } catch (err) {
                console.error('카카오 로그인 에러:', err);
                setError(err instanceof Error ? err.message : '카카오 로그인에 실패했습니다.');
                setStatus('error');

                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        };

        handleKakaoCallback();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 text-center">
                    {status === 'loading' && (
                        <div>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                            <p className="text-gray-600">카카오 로그인 처리 중...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div>
                            <div className="text-green-500 text-5xl mb-4">✓</div>
                            <p className="text-gray-600">로그인 성공! 메인 페이지로 이동합니다.</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div>
                            <div className="text-red-500 text-5xl mb-4">✗</div>
                            <p className="text-red-600 mb-2">로그인 실패</p>
                            <p className="text-gray-600 text-sm">{error}</p>
                            <p className="text-gray-500 text-xs mt-2">3초 후 로그인 페이지로 이동합니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}