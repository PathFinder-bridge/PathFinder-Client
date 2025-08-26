'use client';

import React from 'react';

/** 페이지별 데이터 스키마가 달라서, 카드가 필요로 하는 최소 속성만 프롭스로 받는다. */
export interface CharacterCardProps {
    emoji: React.ReactNode;         // 이모지나 JSX
    title: string;                  // 직무명
    subtitle?: string;              // 동물/캐릭터명
    selected?: boolean;             // 선택 상태
    onClick?: () => void;           // 카드 클릭 핸들러
    className?: string;             // 필요시 외부에서 스타일 덮어쓰기
}

/** 선택 효과/호버 애니메이션만 포함한 '카드' UI */
export default function CharacterCard({
                                          emoji,
                                          title,
                                          subtitle,
                                          selected = false,
                                          onClick,
                                          className = '',
                                      }: CharacterCardProps) {
    return (
        <div
            onClick={onClick}
            className={[
                'group flex flex-col items-center justify-center p-6 text-center rounded-xl cursor-pointer transform transition-all duration-300',
                'bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg hover:scale-110 hover:-translate-y-1',
                selected
                    ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-110 -translate-y-1 ring-4 ring-purple-200'
                    : 'border-gray-200 hover:border-purple-300 shadow-md',
                className,
            ].join(' ')}
            style={{ minHeight: 180 }}
        >
            <div className={`text-5xl mb-3 transition-all duration-300 group-hover:scale-125 ${selected ? 'animate-bounce' : ''}`}>
                {emoji}
            </div>
            <div className={`w-2 h-2 rounded-full mb-2 transition-colors ${selected ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'}`} />
            {subtitle && <p className="text-sm font-medium text-gray-500 mb-1">{subtitle}</p>}
            <h3 className={`text-base font-semibold ${selected ? 'text-purple-700' : 'text-gray-800'}`}>{title}</h3>
        </div>
    );
}
