import React from 'react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">∞</span>
                            </div>
                            <span className="text-lg font-semibold text-gray-900">PathFinder</span>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm">
                        &copy; {currentYear} PathFinder. All rights reserved.
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                        AI 직무 추천 플랫폼으로 나만의 길을 찾아보세요
                    </p>
                </div>
            </div>
        </footer>
    );
};