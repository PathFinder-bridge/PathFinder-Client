'use client';

import React, { useState, FormEvent } from 'react';
import { userApi, ChangePasswordRequest } from '@/lib/api/user';
import { validators } from '@/lib/validation';
import { FormInput } from '@/components/common/FormInput';
import { Button } from '@/components/common/Button';

export const PasswordForm: React.FC = () => {
    const [formData, setFormData] = useState<ChangePasswordRequest>({
        newPassword: '',
        confirmPassword: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');

    const handleInputChange = (field: keyof ChangePasswordRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
        setSuccess('');

        // 비밀번호 유효성 검사
        if (field === 'newPassword') {
            const validation = validators.password(value);
            setPasswordError(validation.isValid ? '' : validation.message || '');

            // 확인 비밀번호가 있으면 일치 여부 체크
            if (formData.confirmPassword) {
                setConfirmError(value === formData.confirmPassword ? '' : '비밀번호가 일치하지 않습니다.');
            }
        }

        // 비밀번호 확인
        if (field === 'confirmPassword') {
            setConfirmError(value === formData.newPassword ? '' : '비밀번호가 일치하지 않습니다.');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // 유효성 검사
        const passwordValidation = validators.password(formData.newPassword);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.message || '올바른 비밀번호를 입력해주세요.');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);

        try {
            await userApi.changePassword(formData);
            setSuccess('비밀번호가 성공적으로 변경되었습니다.');

            // 폼 초기화
            setFormData({
                newPassword: '',
                confirmPassword: ''
            });
            setPasswordError('');
            setConfirmError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : '비밀번호 변경에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">비밀번호 변경</h3>
                <p className="text-sm text-gray-600">새로운 비밀번호로 변경할 수 있습니다.</p>
            </div>

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

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 새 비밀번호 */}
                <FormInput
                    label="새 비밀번호 *"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    error={passwordError}
                    placeholder="새 비밀번호를 입력해주세요"
                    helperText={!passwordError && !formData.newPassword ? "영문, 숫자, 특수문자 포함 8-20자" : undefined}
                    required
                />

                {/* 비밀번호 확인 */}
                <FormInput
                    label="비밀번호 확인 *"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    error={confirmError}
                    placeholder="비밀번호를 다시 입력해주세요"
                    required
                />

                {/* 비밀번호 안전도 표시 */}
                {formData.newPassword && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">비밀번호 안전도</h4>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm">
                                <span className={`w-2 h-2 rounded-full mr-3 ${
                                    formData.newPassword.length >= 8 ? 'bg-green-400' : 'bg-gray-300'
                                }`}></span>
                                <span className={formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                                    8자 이상
                                </span>
                            </div>
                            <div className="flex items-center text-sm">
                                <span className={`w-2 h-2 rounded-full mr-3 ${
                                    /[a-zA-Z]/.test(formData.newPassword) ? 'bg-green-400' : 'bg-gray-300'
                                }`}></span>
                                <span className={/[a-zA-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                                    영문 포함
                                </span>
                            </div>
                            <div className="flex items-center text-sm">
                                <span className={`w-2 h-2 rounded-full mr-3 ${
                                    /\d/.test(formData.newPassword) ? 'bg-green-400' : 'bg-gray-300'
                                }`}></span>
                                <span className={/\d/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                                    숫자 포함
                                </span>
                            </div>
                            <div className="flex items-center text-sm">
                                <span className={`w-2 h-2 rounded-full mr-3 ${
                                    /[@$!%*?&]/.test(formData.newPassword) ? 'bg-green-400' : 'bg-gray-300'
                                }`}></span>
                                <span className={/[@$!%*?&]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                                    특수문자 포함
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setFormData({
                                    newPassword: '',
                                    confirmPassword: ''
                                });
                                setError('');
                                setSuccess('');
                                setPasswordError('');
                                setConfirmError('');
                            }}
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="bg-[#103D5E] hover:bg-[#0E3450]"
                            isLoading={isLoading}
                            disabled={!!passwordError || !!confirmError || !formData.newPassword || !formData.confirmPassword}
                        >
                            비밀번호 변경
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};