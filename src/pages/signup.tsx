'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authApi } from '@/lib/api/auth';
import { useFormValidation, validators } from '@/lib/validation';
import { FormInput } from '@/components/common/FormInput';
import { Layout } from '@/layout/Layout';

interface SignUpFormData {
    nickname: string;
    email: string;
    verificationCode: string;
    password: string;
    passwordConfirm: string;
    agreeToTerms: boolean;
}

interface FormState {
    emailChecked: boolean;
    emailAvailable: boolean;
    codeSent: boolean;
    codeVerified: boolean;
    verificationToken: string;
}

const validationConfig = {
    nickname: {
        validator: validators.nickname
    },
    email: {
        validator: validators.email,
        message: '올바른 이메일 형식이 아닙니다.'
    },
    verificationCode: {
        validator: validators.verificationCode,
        message: '인증 코드는 6자리 숫자여야 합니다.'
    },
    password: {
        validator: validators.password
    }
};

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<SignUpFormData>({
        nickname: '',
        email: '',
        verificationCode: '',
        password: '',
        passwordConfirm: '',
        agreeToTerms: false
    });

    const [formState, setFormState] = useState<FormState>({
        emailChecked: false,
        emailAvailable: false,
        codeSent: false,
        codeVerified: false,
        verificationToken: ''
    });

    const [isLoading, setIsLoading] = useState({
        checkEmailAndSendCode: false,
        verifyCode: false,
        signUp: false
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null);

    const { errors, validateSingleField, clearFieldError } = useFormValidation(validationConfig);

    const handleInputChange = (field: keyof SignUpFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (typeof value === 'string' && field !== 'agreeToTerms') {
            if (field === 'passwordConfirm') {
                const isMatch = value === formData.password;
                setPasswordConfirmError(isMatch ? null : '비밀번호가 일치하지 않습니다.');
            } else if (field === 'password') {
                clearFieldError(field);
                validateSingleField(field, value);
                if (formData.passwordConfirm) {
                    const isMatch = formData.passwordConfirm === value;
                    setPasswordConfirmError(isMatch ? null : '비밀번호가 일치하지 않습니다.');
                }
            } else {
                clearFieldError(field);
                validateSingleField(field, value);
            }
        }

        // 이메일이 변경되면 관련 상태 초기화
        if (field === 'email') {
            setFormState(prev => ({
                ...prev,
                emailChecked: false,
                emailAvailable: false,
                codeSent: false,
                codeVerified: false
            }));
            setError('');
            setSuccess('');
        }
    };

    // 이메일 중복확인 + 인증코드 발송을 한 번에 처리
    const handleEmailVerification = async () => {
        if (!formData.email || !validators.email(formData.email)) {
            setError('올바른 이메일을 입력해주세요.');
            return;
        }

        setIsLoading(prev => ({ ...prev, checkEmailAndSendCode: true }));
        setError('');
        setSuccess('');

        try {
            // 1단계: 이메일 중복 확인
            const duplicateResponse = await authApi.checkEmailDuplicate(formData.email);

            if (!duplicateResponse.data) {
                // 중복된 이메일인 경우
                setError('이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.');
                setFormState(prev => ({
                    ...prev,
                    emailChecked: true,
                    emailAvailable: false
                }));
                return;
            }

            // 2단계: 이메일이 사용 가능하면 바로 인증코드 발송
            const verifyResponse = await authApi.verifyEmail({ email: formData.email });

            if (verifyResponse.success) {
                setFormState(prev => ({
                    ...prev,
                    emailChecked: true,
                    emailAvailable: true,
                    codeSent: true
                }));
                setSuccess('인증 코드가 발송되었습니다. 이메일을 확인해주세요.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '이메일 인증 요청에 실패했습니다.');
        } finally {
            setIsLoading(prev => ({ ...prev, checkEmailAndSendCode: false }));
        }
    };

    const verifyCode = async () => {
        if (!validators.verificationCode(formData.verificationCode)) {
            setError('올바른 인증번호를 입력해주세요.');
            return;
        }

        setIsLoading(prev => ({ ...prev, verifyCode: true }));
        setError('');

        try {
            const response = await authApi.verifyCode({
                email: formData.email,
                code: formData.verificationCode
            });

            if (response.success) {
                setFormState(prev => ({
                    ...prev,
                    codeVerified: true,
                    verificationToken: response.data.verificationToken
                }));
                setSuccess('이메일 인증이 완료되었습니다.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '인증번호 확인에 실패했습니다.');
        } finally {
            setIsLoading(prev => ({ ...prev, verifyCode: false }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        const nicknameValid = validators.nickname(formData.nickname);
        const passwordValid = validators.password(formData.password);

        if (!nicknameValid.isValid) {
            setError(nicknameValid.message || '이름을 확인해주세요.');
            return;
        }

        if (!passwordValid.isValid) {
            setError(passwordValid.message || '비밀번호를 확인해주세요.');
            return;
        }

        if (!formState.codeVerified) {
            setError('이메일 인증을 완료해주세요.');
            return;
        }

        if (formData.password !== formData.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!formData.agreeToTerms) {
            setError('개인정보 수집이용 동의는 필수입니다.');
            return;
        }

        setIsLoading(prev => ({ ...prev, signUp: true }));

        try {
            const response = await authApi.signUp({
                verificationToken: formState.verificationToken,
                password: formData.password,
                passwordConfirm: formData.passwordConfirm
            });

            if (response.success) {
                setSuccess('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
        } finally {
            setIsLoading(prev => ({ ...prev, signUp: false }));
        }
    };

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

                    {/* 회원가입 폼 */}
                    <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                        <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
                            회원가입
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* 닉네임 */}
                            <FormInput
                                type="text"
                                placeholder="이름"
                                value={formData.nickname}
                                onChange={(e) => handleInputChange('nickname', e.target.value)}
                                error={errors.nickname}
                                required
                            />

                            {/* 이메일 + 인증하기 버튼 */}
                            <div className="flex space-x-2 items-start">
                                <div className="flex-1">
                                    <FormInput
                                        type="email"
                                        placeholder="이메일"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        error={errors.email}
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleEmailVerification}
                                    disabled={isLoading.checkEmailAndSendCode || !formData.email || !!errors.email || formState.codeSent}
                                    className="px-4 py-3 bg-[#103D5E] hover:bg-[#0E3450] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#103D5E] disabled:opacity-50 whitespace-nowrap font-medium h-[48px] flex items-center"
                                >
                                    {isLoading.checkEmailAndSendCode ? '처리 중...' : formState.codeSent ? '발송완료' : '인증하기'}
                                </button>
                            </div>

                            {/* 인증번호 입력 - 코드가 발송된 후에만 표시 */}
                            {formState.codeSent && (
                                <div className="flex space-x-2 items-start">
                                    <div className="flex-1">
                                        <FormInput
                                            type="text"
                                            placeholder="인증번호"
                                            value={formData.verificationCode}
                                            onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                                            error={errors.verificationCode}
                                            maxLength={6}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={verifyCode}
                                        disabled={isLoading.verifyCode || formState.codeVerified || !formData.verificationCode}
                                        className="px-4 py-3 bg-[#103D5E] hover:bg-[#0E3450] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#103D5E] disabled:opacity-50 whitespace-nowrap font-medium h-[48px] flex items-center"
                                    >
                                        {isLoading.verifyCode ? '확인 중...' : formState.codeVerified ? '인증완료' : '확인'}
                                    </button>
                                </div>
                            )}

                            {/* 비밀번호 */}
                            <FormInput
                                type="password"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                error={errors.password}
                                helperText={!errors.password && formData.password === "" ? "영문, 숫자, 특수문자 포함 8-20자" : undefined}
                                required
                            />

                            {/* 비밀번호 확인 */}
                            <FormInput
                                type="password"
                                placeholder="비밀번호 확인"
                                value={formData.passwordConfirm}
                                onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
                                error={passwordConfirmError}
                                required
                            />

                            {/* 개인정보 동의 */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="agreeToTerms" className="text-sm text-gray-700 flex items-center">
                                    개인(신용)정보 수집이용 동의(회원가입)
                                    <span className="ml-1 text-blue-600">{'>'}</span>
                                </label>
                            </div>

                            {/* 회원가입 버튼 */}
                            <button
                                type="submit"
                                disabled={isLoading.signUp || !formState.codeVerified || !formData.agreeToTerms}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#103D5E] hover:bg-[#0E3450] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#103D5E] disabled:opacity-50"
                            >
                                {isLoading.signUp ? '가입 중...' : '회원가입'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <span className="text-sm text-gray-600">
                                이미 회원이신가요?{' '}
                                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                    로그인하기
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}