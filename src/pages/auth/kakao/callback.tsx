'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { authApi } from '@/lib/api/auth';
import { useAuth } from '@/hooks/useAuth';

export default function KakaoCallbackPage() {
    const router = useRouter();
    const { loginSuccess } = useAuth();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');
    const didRun = useRef(false);

    useEffect(() => {
        if (!router.isReady) return;
        if (didRun.current) return;
        didRun.current = true;

        const handleKakaoCallback = async () => {
            try {
                let { code, error: kakaoError } = router.query as {
                    code?: string | string[];
                    error?: string | string[];
                    state?: string | string[];
                };

                if (Array.isArray(code)) code = code[0];
                if (Array.isArray(kakaoError)) kakaoError = kakaoError[0];

                if (kakaoError) {
                    setStatus('error');
                    setErrorMessage('카카오 로그인이 취소되었습니다.');
                    setTimeout(() => router.push('/login?error=kakao_cancelled'), 1500);
                    return;
                }

                if (!code) {
                    setStatus('error');
                    setErrorMessage('인증 코드가 없습니다.');
                    setTimeout(() => router.push('/login?error=kakao_code_missing'), 1500);
                    return;
                }

                const res = await authApi.kakaoLogin({ authorizationCode: code });

                const env = (res && typeof res === 'object' && 'data' in res) ? (res as any).data : res;
                const data = env?.data ?? env;
                if (!data) throw new Error('로그인 응답 데이터가 없습니다.');

                await loginSuccess(
                    { userId: data.userId, email: data.email, nickname: data.nickname },
                    data.accessToken,
                    data.refreshToken
                );

                setStatus('success');
                setTimeout(() => router.replace('/'), 800);
            } catch (err: any) {
                console.error('카카오 로그인 처리 실패:', err);
                setStatus('error');

                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    '카카오 로그인에 실패했습니다.';
                setErrorMessage(msg);

                setTimeout(() => router.push('/login?error=kakao_login_failed'), 1500);
            }
        };

        handleKakaoCallback();
    }, [router.isReady, router.query, router, loginSuccess]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                {status === 'loading' && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#103D5E] mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900">카카오 로그인 처리 중...</h2>
                        <p className="text-gray-600 mt-2">잠시만 기다려주세요.</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">로그인 성공!</h2>
                        <p className="text-gray-600 mt-2">곧 이동합니다…</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">로그인 실패</h2>
                        <p className="text-gray-600 mt-2">{errorMessage}</p>
                        <p className="text-sm text-gray-500 mt-2">로그인 페이지로 돌아갑니다.</p>
                    </>
                )}
            </div>
        </div>
    );
}