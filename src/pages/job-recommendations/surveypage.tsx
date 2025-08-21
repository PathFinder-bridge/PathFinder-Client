// pages/job-recommendations/survey.tsx

'use client';

import React, { useState } from 'react';
import { Layout } from '@/layout/Layout'; //
import { useRouter } from 'next/navigation';


// 설문 문항 데이터
interface Question {
  id: number;
  text: string;
}

const surveyQuestions: Question[] = [
  { id: 1, text: '새로운 지식이나 기술을 배우고 익히는 과정 자체를 즐깁니다.' },
  { id: 2, text: '웹사이트나 앱을 볼 때, ‘더 예쁘게 만들거나 더 편리하게 바꿀 수 있겠다’는 생각을 자주 합니다.' },
  { id: 3, text: '눈에 보이는 결과물보다는, 보이지 않는 곳에서 시스템이 착착 돌아가도록 논리적인 규칙을 만드는 것을 더 좋아합니다.' },
  { id: 4, text: '레고 블록을 조립하듯, 여러 부품을 합쳐 하나의 큰 구조나 계획을 설계하는 것을 즐깁니다.' },
  { id: 5, text: '어질러진 데이터를 깔끔하게 정리하고, 필요할 때 바로 꺼내 쓸 수 있도록 효율적인 창고(저장 시스템)를 구축하는 것에 흥미를 느낍니다.' },
  { id: 6, text: '숨은그림찾기처럼, 데이터 속에서 의미 있는 정보나 패턴을 발견하고 그 이유를 파헤치는 것을 좋아합니다.' },
  { id: 7, text: '체스나 바둑처럼 상대의 수를 예측하듯, 시스템의 허점을 미리 찾아내고 외부의 공격을 막는 전략을 세우는 것에 매력을 느낍니다.' },
  { id: 8, text: 'TV, 조명 같은 일상 속 사물들을 인터넷으로 연결해서 원격으로 제어하거나 자동으로 작동하게 만드는 기술이 재미있을 것 같습니다.' },
  { id: 9, text: '영화 속 ‘아이언맨 슈트’처럼, 정교한 기계나 로봇이 부드럽게 움직이도록 만드는 원리가 궁금합니다.' },
  { id: 10, text: '컴퓨터가 사람처럼 사진이나 동영상을 보고 그 안의 사물이나 사람을 알아보게 하는 기술에 관심이 많습니다.' },
  { id: 11, text: '스스로 배우고 생각하는 인공지능(AI)을 직접 만들어 문제를 해결해보고 싶습니다.' },
  { id: 12, text: '자율주행 자동차가 어떻게 세상을 ‘보고’ 스스로 판단하여 안전하게 움직이는지 그 원리가 매우 궁금합니다.' },
];

// 답변 선택 옵션 (값: -2 ~ 2)
const answerOptions = [
  { value: -2, color: 'red-500', hoverColor: 'red-400' },
  { value: -1, color: 'red-400', hoverColor: 'red-300' },
  { value: 0, color: 'gray-400', hoverColor: 'gray-500' },
  { value: 1, color: 'blue-400', hoverColor: 'blue-500' },
  { value: 2, color: 'blue-500', hoverColor: 'blue-600' },
];

export default function SurveyPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const isLastQuestion = currentQuestionIndex === surveyQuestions.length - 1;
  const currentQuestion = surveyQuestions[currentQuestionIndex];

  // 답변 선택 시 호출될 함수
  const handleAnswerSelect = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // 마지막 질문에 답변 완료 시, 결과 처리
      console.log('Final Answers:', newAnswers);
      alert('모든 질문에 답변하셨습니다. 결과를 분석합니다.');
      router.push('/job-recommendations/skill_page');
      // router.push('/job-recommendations/results');
    } else {
      // 다음 질문으로 이동
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const progressPercentage = (currentQuestionIndex / surveyQuestions.length) * 100;

  return (
    <Layout>
      <div className="flex flex-col justify-between min-h-screen bg-white">
        <div className="w-full max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <header className="mb-12">
            <h1 className="text-3xl font-bold text-gray-800">직무 추천을 시작하겠습니다!</h1>
            <p className="mt-2 text-lg text-gray-600">각 문항에 대해 본인이 좋아하는 정도를 선택해주세요.</p>
          </header>

          <main>
            {currentQuestion && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-xl">🤖</div>
                  <span className="text-lg font-semibold text-blue-800">패파봇</span>
                </div>
                
                <p className="text-2xl font-medium text-gray-700 leading-relaxed">
                  {currentQuestion.id}. {currentQuestion.text}
                </p>

                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-600">동의하지 않음</span>
                    <div className="flex items-center gap-4 sm:gap-6">
                      {answerOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleAnswerSelect(option.value)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2
                            ${answers[currentQuestion.id] === option.value
                              ? `bg-${option.color} border-${option.color}`
                              : `bg-white border-gray-300 hover:border-${option.hoverColor}`
                            }
                          `}
                          aria-label={`선택 ${option.value}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-blue-600">동의함</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
        
        {/* 진행률 표시 바 */}
        <footer className="w-full">
            <div className="bg-gray-200 h-2.5">
                <div 
                    className="bg-blue-600 h-2.5 transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </footer>
      </div>
    </Layout>
  );
}