'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/layout/Layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

// TypeScript를 사용하는 경우, 데이터의 타입을 명시해주면 개발이 편리해집니다.
interface Job {
  emoji: string;
  animalName: string;
  jobTitle: string;
  features: string[];
}

// 각 직무에 해당하는 동물 데이터를 확장합니다. (features 추가)
const jobAnimals: Job[] = [
  { emoji: '🦉', animalName: '똑똑한 부엉이', jobTitle: 'AI 엔지니어', features: ['머신러닝 모델 개발', '데이터 분석 및 처리', '알고리즘 설계', '파이프라인 구축'] },
  { emoji: '🦊', animalName: '영리한 여우', jobTitle: '디자인 마케터', features: ['브랜드 전략 수립', '콘텐츠 디자인', '사용자 경험(UX) 설계', '마케팅 캠페인 실행'] },
  { emoji: '🐨', animalName: '차분한 코알라', jobTitle: '소프트웨어 엔지니어', features: ['애플리케이션 설계', '효율적인 코드 작성', '테스트 및 디버깅', '팀 협업'] },
  { emoji: '🐻', animalName: '든든한 곰', jobTitle: '백엔드 개발자', features: ['고성능 서버 구축', '보안 전문가', '데이터베이스 최적화', '시스템 아키텍처 설계', '로그 분석'] },
  { emoji: '😺', animalName: '정의로운 고양이', jobTitle: '프론트엔드 개발자', features: ['UI/UX 구현', '웹 성능 최적화', 'API 연동', '크로스 브라우징 지원'] },
  { emoji: '🦁', animalName: '용감한 사자', jobTitle: '사이버 보안 엔지니어', features: ['취약점 분석', '모의 해킹', '보안 솔루션 구축', '침해 사고 대응'] },
  { emoji: '🐘', animalName: '기억력 좋은 코끼리', jobTitle: '데이터 엔지니어', features: ['데이터 파이프라인 설계', '대용량 데이터 처리', 'ETL/ELT 구축', '데이터 웨어하우스 관리'] },
  { emoji: '🦅', animalName: '눈에 띄는 독수리', jobTitle: '쉽게 배우는 풀스택 웹 개발', features: ['프론트엔드 개발', '백엔드 개발', '데이터베이스 연동', '클라우드 배포'] },
  { emoji: '🐧', animalName: '분석가 펭귄', jobTitle: '데이터 분석가', features: ['비즈니스 인사이트 도출', '데이터 시각화', '통계 분석', 'A/B 테스트 설계'] },
  { emoji: '🐿️', animalName: '바쁜 다람쥐', jobTitle: 'ios 아키텍트', features: ['앱 아키텍처 설계', '성능 최적화', 'Swift/Objective-C', 'HIG 준수'] },
  { emoji: '🐼', animalName: '손재주 좋은 판다', jobTitle: '모듈 엔지니어', features: ['하드웨어 모듈 설계', '펌웨어 개발', '회로 분석', '테스트 및 검증'] },
  { emoji: '🦄', animalName: '빠른 유니콘', jobTitle: '자동수준차 엔지니어', features: ['제어 시스템 개발', '센서 퓨전', '경로 계획 알고리즘', '시뮬레이션'] },
  { emoji: '🦙', animalName: '상냥한 라마', jobTitle: '컴퓨터 비전 엔지니어', features: ['이미지 처리 알고리즘', '객체 탐지 및 추적', '딥러닝 모델 적용', '데이터셋 구축'] },
];


export default function JobRecommendationsPage() {
    // 선택된 직무 카드의 정보를 저장할 state (초기값은 null)
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    // 카드를 클릭했을 때 실행될 함수
    const handleCardClick = (job: Job) => {
        // 이미 선택된 카드를 다시 클릭하면 선택 해제(null로 설정)
        if (selectedJob && selectedJob.jobTitle === job.jobTitle) {
            setSelectedJob(null);
        } else {
            // 다른 카드를 클릭하면 해당 카드의 정보로 state 업데이트
            setSelectedJob(job);
        }
    };

    return (
        <ProtectedRoute requiresProfile={true}>
            <Layout>
                <div className="min-h-screen bg-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                                동물 친구들과 직무 체험
                            </h1>
                            <p className="mt-4 text-xl text-gray-600">
                                귀여운 동물 친구를 선택하고 직무 모험을 시작해보세요!
                            </p>
                        </div>
                        
                        <div className="relative bg-gradient-to-br from-purple-500 to-indigo-700 p-8 rounded-3xl shadow-2xl">
                            {/* 직무 카드들을 담는 그리드 컨테이너 */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                                {jobAnimals.map((job) => (
                                    <div
                                        key={job.jobTitle}
                                        onClick={() => handleCardClick(job)}
                                        className={`group flex flex-col items-center justify-center p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg text-white text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-white/30
                                            ${selectedJob?.jobTitle === job.jobTitle ? 'ring-4 ring-yellow-300 scale-105' : 'ring-2 ring-transparent'}` // 선택된 카드에 테두리 효과 추가
                                        }
                                        style={{ minHeight: '160px' }}
                                    >
                                        <div className="text-5xl mb-2 transition-transform duration-300 group-hover:scale-110">
                                            {job.emoji}
                                        </div>
                                        <p className="text-sm font-semibold text-purple-200">{job.animalName}</p>
                                        <h3 className="text-base font-bold mt-1">{job.jobTitle}</h3>
                                    </div>
                                ))}
                            </div>

                            {/* 선택된 직무가 있을 때만 상세 정보창을 표시 */}
                            {selectedJob && (
                                <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 transition-all duration-500 ease-in-out animate-fade-in-up">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                                        {/* 왼쪽: 아이콘 및 직무 정보 */}
                                        <div className="flex-shrink-0 flex flex-col items-center text-center">
                                            <div className="bg-gray-100 rounded-full p-4">
                                                <span className="text-8xl">{selectedJob.emoji}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 mt-4">{selectedJob.animalName}</h3>
                                            <span className="mt-1 text-sm font-semibold text-green-800 bg-green-100 px-3 py-1 rounded-full">{selectedJob.jobTitle}</span>
                                        </div>

                                        {/* 오른쪽: 개발 특성 및 버튼 */}
                                        <div className="flex-grow">
                                            <h4 className="text-lg font-bold text-gray-900 mb-3">개발 특성</h4>
                                            <ul className="space-y-2">
                                                {selectedJob.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center text-gray-700">
                                                        <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                        </svg>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                            
                                            {/* ▼▼▼ 2. 버튼 로직을 수정합니다. ▼▼▼ */}
                                            {selectedJob.jobTitle === '백엔드 개발자' ? (
                                                <Link href="/job-recommendations/quest" passHref>
                                                    <button className="mt-6 w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform duration-200 hover:scale-105">
                                                        모험 시작하기 →
                                                    </button>
                                                </Link>
                                            ) : (
                                                <button disabled className="mt-6 w-full sm:w-auto bg-gray-400 text-white font-bold py-3 px-8 rounded-full cursor-not-allowed">
                                                    모험 준비중...
                                                </button>
                                            )}
                                            {/* ▲▲▲ 2. 버튼 로직 수정 끝 ▲▲▲ */}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}