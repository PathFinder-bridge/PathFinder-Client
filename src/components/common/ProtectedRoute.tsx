'use client';

import {useEffect, useState} from 'react';
import {useAuth} from '@/hooks/useAuth';
import {ProfileModal} from './ProfileModal';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiresProfile?: boolean; // 프로필 완성이 필요한지 여부
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  requiresProfile = false
                                                              }) => {
    const {
        isLoggedIn,
        isLoading,
        isProfileComplete,
        missingFields,
        checkProfileStatus
    } = useAuth();

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [hasCheckedProfile, setHasCheckedProfile] = useState(false);

    // 로그인 상태이고 프로필 완성이 필요한 경우 체크
    useEffect(() => {
        const checkProfile = async () => {
            if (isLoggedIn && requiresProfile && !hasCheckedProfile) {
                await checkProfileStatus();
                setHasCheckedProfile(true);

                // 프로필이 미완성이면 모달 표시
                if (!isProfileComplete) {
                    setShowProfileModal(true);
                }
            }
        };

        if (!isLoading) {
            checkProfile();
        }
    }, [isLoggedIn, requiresProfile, isLoading, isProfileComplete, hasCheckedProfile, checkProfileStatus]);

    // 로딩 중이면 로딩 표시
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#103D5E]"></div>
            </div>
        );
    }

    // 프로필 완성이 필요한 페이지에서 미완성인 경우
    const shouldShowModal = requiresProfile && isLoggedIn && !isProfileComplete && showProfileModal;

    return (
        <>
            {children}

            {/* 프로필 완성 모달 */}
            <ProfileModal
                isOpen={shouldShowModal}
                missingFields={missingFields}
                onClose={() => setShowProfileModal(false)}
                onNavigateToProfile={() => setShowProfileModal(false)}
            />
        </>
    );
};