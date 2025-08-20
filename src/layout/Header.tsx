'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useAuth} from '@/hooks/useAuth';
import {useRouter} from 'next/navigation';

export const Header: React.FC = () => {
    const {isLoggedIn, user, logout} = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* 로고 */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/icon/logo.svg"
                            alt="PathFinder"
                            width={140}
                            height={40}
                            className="h-8"
                            priority
                        />
                    </Link>

                    {/* 네비게이션 메뉴 */}
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            href="/job-recommendations"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            직무 추천
                        </Link>
                        <Link
                            href="/job-roadmaps"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            직무 리스트
                        </Link>
                        <Link
                            href="/job-roadmaps"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            직무 로드맵
                        </Link>
                    </nav>

                    {/* 사용자 영역 */}
                    <div className="flex items-center space-x-4">
                        {isLoggedIn && user ? (
                            <div className="relative">
                                {/* 사용자 메뉴 버튼 */}
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    <div className="w-8 h-8 bg-[#103D5E] rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">
                                            {user.nickname.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span>{user.nickname}</span>
                                    <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </button>

                                {/* 드롭다운 메뉴 */}
                                {showUserMenu && (
                                    <>
                                        {/* 백드롭 */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowUserMenu(false)}
                                        />

                                        {/* 메뉴 */}
                                        <div
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                                            <Link
                                                href="/mypage"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                마이페이지
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                로그아웃
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/login"
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    로그인
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-[#103D5E] hover:bg-[#0E3450] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    회원가입
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 모바일 네비게이션 (필요시 추가) */}
            <div className="md:hidden border-t border-gray-200">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link
                        href="/job-recommendations"
                        className="block text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium"
                    >
                        직무 추천
                    </Link>
                    <Link
                        href="/job-roadmaps"
                        className="block text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium"
                    >
                        직무 리스트
                    </Link>
                    <Link
                        href="/job-roadmaps"
                        className="block text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium"
                    >
                        직무 로드맵
                    </Link>
                </div>
            </div>
        </header>
    );
};