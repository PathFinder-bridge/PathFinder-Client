'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const NAVIGATION_ITEMS = [
    { href: '/recommendations', label: '직무 추천' },
    { href: '/jobs', label: '직무 리스트' },
    { href: '/roadmap', label: '직무 로드맵' }
];

export const Header: React.FC = () => {
    const { user, isLoggedIn, logout, isLoading } = useAuth();
    const router = useRouter();

    const handleLogoClick = () => {
        router.push('/');
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* 로고 */}
                    <div
                        onClick={handleLogoClick}
                        className="flex items-center cursor-pointer"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xl font-bold">∞</span>
                            </div>
                            <span className="text-xl font-semibold text-gray-900">PathFinder</span>
                        </div>
                    </div>

                    {/* Navigation - 로그인 상태일 때만 표시 */}
                    {isLoggedIn && (
                        <nav className="hidden md:flex space-x-8">
                            {NAVIGATION_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    )}

                    {/* Auth Links */}
                    <div className="flex items-center space-x-4">
                        {!isLoading && (
                            <>
                                {isLoggedIn && user ? (
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-700 font-medium">
                                            {user.nickname}님
                                        </span>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                        >
                                            로그인
                                        </Link>
                                        <span className="text-gray-300">/</span>
                                        <Link
                                            href="/signup"
                                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                        >
                                            회원가입
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* 모바일 메뉴 버튼 (로그인 상태일 때만) */}
                    {isLoggedIn && (
                        <div className="md:hidden">
                            <button
                                type="button"
                                className="text-gray-700 hover:text-blue-600 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};