'use client';

import React, { useState, FormEvent } from 'react';
import { userApi, UserProfileResponse, UpdateProfileRequest } from '@/lib/api/user';
import { FormInput } from '@/components/common/FormInput';
import { Button } from '@/components/common/Button';

interface ProfileFormProps {
    userProfile: UserProfileResponse;
    onUpdate: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ userProfile, onUpdate }) => {
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        nickname: userProfile.nickname,
        gender: userProfile.gender || 'MALE',
        birthYear: userProfile.birthYear || new Date().getFullYear() - 25,
        major: userProfile.major || ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [nicknameError, setNicknameError] = useState('');

    // 닉네임 중복 확인
    const checkNickname = async (nickname: string) => {
        if (nickname === userProfile.nickname) {
            setNicknameError('');
            return true;
        }

        if (nickname.length < 2 || nickname.length > 20) {
            setNicknameError('닉네임은 2-20자 사이여야 합니다.');
            return false;
        }

        try {
            const response = await userApi.checkNickname(nickname);
            if (!response.data) {
                setNicknameError('이미 사용 중인 닉네임입니다.');
                return false;
            }
            setNicknameError('');
            return true;
        } catch (error) {
            setNicknameError('닉네임 확인에 실패했습니다.');
            return false;
        }
    };

    const handleInputChange = async (field: keyof UpdateProfileRequest, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
        setSuccess('');

        // 닉네임 변경 시 중복 확인
        if (field === 'nickname' && typeof value === 'string') {
            await checkNickname(value);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // 유효성 검사
        if (!formData.nickname.trim()) {
            setError('이름을 입력해주세요.');
            return;
        }

        if (formData.nickname.length < 2 || formData.nickname.length > 20) {
            setError('이름은 2-20자 사이여야 합니다.');
            return;
        }

        if (!formData.major.trim()) {
            setError('전공을 입력해주세요.');
            return;
        }

        if (formData.birthYear < 1950 || formData.birthYear > 2010) {
            setError('올바른 출생년도를 입력해주세요.');
            return;
        }

        // 닉네임 중복 확인
        const isNicknameValid = await checkNickname(formData.nickname);
        if (!isNicknameValid) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await userApi.updateProfile(formData);

            if (response.data) {
                setSuccess('프로필이 성공적으로 업데이트되었습니다.');
                onUpdate(); // 부모 컴포넌트에서 데이터 새로고침
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '프로필 업데이트에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">기본 정보</h3>
                <p className="text-sm text-gray-600">개인정보를 수정할 수 있습니다.</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 이름 */}
                    <FormInput
                        label="이름 *"
                        type="text"
                        value={formData.nickname}
                        onChange={(e) => handleInputChange('nickname', e.target.value)}
                        error={nicknameError}
                        placeholder="이름을 입력하세요"
                        required
                    />

                    {/* 성별 */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            성별 *
                        </label>
                        <select
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value as 'MALE' | 'FEMALE' | 'OTHER')}
                            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="MALE">남성</option>
                            <option value="FEMALE">여성</option>
                            <option value="OTHER">기타</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 생년월일 */}
                    <FormInput
                        label="생년월일 *"
                        type="date"
                        value={formData.birthYear ? `${formData.birthYear}-06-15` : ''}
                        onChange={(e) => {
                            const year = new Date(e.target.value).getFullYear();
                            handleInputChange('birthYear', year);
                        }}
                        min="1950-01-01"
                        max="2010-12-31"
                        required
                    />

                    {/* 전공 */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            전공 *
                        </label>
                        <select
                            value={formData.major}
                            onChange={(e) => handleInputChange('major', e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">전공을 선택하세요</option>
                            <option value="컴퓨터공학">컴퓨터공학</option>
                            <option value="소프트웨어공학">소프트웨어공학</option>
                            <option value="정보통신공학">정보통신공학</option>
                            <option value="전자공학">전자공학</option>
                            <option value="기계공학">기계공학</option>
                            <option value="산업공학">산업공학</option>
                            <option value="경영학">경영학</option>
                            <option value="경제학">경제학</option>
                            <option value="수학">수학</option>
                            <option value="통계학">통계학</option>
                            <option value="물리학">물리학</option>
                            <option value="화학">화학</option>
                            <option value="생물학">생물학</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>
                </div>

                {/* 이메일 (수정 불가) */}
                <FormInput
                    label="이메일"
                    type="email"
                    value={userProfile.email}
                    disabled
                    helperText="이메일은 보안상 수정할 수 없습니다."
                />

                <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setFormData({
                                    nickname: userProfile.nickname,
                                    gender: userProfile.gender || 'MALE',
                                    birthYear: userProfile.birthYear || new Date().getFullYear() - 25,
                                    major: userProfile.major || ''
                                });
                                setError('');
                                setSuccess('');
                                setNicknameError('');
                            }}
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="bg-[#103D5E] hover:bg-[#0E3450]"
                            isLoading={isLoading}
                            disabled={!!nicknameError}
                        >
                            저장하기
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};