'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/common/AuthGuard';

// 타입 정의
interface Job {
    id: string;
    title: string;
    description: string;
    matchRate: number;
}

interface Message {
    id: number;
    sender: 'bot' | 'user';
    text: string;
    isLoading?: boolean;
}

// 실제 API Route를 호출하는 함수
const fetchGptResponse = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);

        const data = await response.json();
        return data.answer || '응답을 받아오는 데 실패했습니다.';
    } catch (error) {
        console.error('Failed to fetch GPT response:', error);
        return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
};

export default function JobRoadmapPage() {
    const searchParams = useSearchParams();
    const { user, userProfile, isLoading } = useAuth();

    // 닉네임 → 이름 → 이메일 아이디 → '사용자'
    const displayName = useMemo(() => {
        return (
            (user as any)?.nickname ||
            (userProfile as any)?.nickname ||
            (user as any)?.name ||
            ((user as any)?.email ? (user as any).email.split('@')[0] : '') ||
            '사용자'
        );
    }, [user, userProfile]);

    // 사용자 정보가 준비됐는지 (닉네임/이름/이메일 중 하나라도 있으면 true)
    const userReady = useMemo(() => {
        return Boolean(
            (user as any)?.nickname ||
            (userProfile as any)?.nickname ||
            (user as any)?.name ||
            (user as any)?.email
        );
    }, [user, userProfile]);

    const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // 최초 자동 실행 1회 보장용
    const bootedRef = useRef(false);

    // 메시지 리스트에 새 메시지 추가
    const addMessage = useCallback(
        (sender: 'bot' | 'user', text: string, isLoading = false) => {
            setMessages((prev) => [...prev, { id: Date.now(), sender, text, isLoading }]);
        },
        []
    );

    // 로딩 메시지를 실제 응답으로 업데이트
    const updateLastMessage = useCallback((text: string) => {
        setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.isLoading) {
                lastMessage.text = text;
                lastMessage.isLoading = false;
            }
            return newMessages;
        });
    }, []);

    // 직무 카드 클릭 시 챗봇 플로우 시작
    const handleJobCardClick = useCallback(
        async (job: Job) => {
            if (!job) return;
            setSelectedJob(job);
            setMessages([]); // 채팅창 초기화

            // 1) 선택 직무 안내
            addMessage('bot', `${displayName}님이 선택한 직무는 **${job.title}**입니다.`);

            // 2) 직무 설명
            addMessage('bot', '', true);
            const definition = await fetchGptResponse(
                `직무 "${job.title}"에 대해 2~3문장으로 알기 쉽게 설명해 줘.`
            );
            updateLastMessage(definition);

            // 3) 로드맵 질문
            addMessage('bot', `${displayName}님, **${job.title}**을(를) 준비하는 로드맵을 안내해드릴까요?`);
            addMessage(
                'bot',
                `궁금한 직무명을 입력하여 **1년/6개월/3개월** 로드맵을 안내해드릴게요!\n예시: 3개월 AI 엔지니어`
            );
        },
        [addMessage, updateLastMessage, displayName]
    );

    // 자동 스크롤
    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, []);

    // 메시지 추가/변경 시 자동 스크롤
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // URL 파라미터에서 직무 목록 읽고, 사용자 정보가 준비되면 첫 직무로 1회만 시작
    useEffect(() => {
        if (bootedRef.current || isLoading || !userReady) return;

        const jobsParam = searchParams.get('jobs');
        if (!jobsParam) return;

        try {
            const jobs: Job[] = JSON.parse(jobsParam);
            setRecommendedJobs(jobs);

            if (jobs.length > 0) {
                bootedRef.current = true; // ✅ StrictMode 2회 실행 방지
                handleJobCardClick(jobs[0]);
            }
        } catch (error) {
            console.error('Failed to parse jobs data from URL', error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, isLoading, userReady]); // ⚠️ handleJobCardClick를 의존성에서 제외 (bootedRef로 1회 보장)

    return (
        <AuthGuard>
            <Layout showFooter={false}>
                {/* 전체화면 채팅 인터페이스 */}
                <div className="flex h-[calc(100vh-64px)] bg-white">
                    {/* 왼쪽: 추천 직무 카드 목록 */}
                    <aside className="w-1/4 p-6 bg-gray-50 border-r border-gray-200 overflow-y-overlay [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div className="space-y-4">
                            {recommendedJobs.map((job) => (
                                <div
                                    key={job.id}
                                    onClick={() => handleJobCardClick(job)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                        selectedJob?.id === job.id
                                            ? 'bg-white border-blue-500 shadow-md'
                                            : 'bg-gray-100 border-transparent hover:bg-white'
                                    }`}
                                >
                                    <h3 className="font-bold text-gray-800">{job.title}</h3>
                                    <p className="text-sm text-orange-500 font-semibold">{job.matchRate}% 일치</p>
                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{job.description}</p>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* 중앙: 챗봇 인터페이스 */}
                    <main className="flex-1 flex flex-col px-28 p-6">
                        <div
                            className="flex-1 overflow-y-scroll space-y-6 pr-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                                >
                                    {msg.sender === 'bot' && (
                                        <div className="w-8 h-8 flex-shrink-0 bg-blue-100 rounded-full text-lg flex items-center justify-center">
                                            🤖
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-xl p-4 rounded-2xl ${
                                            msg.sender === 'bot' ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white'
                                        }`}
                                    >
                                        {msg.isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                                            </div>
                                        ) : (
                                            <p
                                                className="whitespace-pre-wrap"
                                                dangerouslySetInnerHTML={{
                                                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (!userInput.trim()) return;

                                const userText = userInput;
                                addMessage('user', userText);
                                setUserInput('');

                                addMessage('bot', '', true);
                                const roadmap = await fetchGptResponse(
                                    `"${userText}" 요청에 대한 직무 학습 로드맵을 단계별로 알려줘. 초보자도 이해하기 쉽게 설명해줘.`
                                );
                                updateLastMessage(roadmap);
                            }}
                            className="mt-6"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="무엇이든 물어보세요"
                                    className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700"
                                >
                                    →
                                </button>
                            </div>
                        </form>
                    </main>
                </div>
            </Layout>
        </AuthGuard>
    );
}
