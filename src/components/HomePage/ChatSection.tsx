'use client';

import React, { useState, useEffect } from 'react';

interface ChatMessage {
    id: number;
    text: string;
    isUser: boolean;
}

const SAMPLE_CONVERSATIONS: ChatMessage[][] = [
    [
        { id: 1, text: "머신러닝이 뭔가요?", isUser: true },
        { id: 2, text: "머신러닝은 컴퓨터가 데이터를 통해 스스로 학습하고 패턴을 찾아내는 AI 기술입니다. 프로그래밍을 통해 명시적으로 지시하지 않아도 경험을 통해 성능을 향상시키는 것이 특징이에요!", isUser: false }
    ],
    [
        { id: 3, text: "백엔드 개발자는 어떤 일을 하나요?", isUser: true },
        { id: 4, text: "백엔드 개발자는 사용자에게 보이지 않는 서버 측 로직을 개발합니다. 데이터베이스 설계, API 개발, 서버 인프라 관리 등을 담당하며, 웹사이트나 앱이 안정적으로 작동할 수 있도록 뒷받침하는 역할을 해요.", isUser: false }
    ],
    [
        { id: 5, text: "데이터 분석가가 되려면 어떤 역량이 필요한가요?", isUser: true },
        { id: 6, text: "데이터 분석가가 되기 위해서는 통계학 지식, SQL과 Python/R 같은 프로그래밍 언어, 그리고 비즈니스 인사이트를 도출하는 능력이 필요합니다. 데이터 시각화 도구 활용 능력과 의사소통 스킬도 중요해요!", isUser: false }
    ]
];

export const ChatSection: React.FC = () => {
    const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const currentConversation = SAMPLE_CONVERSATIONS[currentConversationIndex];

    // 자동으로 대화 전환
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentConversationIndex((prev) =>
                prev === SAMPLE_CONVERSATIONS.length - 1 ? 0 : prev + 1
            );
        }, 5000); // 5초마다 전환

        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setInputValue('');
            }, 2000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <span
                        className="inline-block px-4 py-2 bg-slate-100 text-slate-800 text-sm font-medium rounded-full mb-6 border border-slate-200">
                        🤖 AI 어시스턴트
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 mt-4 space-y-4">
                        <div>PathFinder AI와의</div>
                        <div className="text-slate-700">실시간 대화</div>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed break-keep">
                        궁금한 IT 직무나 기술에 대해 언제든지 질문하세요.
                        AI가 친근하고 이해하기 쉽게 답변해드립니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Chat Interface */}
                    <div className="order-2 lg:order-1">
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                            {/* Chat header */}
                            <div className="bg-slate-700 px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">PathFinder AI</h3>
                                        <p className="text-white/80 text-sm">온라인</p>
                                    </div>
                                    <div className="ml-auto">
                                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Chat messages */}
                            <div className="h-96 p-6 overflow-y-auto bg-gray-50">
                                <div className="space-y-4">
                                    {currentConversation.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                                                {!message.isUser && (
                                                    <div
                                                        className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-5 h-5 text-white" fill="none"
                                                             viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                                        </svg>
                                                    </div>
                                                )}
                                                <div
                                                    className={`px-4 py-3 rounded-2xl ${
                                                        message.isUser
                                                            ? 'bg-slate-700 text-white rounded-br-md'
                                                            : 'bg-white text-gray-800 rounded-bl-md shadow-md border border-gray-100'
                                                    }`}
                                                >
                                                    <p className="text-sm leading-relaxed">{message.text}</p>
                                                </div>
                                                {message.isUser && (
                                                    <div
                                                        className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-5 h-5 text-gray-600" fill="none"
                                                             viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"
                                                         stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                                    </svg>
                                                </div>
                                                <div
                                                    className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-md border border-gray-100">
                                                    <div className="flex space-x-1">
                                                        <div
                                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div
                                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                                        <div
                                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Chat input */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <div className="flex space-x-4">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="궁금한 것을 물어보세요..."
                                        className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-500 focus:bg-white transition-all duration-200"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim()}
                                        className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features list */}
                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <div className="flex items-start space-x-4">
                                <div
                                    className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">실시간 Q&A</h3>
                                    <p className="text-gray-600 break-keep">IT 직무와 기술에 대한 궁금증을 언제든지 해결하세요.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <div className="flex items-start space-x-4">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">즉시 응답</h3>
                                    <p className="text-gray-600 break-keep">AI가 몇 초 안에 정확하고 이해하기 쉬운 답변을 제공합니다.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <div className="flex items-start space-x-4">
                                <div
                                    className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-indigo-700" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">맞춤 학습</h3>
                                    <p className="text-gray-600 break-keep">개인의 학습 수준에 맞춘 설명과 추천 자료를 제공합니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};