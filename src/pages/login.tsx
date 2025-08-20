'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authApi, LoginRequest, getKakaoAuthUrl } from '@/lib/api/auth';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/layout/Layout';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loginSuccess, isLoggedIn } = useAuth();

    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // 이미 로그인된 상태면 홈으로 리다이렉트
    useEffect(() => {
        if (isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, router]);

    // URL에서 에러 파라미터 확인
    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            if (errorParam === 'kakao_login_failed') {
                setError('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
            } else if (errorParam === 'kakao_code_missing') {
                setError('카카오 로그인 인증이 취소되었습니다.');
            } else {
                setError(decodeURIComponent(errorParam));
            }
        }
    }, [searchParams]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 폼 유효성 검사
        if (!formData.email || !formData.password) {
            setError('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            console.log('로그인 시도:', formData.email);

            const response = await authApi.login(formData);
            console.log('로그인 성공 응답:', response);

            // 백엔드 응답 구조에 맞춰 처리
            if (response.data) {
                console.log('로그인 성공, 사용자 데이터:', response.data);

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
                console.log('로그인 성공 - 홈페이지로 이동');
            } else {
                console.error('응답에 data가 없습니다:', response);
                setError('로그인 응답이 올바르지 않습니다.');
            }
        } catch (err: any) {
            console.error('로그인 에러 전체:', err);
            console.error('에러 응답:', err.response);
            console.error('에러 응답 데이터:', err.response?.data);
            console.error('에러 상태 코드:', err.response?.status);
            console.error('에러 메시지:', err.message);

            // 에러 메시지 결정
            let errorMessage = '로그인에 실패했습니다.';

            if (err.response) {
                // 서버 응답이 있는 경우
                const status = err.response.status;
                const responseData = err.response.data;

                console.log('서버 응답 상태:', status);
                console.log('서버 응답 데이터:', responseData);

                if (status === 401 || status === 400) {
                    // 인증 실패
                    if (responseData?.message) {
                        errorMessage = responseData.message;
                    } else {
                        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
                    }
                } else if (status === 500) {
                    errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
                } else {
                    errorMessage = responseData?.message || `서버 오류 (${status})`;
                }
            } else if (err.request) {
                // 요청은 보냈지만 응답을 받지 못한 경우
                console.error('네트워크 오류:', err.request);
                errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
            } else {
                // 요청 설정 중 오류가 발생한 경우
                console.error('요청 설정 오류:', err.message);
                errorMessage = err.message || '알 수 없는 오류가 발생했습니다.';
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKakaoLogin = () => {
        try {
            const kakaoAuthUrl = getKakaoAuthUrl();
            console.log('카카오 로그인 URL:', kakaoAuthUrl);
            window.location.href = kakaoAuthUrl;
        } catch (error) {
            console.error('카카오 로그인 URL 생성 실패:', error);
            setError('카카오 로그인 설정에 오류가 있습니다.');
        }
    };

    const handleInputChange = (field: keyof LoginRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // 입력 시 에러 메시지 초기화
        if (error) {
            setError('');
        }
    };

    // 로딩 중이면 로딩 표시
    if (isLoggedIn) {
        return (
            <Layout variant="auth" showHeader={false} showFooter={false}>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#103D5E] mx-auto mb-4"></div>
                        <p className="text-gray-600">로그인 중...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout variant="auth" showHeader={false} showFooter={false}>
            <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    {/* 로고 */}
                    <div className="flex justify-center items-center mb-8 cursor-pointer" onClick={() => router.push('/')}>
                        <Image
                            src="/icon/logo.svg"
                            alt="PathFinder"
                            width={200}
                            height={60}
                            className="h-15"
                            priority
                        />
                    </div>

                    {/* 로그인 폼 */}
                    <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                        <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
                            로그인
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    placeholder="이메일"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    placeholder="비밀번호"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !formData.email || !formData.password}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#103D5E] hover:bg-[#0E3450] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#103D5E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        로그인 중...
                                    </div>
                                ) : (
                                    '로그인'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleKakaoLogin}
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#FEE500] hover:bg-[#E6CE00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Image
                                    src="/icon/kakao.svg"
                                    alt="카카오"
                                    width={20}
                                    height={20}
                                    className="mr-2"
                                />
                                카카오 3초 로그인
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <span className="text-sm text-gray-600">
                                아직 pathfinder 회원이 아니신가요?{' '}
                                <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                    가입하기
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}