'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/common/Button';

interface ProfileModalProps {
    isOpen: boolean;
    missingFields: string[];
    onClose: () => void;
    onNavigateToProfile: () => void;
}

const fieldLabels: Record<string, string> = {
    gender: '성별',
    birthYear: '출생년도',
    major: '전공'
};

export const ProfileModal: React.FC<ProfileModalProps> = ({
                                                              isOpen,
                                                              missingFields,
                                                              onClose,
                                                              onNavigateToProfile
                                                          }) => {
    const router = useRouter();

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleNavigateToProfile = () => {
        onNavigateToProfile();
        router.push('/mypage');
    };

    return (
        <>
            {/* 백드롭 */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* 모달 */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-modal-enter">
                    <div className="p-6">
                        {/* 헤더 */}
                        <div className="text-center mb-6">
                            <div
                                className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                PathFinder의 이용을 위해 추가적인 정보 입력이 필요합니다.
                            </h3>
                        </div>

                        {/* 누락된 정보 목록 */}
                        {missingFields.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-3">다음 정보를 입력해주세요:</p>
                                <ul className="space-y-2">
                                    {missingFields.map((field) => (
                                        <li key={field} className="flex items-center text-sm text-gray-700">
                                            <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                                            {fieldLabels[field] || field}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 버튼들 */}
                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={onClose}
                            >
                                나중에 하기
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1 bg-[#103D5E] hover:bg-[#0E3450]"
                                onClick={handleNavigateToProfile}
                            >
                                이동하기
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 애니메이션을 위한 스타일 */}
            <style jsx>{`
                .animate-modal-enter {
                    animation: modalEnter 0.2s ease-out;
                }

                @keyframes modalEnter {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </>
    );
};