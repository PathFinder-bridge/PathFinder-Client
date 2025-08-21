'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from '@/layout/Layout';
import { useSearchParams } from 'next/navigation';

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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.answer || "응답을 받아오는 데 실패했습니다.";

  } catch (error) {
    console.error("Failed to fetch GPT response:", error);
    return "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};


export default function JobRoadmapPage() {
  const searchParams = useSearchParams();
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 메시지 리스트에 새 메시지 추가
  const addMessage = (sender: 'bot' | 'user', text: string, isLoading = false) => {
    setMessages(prev => [...prev, { id: Date.now(), sender, text, isLoading }]);
  };
  
  // 로딩이 끝난 후 마지막 메시지(로딩)를 실제 응답으로 업데이트
  const updateLastMessage = (text: string) => {
    setMessages(prev => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.isLoading) {
        lastMessage.text = text;
        lastMessage.isLoading = false;
      }
      return newMessages;
    });
  };

  // 직무 카드 클릭 시 챗봇 플로우 시작
  const handleJobCardClick = useCallback(async (job: Job) => {
    if (!job) return;
    setSelectedJob(job);
    setMessages([]); // 채팅창 초기화

    // 1. 선택 직무 안내
    addMessage('bot', `user님이 선택한 직무는 **${job.title}**입니다.`);
    
    // 2. 직무 설명 요청 및 로딩 표시
    addMessage('bot', '', true);
    const definition = await fetchGptResponse(`직무 "${job.title}"에 대해 2~3문장으로 알기 쉽게 설명해 줘.`);
    updateLastMessage(definition);

    // 3. 로드맵 질문
    addMessage('bot', `**${job.title}**을(를) 준비하는 로드맵을 안내해드릴까요?`);
    addMessage('bot', `궁금한 직무명을 입력하여 **1년/6개월/3개월** 로드맵을 안내해드릴게요!\n예시: 3개월 AI 엔지니어`);
  }, []);

  // 페이지 로드 시 URL에서 직무 목록을 가져와 초기화
  useEffect(() => {
    const jobsParam = searchParams.get('jobs');
    if (jobsParam) {
      try {
        const jobs: Job[] = JSON.parse(jobsParam);
        setRecommendedJobs(jobs);
        // 첫 번째 직무를 기본 선택으로 설정
        if (jobs.length > 0) {
          handleJobCardClick(jobs[0]);
        }
      } catch (error) {
        console.error("Failed to parse jobs data from URL", error);
      }
    }
  }, [searchParams, handleJobCardClick]);

  // 채팅 메시지가 추가될 때마다 맨 아래로 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 사용자 메시지 전송 처리
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput;
    addMessage('user', userText);
    setUserInput('');

    addMessage('bot', '', true);
    const roadmap = await fetchGptResponse(`"${userText}" 요청에 대한 직무 학습 로드맵을 단계별로 알려줘. 초보자도 이해하기 쉽게 설명해줘.`);
    updateLastMessage(roadmap);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-80px)] bg-white">
        {/* 왼쪽: 추천 직무 카드 목록 */}
        <aside className="w-1/4 p-6 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="space-y-4">
            {recommendedJobs.map(job => (
              <div
                key={job.id}
                onClick={() => handleJobCardClick(job)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedJob?.id === job.id ? 'bg-white border-blue-500 shadow-md' : 'bg-gray-100 border-transparent hover:bg-white'}`}
              >
                <h3 className="font-bold text-gray-800">{job.title}</h3>
                <p className="text-sm text-orange-500 font-semibold">{job.matchRate}% 일치</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{job.description}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* 중앙: 챗봇 인터페이스 */}
        <main className="flex-1 flex flex-col p-6">
          <div className="flex-1 overflow-y-auto space-y-6 pr-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'bot' && <div className="w-8 h-8 flex-shrink-0 bg-blue-100 rounded-full text-lg flex items-center justify-center">🤖</div>}
                <div className={`max-w-xl p-4 rounded-2xl ${msg.sender === 'bot' ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white'}`}>
                  {msg.isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="mt-6">
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="무엇이든 물어보세요"
                className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700">
                ↑
              </button>
            </div>
          </form>
        </main>
      </div>
    </Layout>
  );
}