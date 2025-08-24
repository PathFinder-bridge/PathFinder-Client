'use client';

import React, { useState } from 'react';
import { Layout } from '@/layout/Layout';
import { useRouter } from 'next/navigation';
import { surveyQuestions } from '@/lib/data';
import { SurveyAnswers } from '@/lib/types';

const answerOptions = [
    { value: -2, color: 'red-500', hoverColor: 'red-400', label: '매우 동의하지 않음' },
    { value: -1, color: 'red-400', hoverColor: 'red-300', label: '동의하지 않음' },
    { value: 0, color: 'gray-400', hoverColor: 'gray-500', label: '보통' },
    { value: 1, color: 'blue-400', hoverColor: 'blue-500', label: '동의함' },
    { value: 2, color: 'blue-500', hoverColor: 'blue-600', label: '매우 동의함' },
];

export default function SurveyPage() {
    const router = useRouter();
    const [answers, setAnswers] = useState<SurveyAnswers>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const currentQuestion = surveyQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === surveyQuestions.length - 1;
    const progressPercentage = (currentQuestionIndex / surveyQuestions.length) * 100;

    const handleAnswerSelect = (value: number) => {
        const newAnswers = { ...answers, [currentQuestion.id]: value };
        setAnswers(newAnswers);

        if (isLastQuestion) {
            handleSurveyComplete(newAnswers);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleSurveyComplete = (finalAnswers: SurveyAnswers) => {
        console.log('설문 완료:', finalAnswers);
        const answersParam = JSON.stringify(finalAnswers);
        router.push(`/recommendations/skill_page?answers=${encodeURIComponent(answersParam)}`);
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col justify-between min-h-screen bg-white">
                <div className="w-full max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <SurveyHeader
                        currentIndex={currentQuestionIndex}
                        totalQuestions={surveyQuestions.length}
                    />

                    <main>
                        <QuestionCard
                            question={currentQuestion}
                            selectedAnswer={answers[currentQuestion.id]}
                            onAnswerSelect={handleAnswerSelect}
                        />

                        <NavigationButtons
                            onPrevious={handlePrevious}
                            canGoPrevious={currentQuestionIndex > 0}
                            isLastQuestion={isLastQuestion}
                        />
                    </main>
                </div>

                <ProgressBar percentage={progressPercentage} />
            </div>
        </Layout>
    );
}

interface SurveyHeaderProps {
    currentIndex: number;
    totalQuestions: number;
}

function SurveyHeader({ currentIndex, totalQuestions }: SurveyHeaderProps) {
    return (
        <header className="mb-12">
            <h1 className="text-3xl font-bold text-gray-800">직무 추천을 시작하겠습니다!</h1>
            <p className="mt-2 text-lg text-gray-600">
                각 문항에 대해 본인이 좋아하는 정도를 선택해주세요.
            </p>
            <p className="mt-1 text-sm text-gray-500">
                진행률: {currentIndex + 1} / {totalQuestions}
            </p>
        </header>
    );
}

interface QuestionCardProps {
    question: { id: number; text: string };
    selectedAnswer?: number;
    onAnswerSelect: (value: number) => void;
}

function QuestionCard({ question, selectedAnswer, onAnswerSelect }: QuestionCardProps) {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-xl">🤖</div>
                <span className="text-lg font-semibold text-blue-800">패파봇</span>
            </div>

            <p className="text-2xl font-medium text-gray-700 leading-relaxed mb-10">
                {question.id}. {question.text}
            </p>

            <AnswerScale
                selectedAnswer={selectedAnswer}
                onAnswerSelect={onAnswerSelect}
            />
        </div>
    );
}

interface AnswerScaleProps {
    selectedAnswer?: number;
    onAnswerSelect: (value: number) => void;
}

function AnswerScale({ selectedAnswer, onAnswerSelect }: AnswerScaleProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-600">동의하지 않음</span>
                <div className="flex items-center gap-4 sm:gap-6">
                    {answerOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => onAnswerSelect(option.value)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                selectedAnswer === option.value
                                    ? `bg-${option.color} border-${option.color} scale-110`
                                    : `bg-white border-gray-300 hover:border-${option.hoverColor}`
                            }`}
                            aria-label={option.label}
                            title={option.label}
                        />
                    ))}
                </div>
                <span className="text-sm font-medium text-blue-600">동의함</span>
            </div>

            {/* 선택된 답변 표시 */}
            {selectedAnswer !== undefined && (
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        선택: {answerOptions.find(opt => opt.value === selectedAnswer)?.label}
                    </p>
                </div>
            )}
        </div>
    );
}

interface NavigationButtonsProps {
    onPrevious: () => void;
    canGoPrevious: boolean;
    isLastQuestion: boolean;
}

function NavigationButtons({ onPrevious, canGoPrevious, isLastQuestion }: NavigationButtonsProps) {
    return (
        <div className="flex justify-between mt-8">
            <button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    canGoPrevious
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
                이전
            </button>

            <div className="text-sm text-gray-500">
                {isLastQuestion ? '마지막 질문입니다' : '답변을 선택하면 자동으로 다음 질문으로 넘어갑니다'}
            </div>
        </div>
    );
}

interface ProgressBarProps {
    percentage: number;
}

function ProgressBar({ percentage }: ProgressBarProps) {
    return (
        <footer className="w-full">
            <div className="bg-gray-200 h-2.5">
                <div
                    className="bg-blue-600 h-2.5 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </footer>
    );
}