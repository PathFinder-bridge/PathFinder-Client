import React from 'react';

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}

const FEATURES: Feature[] = [
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        title: '직무 체험 게임',
        description: '재미있는 퀘스트를 통해 다양한 IT 직무를 실제로 체험해보세요. 게임을 플레이하며 자연스럽게 자신의 적성을 발견할 수 있습니다.',
        color: 'slate'
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        title: 'AI 기반 직무 추천',
        description: '고도화된 AI 알고리즘이 당신의 선호도, 성향, 경험을 종합적으로 분석하여 최적의 IT 직무를 추천해드립니다.',
        color: 'blue'
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
        ),
        title: '맞춤형 로드맵',
        description: '목표 직무까지의 체계적인 학습 경로를 제시합니다. 단계별 스킬 습득 가이드와 실무 프로젝트로 확실한 성장을 보장합니다.',
        color: 'indigo'
    }
];

const getColorClasses = (color: string) => {
    const colorMap = {
        slate: {
            bg: 'bg-slate-100',
            text: 'text-slate-700',
            border: 'border-slate-200',
            gradient: 'from-slate-500/10 to-slate-600/20'
        },
        blue: {
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            border: 'border-blue-200',
            gradient: 'from-blue-500/10 to-blue-600/20'
        },
        indigo: {
            bg: 'bg-indigo-100',
            text: 'text-indigo-700',
            border: 'border-indigo-200',
            gradient: 'from-indigo-500/10 to-indigo-600/20'
        }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.slate;
};

export const FeatureSection: React.FC = () => {
    return (
        <section className="min-h-screen flex items-center py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent"></div>

            <div className="relative max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-2 bg-slate-100 text-slate-800 text-sm font-medium rounded-full mb-6 border border-slate-200">
                        ✨ 특별한 기능들
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 mt-4 space-y-4">
                        <div>PathFinder만의</div>
                        <div className="text-slate-700">특별한 경험</div>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed break-keep">
                        단순한 설문조사를 넘어, AI와 게임화를 결합한 혁신적인 방식으로
                        당신에게 딱 맞는 IT 커리어를 찾아드립니다.
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {FEATURES.map((feature, index) => {
                        const colors = getColorClasses(feature.color);
                        return (
                            <div
                                key={index}
                                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2"
                            >
                                {/* Background gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300 break-keep">
                                        {feature.description}
                                    </p>

                                    {/* Decorative element */}
                                    <div className={`absolute top-6 right-6 w-12 h-12 ${colors.bg} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};