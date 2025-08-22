// PathFinder-Client/src/pages/job-recommendations/quest.tsx

'use client';

import React, {useState, useMemo} from 'react';
import Link from 'next/link';
import {Layout} from '@/layout/Layout';
import {ProtectedRoute} from '@/components/common/ProtectedRoute';
import {useRouter} from 'next/navigation'; // 1. useRouter 가져오기

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const Icon = ({path, className = "w-5 h-5"}: { path: string, className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d={path}></path>
    </svg>
);

interface CodeBlock {
    id: string;
    title: string;
    content: string;
    category: 'API' | '보안' | 'DB';
}

const ALL_CODE_BLOCKS: CodeBlock[] = [
    {id: 'block-1', title: '회원가입 API', content: "app.post('/api/signup', ...)", category: 'API'},
    {id: 'block-2', title: '사용자 입력값 처리', content: "const { email, password } = req.body;", category: 'API'},
    {id: 'block-7', title: '입력값 유효성 검사', content: "if (!email || !password) { ... }", category: 'API'},
    {
        id: 'block-3',
        title: '비밀번호 암호화',
        content: "const hashedPassword = await bcrypt.hash(password, 10);",
        category: '보안'
    },
    {id: 'block-4', title: '새 사용자 생성', content: "const newUser = await db.user.create(...);", category: 'DB'},
    {
        id: 'block-5',
        title: 'JWT 토큰 생성',
        content: "const token = jwt.sign({ userId: newUser.id }, 'secret');",
        category: '보안'
    },
    {id: 'block-6', title: '성공 응답 전송', content: "res.status(201).json({ token });", category: 'API'},
];

const CORRECT_SOLUTION_IDS = ['block-1', 'block-2', 'block-7', 'block-3', 'block-4', 'block-5', 'block-6'];

function SortableCodeBlock({id, title, content, className, onRemove}: {
    id: string,
    title: string,
    content: string,
    className: string,
    onRemove?: (id: string) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}
             className={`p-3 rounded-md shadow cursor-grab text-sm transition-colors ${className}`}>
            <div className="flex items-start justify-between w-full">
                <div className="flex-grow">
                    <div className="text-xs text-gray-300 mb-1 flex items-center">
                        <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                        </svg>
                        {title}
                    </div>
                    <div className="font-mono text-white pl-1">{content}</div>
                </div>
                {onRemove && (
                    <button onClick={() => onRemove(id)}
                            className="text-gray-400 hover:text-white font-bold text-xl p-1 -mt-2 -mr-1">
                        ×
                    </button>
                )}
            </div>
        </div>
    );
}

// ▼▼▼▼▼ QuestCompletionScreen 컴포넌트에 onFinishExperience 프롭 추가 ▼▼▼▼▼
const QuestCompletionScreen = ({onFinishExperience}: { onFinishExperience: () => void }) => {
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
                            fill={(hoverRating >= star || rating >= star) ? '#FF4B4B' : '#E0E0E0'}
                            viewBox="0 0 20 20"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            <path
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                        </svg>
                    ))}
                </div>
            </div>
            <div className="flex gap-6">
                <Link href="/job-recommendations">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 text-lg rounded-full shadow-lg transition-transform hover:scale-105">
                        다른 캐릭터 체험하기
                    </button>
                </Link>
                {/* '체험 끝내기' 버튼 클릭 시 onFinishExperience 함수를 호출하도록 수정 */}
                <button onClick={onFinishExperience}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 text-lg rounded-full shadow-lg transition-transform hover:scale-105">
                    체험 끝내기
                </button>
            </div>
        </div>
    );
};

// ▼▼▼▼▼▼▼▼▼▼ [NEW] 가장 재밌었던 직무 선택을 위한 컴포넌트 추가 ▼▼▼▼▼▼▼▼▼▼

// 체험했던 직무 데이터 (실제로는 API나 상위 상태에서 받아와야 합니다)
const EXPERIENCED_JOBS = [
    {id: 'ai-engineer', name: '똑똑한 부엉이', title: 'AI 엔지니어', icon: '🦉'},
    {id: 'design-expert', name: '영리한 여우', title: '디자인 전문가', icon: '🦊'},
    {id: 'software-engineer', name: '꼼꼼한 코알라', title: '소프트웨어 엔지니어', icon: '🐨'},
    {id: 'backend-developer', name: '든든한 곰', title: '백엔드 개발자', icon: '🐻'},
    {id: 'frontend-developer', name: '정열적인 고양이', title: '프론트엔드 개발자', icon: '🐱'},
    {id: 'data-engineer', name: '호기심 많은 사자', title: '데이터 엔지니어', icon: '🦁'},
    {id: 'data-analyst', name: '기억력 좋은 코끼리', title: '데이터 분석가', icon: '🐘'},
    {id: 'solution-architect', name: '실력 있는 독수리', title: '솔루션 아키텍트', icon: '🦅'},
    {id: 'data-scientist', name: '분석가 펭귄', title: '데이터 과학자', icon: '🐧'},
    {id: 'iot-developer', name: '빠른 다람쥐', title: 'IoT 개발자', icon: '🐿️'},
    {id: 'product-manager', name: '손재주 좋은 너구리', title: '프로덕트 매니저', icon: '🦝'},
    {id: 'ai-researcher', name: '배고픈 용', title: '기술연구 엔지니어', icon: '🐲'},
    {id: 'computer-vision-engineer', name: '예리한 사슴', title: '컴퓨터비전 엔지니어', icon: '🦌'},
];


const JobSelectionScreen = ({onSubmit}: { onSubmit: (jobTitle: string) => void }) => {
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!selectedJobId) {
            alert('가장 재밌었던 직무를 선택해주세요.');
            return;
        }
        const selectedJob = EXPERIENCED_JOBS.find(job => job.id === selectedJobId);
        if (selectedJob) {
            onSubmit(selectedJob.title); // 직무명(텍스트)을 상위 컴포넌트로 전달
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-center py-10 bg-white rounded-lg shadow-xl">
            <div className="w-full max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">체험했던 캐릭터 중 가장 재밌었던 직무를 선택해주세요</h1>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-10">
                    {EXPERIENCED_JOBS.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => setSelectedJobId(job.id)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedJobId === job.id ? 'bg-blue-500 shadow-lg ring-4 ring-blue-300' : 'bg-purple-400 hover:bg-purple-500 shadow-md'}`}
                        >
                            <div className="text-5xl mb-2">{job.icon}</div>
                            <div
                                className={`font-bold text-sm ${selectedJobId === job.id ? 'text-white' : 'text-purple-100'}`}>{job.name}</div>
                            <div
                                className={`text-xs ${selectedJobId === job.id ? 'text-blue-100' : 'text-purple-200'}`}>{job.title}</div>
                        </div>
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

// ▲▲▲▲▲▲▲▲▲▲ [NEW] 컴포넌트 추가 끝 ▲▲▲▲▲▲▲▲▲▲

// 메인 퀘스트 페이지 컴포넌트
export default function BackendQuestPage() {
    const router = useRouter(); // 2. router 선언
    const [blockLists, setBlockLists] = useState<{ available: CodeBlock[], solution: CodeBlock[] }>({
        available: ALL_CODE_BLOCKS,
        solution: [],
    });
    const [isQuestComplete, setIsQuestComplete] = useState(false);
    const [executionResult, setExecutionResult] = useState<string[]>(['> 실행 대기 중...']);
    const [isQuestFinished, setIsQuestFinished] = useState(false);

    // ▼▼▼ [NEW] 직무 선택 화면 전환을 위한 상태 추가 ▼▼▼
    const [showJobSelection, setShowJobSelection] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    );

    // ... (기존 questStages, categorizedAvailableBlocks, handleDragEnd, handleRemoveBlock 등은 변경 없음)
    const questStages = [
        {name: "요구사항", status: "완료됨", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"},
        {name: "DB 설계", status: "완료됨", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"},
        {
            name: "API 개발",
            status: "진행중",
            icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
        },
        {name: "보안 테스트", status: "대기중", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"}
    ];

    const categorizedAvailableBlocks = useMemo(() => {
        const categoryOrder = {'API': 1, '보안': 2, 'DB': 3};
        const sortedAvailable = [...blockLists.available].sort((a, b) => categoryOrder[a.category] - categoryOrder[b.category]);

        return {
            'API 엔드포인트': sortedAvailable.filter(b => b.category === 'API'),
            '인증 & 보안': sortedAvailable.filter(b => b.category === '보안'),
            '데이터베이스': sortedAvailable.filter(b => b.category === 'DB'),
        };
    }, [blockLists.available]);

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over) return;
        const activeId = String(active.id);
        setBlockLists(prev => {
            const newAvailable = [...prev.available];
            const newSolution = [...prev.solution];
            let draggedItem: CodeBlock | undefined;
            const activeContainer = newAvailable.some(item => item.id === activeId) ? 'available' : 'solution';

            if (activeContainer === 'available') {
                const index = newAvailable.findIndex(item => item.id === activeId);
                draggedItem = newAvailable.splice(index, 1)[0];
            } else {
                const index = newSolution.findIndex(item => item.id === activeId);
                draggedItem = newSolution.splice(index, 1)[0];
            }

            if (!draggedItem) return prev;
            const overId = String(over.id);
            const overContainer = newAvailable.some(item => item.id === overId) || over.id === 'available' ? 'available' : 'solution';

            if (overContainer === 'available') {
                const overIndex = newAvailable.findIndex(item => item.id === overId);
                newAvailable.splice(overIndex >= 0 ? overIndex : newAvailable.length, 0, draggedItem);
            } else {
                const overIndex = newSolution.findIndex(item => item.id === overId);
                newSolution.splice(overIndex >= 0 ? overIndex : newSolution.length, 0, draggedItem);
            }
            return {available: newAvailable, solution: newSolution};
        });
    };

    const handleRemoveBlock = (blockId: string) => {
        setBlockLists(prev => {
            const newSolution = [...prev.solution];
            const blockIndex = newSolution.findIndex(b => b.id === blockId);
            if (blockIndex === -1) return prev;
            const [removedBlock] = newSolution.splice(blockIndex, 1);
            const newAvailable = [...prev.available, removedBlock];
            return {available: newAvailable, solution: newSolution};
        });
    };

    const handleCodeExecution = () => {
        const currentSolutionIds = blockLists.solution.map(block => block.id);
        if (JSON.stringify(currentSolutionIds) === JSON.stringify(CORRECT_SOLUTION_IDS)) {
            setExecutionResult(['> 서버 시뮬레이터 실행...', '> Hong-Gildong님의 코드를 실행합니다...', '✓ 모든 블록이 올바른 순서로 조립되었습니다.', '✓ API 엔드포인트가 성공적으로 등록되었습니다.', '✓ JWT 토큰이 안전하게 생성되었습니다.', '🎉 축하합니다! 퀘스트를 성공적으로 완료했습니다!']);
            setIsQuestComplete(true);
        } else {
            setExecutionResult(['> 서버 시뮬레이터 실행...', '❌ 오류: 블록의 순서가 맞지 않습니다.', '💡 힌트: API 요청을 받은 후, 데이터 유효성을 검사하고, 비밀번호를 암호화해야 합니다.']);
            setIsQuestComplete(false);
        }
    };

    const handleReset = () => {
        setBlockLists({available: ALL_CODE_BLOCKS, solution: []});
        setIsQuestComplete(false);
        setExecutionResult(['> 실행 대기 중...']);
    };

    const progressSteps = [
        {name: "API 엔드포인트 설정", done: blockLists.solution.some(b => b.id === 'block-1')},
        {name: "입력값 검증", done: blockLists.solution.some(b => b.id === 'block-7')},
        {name: "인증 로직 구현", done: blockLists.solution.some(b => b.id === 'block-5')},
        {name: "데이터베이스 연동", done: blockLists.solution.some(b => b.id === 'block-4')},
        {name: "응답 처리", done: blockLists.solution.some(b => b.id === 'block-6')},
    ];

    // ▼▼▼ [NEW] 직무 선택 제출 처리 함수 ▼▼▼
    const handleJobSelectionSubmit = (jobTitle: string) => {
        console.log("선택된 가장 재밌었던 직무:", jobTitle);
        // 여기에 딥러닝 모델에 input으로 전송하는 로직을 추가할 수 있습니다.
        alert(`'${jobTitle}'을(를) 선택했습니다. 이제 잠재된 직무 성향을 알아보기 위한 질문을 시작하겠습니다.`);

        // 3. 설문 페이지로 이동시키는 코드 추가
        router.push('/job-recommendations/surveypage');
    };

    return (
        <ProtectedRoute requiresProfile={true}>
            <Layout>
                <div className="bg-gray-100 p-4 sm:p-8 min-h-screen font-sans">
                    <div className="max-w-7xl mx-auto">
                        {/* ▼▼▼ 3단계 화면 전환 로직으로 수정 ▼▼▼ */}
                        {showJobSelection ? (
                            <JobSelectionScreen onSubmit={handleJobSelectionSubmit}/>
                        ) : isQuestFinished ? (
                            <QuestCompletionScreen onFinishExperience={() => setShowJobSelection(true)}/>
                        ) : (
                            <>
                                {/* 헤더: 퀘스트 제목 및 유저 정보 */}
                                <header className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                                        직무 체험 퀘스트 <span
                                        className="text-sm font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-full">백엔드 개발자</span>
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
                                {/* ...기존 퀘스트 UI... */}
                                {/* 소개 및 조언 박스 */}
                                <div
                                    className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8 text-green-800">
                                    <p className="font-bold text-xl mb-2">안녕! 백엔드의 든든한 곰이야! 👋</p>
                                    <p className="text-base mb-4">오늘은 실제 서버 개발자가 하는 일을 체험해보자! 사용자 인증 API를 만드는 미션이야.</p>
                                    <div className="bg-green-100 rounded-lg p-3 text-sm">
                                        <span className="font-bold">💡 곰의 조언:</span> 백엔드는 눈에 안 보이지만 모든 걸 떠받치는 기둥이야. 안정성이
                                        최우선!
                                    </div>
                                </div>
                                {/* 퀘스트 진행 단계 */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {questStages.map(stage => (
                                        <div key={stage.name}
                                             className={`p-4 rounded-xl border-2 ${stage.status === '진행중' ? 'bg-yellow-50 border-yellow-400' : 'bg-white'}`}>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-full ${stage.status === '진행중' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Icon path={stage.icon}/>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{stage.name}</p>
                                                    <p className={`text-sm font-medium ${stage.status === '완료됨' ? 'text-green-600' : stage.status === '진행중' ? 'text-yellow-600' : 'text-gray-500'}`}>{stage.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <DndContext sensors={sensors} collisionDetection={closestCenter}
                                            onDragEnd={handleDragEnd}>
                                    <div className="bg-white rounded-2xl shadow-lg p-6">
                                        <div className="flex flex-col lg:flex-row gap-5">
                                            {/* 왼쪽: 사용 가능 블록 목록 */}
                                            <aside id="available"
                                                   className="w-full lg:w-1/4 bg-gray-800 text-white rounded-lg p-4 space-y-4">
                                                <SortableContext items={blockLists.available.map(b => b.id)}
                                                                 strategy={verticalListSortingStrategy}>
                                                    {Object.entries(categorizedAvailableBlocks).map(([category, blocks]) => (
                                                        <div key={category}>
                                                            <h3 className="font-bold text-gray-400 text-sm mb-2">{category}</h3>
                                                            <div className="space-y-2">
                                                                {blocks.map(block => {
                                                                    const colors = {
                                                                        API: 'bg-blue-600 hover:bg-blue-700',
                                                                        보안: 'bg-purple-600 hover:bg-purple-700',
                                                                        DB: 'bg-green-600 hover:bg-green-700'
                                                                    };
                                                                    return <SortableCodeBlock key={block.id}
                                                                                              id={block.id}
                                                                                              title={block.title}
                                                                                              content={block.content}
                                                                                              className={`${colors[block.category]}`}/>;
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </SortableContext>
                                            </aside>

                                            {/* 중앙: 조립 영역 및 제어 버튼 */}
                                            <div className="w-full lg:w-1/2 flex flex-col">
                                                <main
                                                    className="bg-gray-900 rounded-xl shadow-inner flex-col flex-grow">
                                                    <div
                                                        className="flex-shrink-0 p-3 text-sm font-semibold text-gray-300 border-b border-gray-700">회원가입
                                                        API
                                                    </div>
                                                    <div id="solution"
                                                         className="p-4 space-y-2 flex-grow min-h-[350px]">
                                                        <SortableContext items={blockLists.solution.map(b => b.id)}
                                                                         strategy={verticalListSortingStrategy}>
                                                            {blockLists.solution.map(block => (
                                                                <SortableCodeBlock key={block.id} id={block.id}
                                                                                   title={block.title}
                                                                                   content={block.content}
                                                                                   className="bg-gray-700"
                                                                                   onRemove={handleRemoveBlock}/>
                                                            ))}
                                                        </SortableContext>
                                                        {blockLists.solution.length === 0 && (
                                                            <div
                                                                className="flex items-center justify-center h-full text-gray-500">
                                                                <p>왼쪽 블록을 이곳으로 드래그하세요.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </main>
                                                <div className="flex justify-center items-center gap-4 pt-4">
                                                    <button onClick={handleCodeExecution}
                                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg text-sm">코드
                                                        실행
                                                    </button>
                                                    <button onClick={handleReset}
                                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg text-sm">초기화
                                                    </button>
                                                </div>
                                            </div>

                                            {/* 오른쪽: 실행 결과 및 진행상황 */}
                                            <aside className="w-full lg:w-1/4">
                                                <div
                                                    className="bg-gray-900 rounded-xl text-white text-xs p-4 font-mono h-[250px] overflow-y-auto">
                                                    <h3 className="font-bold text-gray-400 text-sm mb-2">실행 결과</h3>
                                                    {executionResult.map((line, index) => (
                                                        <p key={index}
                                                           className={`${line.includes('🎉') || line.includes('✓') ? 'text-green-400' : ''} ${line.includes('❌') || line.includes('💡') ? 'text-yellow-400' : ''}`}>{line}</p>
                                                    ))}
                                                </div>
                                                <div className="mt-4 bg-white rounded-lg p-4 border">
                                                    <h3 className="font-bold text-sm mb-3 text-gray-700">진행상황</h3>
                                                    <ul className="space-y-2 text-sm text-gray-600">
                                                        {progressSteps.map(step => (
                                                            <li key={step.name}
                                                                className={`flex items-center ${step.done ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                                                                <span
                                                                    className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center ${step.done ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                                                                    {step.done && '✓'}
                                                                </span>
                                                                {step.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </aside>
                                        </div>
                                    </div>
                                </DndContext>
                                {/* 하단 완료 버튼 */}
                                <div
                                    className={`flex justify-end mt-6 transition-opacity duration-500 ${isQuestComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                    {isQuestComplete && (
                                        <button onClick={() => setIsQuestFinished(true)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 text-lg rounded-full shadow-lg transition-transform hover:scale-105">
                                            퀘스트 완료하기
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}