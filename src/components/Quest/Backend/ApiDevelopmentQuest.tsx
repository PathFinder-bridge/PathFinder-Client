import React, { useState, useMemo } from 'react';
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
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CodeBlock {
    id: string;
    title: string;
    content: string;
    category: 'API' | '보안' | 'DB';
}

interface ApiDevelopmentQuestProps {
    onExecute: (data?: any) => void;
    isComplete: boolean;
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

const ApiDevelopmentQuest: React.FC<ApiDevelopmentQuestProps> = ({ onExecute, isComplete }) => {
    const [blockLists, setBlockLists] = useState<{ available: CodeBlock[], solution: CodeBlock[] }>({
        available: ALL_CODE_BLOCKS,
        solution: [],
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    );

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
        onExecute(currentSolutionIds);
    };

    const handleReset = () => {
        setBlockLists({available: ALL_CODE_BLOCKS, solution: []});
    };

    const progressSteps = [
        {name: "API 엔드포인트 설정", done: blockLists.solution.some(b => b.id === 'block-1')},
        {name: "입력값 검증", done: blockLists.solution.some(b => b.id === 'block-7')},
        {name: "인증 로직 구현", done: blockLists.solution.some(b => b.id === 'block-5')},
        {name: "데이터베이스 연동", done: blockLists.solution.some(b => b.id === 'block-4')},
        {name: "응답 처리", done: blockLists.solution.some(b => b.id === 'block-6')},
    ];

    return (
        <div className="flex flex-col">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="flex flex-col lg:flex-row gap-5 mb-6">
                    {/* 왼쪽: 사용 가능 블록 목록 */}
                    <aside id="available" className="w-full lg:w-1/3 bg-gray-800 text-white rounded-lg p-4 space-y-4">
                        <SortableContext items={blockLists.available.map(b => b.id)} strategy={verticalListSortingStrategy}>
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

                    {/* 오른쪽: 조립 영역 및 진행상황 */}
                    <div className="w-full lg:w-2/3 flex flex-col">
                        <main className="bg-gray-900 rounded-xl shadow-inner flex-col flex-grow">
                            <div className="flex-shrink-0 p-3 text-sm font-semibold text-gray-300 border-b border-gray-700">
                                회원가입 API
                            </div>
                            <div id="solution" className="p-4 space-y-2 flex-grow min-h-[350px]">
                                <SortableContext items={blockLists.solution.map(b => b.id)} strategy={verticalListSortingStrategy}>
                                    {blockLists.solution.map(block => (
                                        <SortableCodeBlock key={block.id} id={block.id}
                                                           title={block.title}
                                                           content={block.content}
                                                           className="bg-gray-700"
                                                           onRemove={handleRemoveBlock}/>
                                    ))}
                                </SortableContext>
                                {blockLists.solution.length === 0 && (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <p>왼쪽 블록을 이곳으로 드래그하세요.</p>
                                    </div>
                                )}
                            </div>
                        </main>

                        {/* 진행상황 표시 */}
                        <div className="mt-4 bg-white rounded-lg p-4 border">
                            <h3 className="font-bold text-sm mb-3 text-gray-700">진행상황</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {progressSteps.map(step => (
                                    <li key={step.name}
                                        className={`flex items-center ${step.done ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                                        <span
                                            className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center text-xs ${step.done ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                                            {step.done && '✓'}
                                        </span>
                                        {step.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </DndContext>

            {/* 하단 버튼들 */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={handleCodeExecution}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg">
                    코드 실행
                </button>
                <button
                    onClick={handleReset}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg">
                    초기화
                </button>
            </div>
        </div>
    );
};

export default ApiDevelopmentQuest;