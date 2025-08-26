'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Layout } from '@/layout/Layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import CharacterCard from '@/components/common/CharacterCard';
import { useRouter } from 'next/navigation';
import { EXPERIENCED_JOBS } from '@/lib/data';

// Quest Components
import RequirementsQuest from '@/components/Quest/Backend/RequirementsQuest';
import DatabaseDesignQuest from '@/components/Quest/Backend/DatabaseDesignQuest';
import ApiDevelopmentQuest from '@/components/Quest/Backend/ApiDevelopmentQuest';
import SecurityTestQuest from '@/components/Quest/Backend/SecurityTestQuest';

const Icon = ({ path, className = 'w-5 h-5' }: { path: string; className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d={path}></path>
    </svg>
);

const QuestCompletionScreen = ({ onFinishExperience }: { onFinishExperience: () => void }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">다음 단계로 넘어갈건가요?</h1>
            <p className="text-lg text-gray-600 mb-12">이 캐릭터는 얼마나 재밌었나요? 원하는 만큼 하트를 채워주세요</p>
            <div className="flex items-center gap-4 mb-16">
                <span className="text-2xl font-semibold text-gray-700">재미도:</span>
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                            key={star}
                            className={`w-10 h-10 cursor-pointer transition-colors`}
                            fill={hoverRating >= star || rating >= star ? '#FF4B4B' : '#E0E0E0'}
                            viewBox="0 0 20 20"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                    ))}
                </div>
            </div>
            <div className="flex gap-6">
                <Link href="/recommendations">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 text-lg rounded-full shadow-lg transition-transform hover:scale-105">
                        다른 캐릭터 체험하기
                    </button>
                </Link>
                <button
                    onClick={onFinishExperience}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 text-lg rounded-full shadow-lg transition-transform hover:scale-105"
                >
                    체험 끝내기
                </button>
            </div>
        </div>
    );
};

const JobSelectionScreen = ({ onSubmit }: { onSubmit: (jobTitle: string) => void }) => {
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!selectedJobId) {
            alert('가장 재밌었던 직무를 선택해주세요.');
            return;
        }
        const selectedJob = EXPERIENCED_JOBS.find((job) => job.id === selectedJobId);
        if (selectedJob) onSubmit(selectedJob.title);
    };

    return (
        <div className="flex flex-col items-center justify-center text-center py-12 bg-white rounded-lg shadow-xl">
            <div className="w-full max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-12">체험했던 캐릭터 중 가장 재밌었던 직무를 선택해주세요!</h1>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-10">
                    {EXPERIENCED_JOBS.map((job) => (
                        <CharacterCard
                            key={job.id}
                            emoji={job.icon}
                            title={job.title}          // 직무명
                            subtitle={job.name}        // 캐릭터명
                            selected={selectedJobId === job.id}
                            onClick={() => setSelectedJobId(job.id)}
                        />
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!selectedJobId}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-12 text-lg rounded-full shadow-lg transition-transform hover:scale-105"
                >
                    제출하기
                </button>
            </div>
        </div>
    );
};

export default function BackendQuestPage() {
    const router = useRouter();

    const [currentQuest, setCurrentQuest] = useState(0);
    const [completedQuests, setCompletedQuests] = useState<boolean[]>([false, false, false, false]);
    const [isQuestFinished, setIsQuestFinished] = useState(false);
    const [showJobSelection, setShowJobSelection] = useState(false);

    // 공통 상태 관리
    const [isQuestComplete, setIsQuestComplete] = useState(false);
    const [executionResult, setExecutionResult] = useState<string[]>(['> 퀘스트를 시작하세요...']);

    const questStages = useMemo(
        () => [
            { name: '요구사항', status: completedQuests[0] ? '완료됨' : currentQuest === 0 ? '진행중' : '대기중', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { name: 'DB 설계', status: completedQuests[1] ? '완료됨' : currentQuest === 1 ? '진행중' : '대기중', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { name: 'API 개발', status: completedQuests[2] ? '완료됨' : currentQuest === 2 ? '진행중' : '대기중', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z' },
            { name: '보안 테스트', status: completedQuests[3] ? '완료됨' : currentQuest === 3 ? '진행중' : '대기중', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
        ],
        [completedQuests, currentQuest]
    );

    // 각 퀘스트에서 호출되는 공통 실행 핸들러
    const handleQuestExecute = useCallback((questIndex: number, data?: any) => {
        let results: string[] = [];
        let isSuccess = false;

        switch (questIndex) {
            case 0: {
                // 요구사항 선택 검증
                const correct = ['회원가입/로그인 기능', '상품 장바구니 관리', '결제 시스템 연동', '관리자 상품 관리', '주문 내역 조회'];
                isSuccess = Array.isArray(data) && correct.every((r) => data.includes(r)) && data.length === correct.length;
                results = isSuccess
                    ? ['> 요구사항 분석 중...', '✓ 핵심 기능을 모두 올바르게 식별했습니다.', '✓ 우선순위가 높은 요구사항을 정확히 파악했습니다.', '🎉 축하합니다! 요구사항 분석을 완료했습니다!']
                    : [
                        '> 요구사항 분석 중...',
                        '⌧ 오류: 일부 핵심 요구사항이 누락되었거나 불필요한 항목이 포함되었습니다.',
                        '💡 힌트: MVP(최소기능제품)에 꼭 필요한 기능들만 선택하세요. 디자인이나 부가기능은 나중에!',
                        '💡 힌트: 사용자 관리, 상품 관리, 주문 처리가 핵심입니다.'
                    ];
                break;
            }
            case 1: {
                // DB 관계 검증
                const correctConnections = [
                    { from: 'users', to: 'orders' },
                    { from: 'orders', to: 'order_items' },
                    { from: 'products', to: 'order_items' }
                ];
                isSuccess =
                    Array.isArray(data) &&
                    correctConnections.every((c) => data.some((conn: any) => (conn.from === c.from && conn.to === c.to) || (conn.from === c.to && conn.to === c.from))) &&
                    data.length === correctConnections.length;

                results = isSuccess
                    ? [
                        '> 데이터베이스 관계 검증 중...',
                        '✓ Users와 Orders 테이블이 올바르게 연결되었습니다.',
                        '✓ Orders와 OrderItems 테이블이 올바르게 연결되었습니다.',
                        '✓ Products와 OrderItems 테이블이 올바르게 연결되었습니다.',
                        '🎉 축하합니다! 데이터베이스 설계를 완료했습니다!'
                    ]
                    : [
                        '> 데이터베이스 관계 검증 중...',
                        '⌧ 오류: 데이터베이스 관계가 올바르지 않습니다.',
                        '💡 힌트: 사용자는 여러 주문을 할 수 있습니다.',
                        '💡 힌트: 하나의 주문에는 여러 상품이 포함될 수 있습니다.',
                        '💡 힌트: 외래키 관계를 확인하세요 (user_id, order_id, product_id).'
                    ];
                break;
            }
            case 2: {
                // API 블록 순서 검증
                const correctSolutionIds = ['block-1', 'block-2', 'block-7', 'block-3', 'block-4', 'block-5', 'block-6'];
                isSuccess = Array.isArray(data) && JSON.stringify(data) === JSON.stringify(correctSolutionIds);
                results = isSuccess
                    ? [
                        '> 서버 시뮬레이터 실행...',
                        '> Hong-Gildong님의 코드를 실행합니다...',
                        '✓ 모든 블록이 올바른 순서로 조립되었습니다.',
                        '✓ API 엔드포인트가 성공적으로 등록되었습니다.',
                        '✓ JWT 토큰이 안전하게 생성되었습니다.',
                        '🎉 축하합니다! 퀘스트를 성공적으로 완료했습니다!'
                    ]
                    : ['> 서버 시뮬레이터 실행...', '⌧ 오류: 블록의 순서가 맞지 않습니다.', '💡 힌트: API 요청 → 유효성 검사 → 비밀번호 암호화 → DB 저장 → 토큰 발급 → 응답 순서를 확인하세요.'];
                break;
            }
            case 3: {
                // 보안 미니게임 점수
                const score = data?.score ?? 0;
                isSuccess = score >= 50;
                results = [
                    `> 보안 테스트 완료!`,
                    `> 최종 점수: ${score}점`,
                    isSuccess ? '✓ 보안 테스트를 성공적으로 통과했습니다!' : '⌧ 보안 테스트에서 더 많은 공격을 차단해야 합니다.',
                    isSuccess ? '🎉 축하합니다! 보안 퀘스트를 완료했습니다!' : '💡 힌트: 공격 패턴을 빠르게 인식하고 차단하세요.'
                ];
                break;
            }
        }

        setExecutionResult(results);
        setIsQuestComplete(isSuccess);
    }, []);

    const handleQuestReset = useCallback(() => {
        setIsQuestComplete(false);
        setExecutionResult(['> 퀘스트를 시작하세요...']);
    }, []);

    const handleQuestComplete = useCallback(
        (questIndex: number) => {
            const next = [...completedQuests];
            next[questIndex] = true;
            setCompletedQuests(next);
            setIsQuestComplete(false);
            setExecutionResult(['> 퀘스트를 시작하세요...']);

            if (questIndex < 3) setCurrentQuest(questIndex + 1);
            else setIsQuestFinished(true);
        },
        [completedQuests]
    );

    const handleStageClick = useCallback(
        (index: number) => {
            if (index <= currentQuest || completedQuests[index]) {
                setCurrentQuest(index);
                handleQuestReset();
            }
        },
        [completedQuests, currentQuest, handleQuestReset]
    );

    const handleJobSelectionSubmit = useCallback(
        (jobTitle: string) => {
            alert(`'${jobTitle}'을(를) 선택했습니다. 이제 잠재된 직무 성향을 알아보기 위한 질문을 시작하겠습니다.`);
            router.push('/recommendations/surveypage');
        },
        [router]
    );

    // 현재 스텝 렌더
    const renderCurrentQuest = useCallback(() => {
        const common = { onExecute: (data?: any) => handleQuestExecute(currentQuest, data), isComplete: isQuestComplete };

        switch (currentQuest) {
            case 0:
                return <RequirementsQuest {...common} />;
            case 1:
                return <DatabaseDesignQuest {...common} />;
            case 2:
                return <ApiDevelopmentQuest {...common} />;
            case 3:
                return <SecurityTestQuest {...common} />;
            default:
                return <RequirementsQuest {...common} />;
        }
    }, [currentQuest, handleQuestExecute, isQuestComplete]);

    return (
        <ProtectedRoute requiresProfile={true}>
            <Layout>
                <div className="bg-gray-50 p-4 sm:p-8 min-h-screen font-sans">
                    <div className="max-w-7xl mx-auto">
                        {showJobSelection ? (
                            <JobSelectionScreen onSubmit={handleJobSelectionSubmit} />
                        ) : isQuestFinished ? (
                            <QuestCompletionScreen onFinishExperience={() => setShowJobSelection(true)} />
                        ) : (
                            <>
                                {/* 헤더 */}
                                <header className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                                        직무 체험 퀘스트{' '}
                                        <span className="text-sm font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-full">백엔드 개발자</span>
                                    </h1>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 rounded-full p-1">
                                            <span className="text-4xl">🐻</span>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="font-bold text-gray-800">든든한 곰</p>
                                            <p className="text-sm text-gray-500">백엔드 개발자</p>
                                        </div>
                                    </div>
                                </header>

                                {/* 소개 박스 */}
                                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8 text-green-800">
                                    <p className="font-bold text-xl mb-2">안녕! 백엔드의 든든한 곰이야! 👋</p>
                                    <p className="text-base mb-4">오늘은 실제 서버 개발자가 하는 일을 체험해보자! 4단계 퀘스트를 완료해보세요.</p>
                                    <div className="bg-green-100 rounded-lg p-3 text-sm">
                                        <span className="font-bold">💡 곰의 조언:</span> 백엔드는 눈에 안 보이지만 모든 걸 떠받치는 기둥이야. 안정성이 최우선!
                                    </div>
                                </div>

                                {/* 퀘스트 진행 단계 */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {questStages.map((stage, index) => (
                                        <div
                                            key={stage.name}
                                            onClick={() => handleStageClick(index)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                stage.status === '진행중'
                                                    ? 'bg-yellow-50 border-yellow-400'
                                                    : stage.status === '완료됨'
                                                        ? 'bg-green-50 border-green-400'
                                                        : 'bg-white border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-full ${
                                                        stage.status === '진행중'
                                                            ? 'bg-yellow-100 text-yellow-600'
                                                            : stage.status === '완료됨'
                                                                ? 'bg-green-100 text-green-600'
                                                                : 'bg-gray-100 text-gray-500'
                                                    }`}
                                                >
                                                    <Icon path={stage.icon} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{stage.name}</p>
                                                    <p
                                                        className={`text-sm font-medium ${
                                                            stage.status === '완료됨' ? 'text-green-600' : stage.status === '진행중' ? 'text-yellow-600' : 'text-gray-500'
                                                        }`}
                                                    >
                                                        {stage.status}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 공통 퀘스트 레이아웃 */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* 왼쪽+중앙: 퀘스트 게임 영역 */}
                                        <div className="w-full lg:w-2/3">{renderCurrentQuest()}</div>

                                        {/* 오른쪽: 공통 실행 결과 */}
                                        <div className="w-full lg:w-1/3">
                                            <div className="bg-gray-900 rounded-xl text-white text-xs p-4 font-mono h-[400px] overflow-y-auto">
                                                <h3 className="font-bold text-gray-400 text-sm mb-2">실행 결과</h3>
                                                {executionResult.map((line, index) => (
                                                    <p
                                                        key={index}
                                                        className={`${line.includes('🎉') || line.includes('✓') ? 'text-green-400' : ''} ${
                                                            line.includes('⌧') || line.includes('💡') ? 'text-yellow-400' : ''
                                                        }`}
                                                    >
                                                        {line}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 공통 완료 버튼 */}
                                    <div
                                        className={`flex justify-center mt-10 transition-opacity duration-500 ${
                                            isQuestComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                        }`}
                                    >
                                        {isQuestComplete && (
                                            <button
                                                onClick={() => handleQuestComplete(currentQuest)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 text-lg rounded-full shadow-lg transition-transform hover:scale-105"
                                            >
                                                퀘스트 완료하기
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
