import React, { useState, useEffect } from 'react';

interface SecurityTestQuestProps {
    onExecute: (data?: any) => void;
    isComplete: boolean;
}

const SecurityTestQuest: React.FC<SecurityTestQuestProps> = ({ onExecute, isComplete }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [attacks, setAttacks] = useState<{id: number, type: string, blocked: boolean}[]>([]);

    const attackTypes = [
        'SQL Injection: SELECT * FROM users WHERE id=1 OR 1=1',
        'XSS Attack: <script>alert("hack")</script>',
        'Password Brute Force: admin/password123',
        'CSRF Token Missing',
        'File Upload Vulnerability'
    ];

    useEffect(() => {
        if (gameStarted && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);

                // 공격 추가
                if (Math.random() < 0.3) {
                    const newAttack = {
                        id: Date.now(),
                        type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
                        blocked: false
                    };
                    setAttacks(prev => [...prev, newAttack]);

                    // 3초 후 자동으로 공격 성공 처리
                    setTimeout(() => {
                        setAttacks(current =>
                            current.map(attack =>
                                attack.id === newAttack.id && !attack.blocked
                                    ? { ...attack, blocked: false }
                                    : attack
                            )
                        );
                    }, 3000);
                }
            }, 1000);

            return () => clearInterval(timer);
        } else if (timeLeft === 0 && gameStarted) {
            setGameStarted(false);
            setGameEnded(true);
            onExecute({ score });
        }
    }, [gameStarted, timeLeft, score, onExecute]);

    const blockAttack = (attackId: number) => {
        setAttacks(prev => prev.map(attack =>
            attack.id === attackId ? { ...attack, blocked: true } : attack
        ));
        setScore(prev => prev + 10);
    };

    const startGame = () => {
        setGameStarted(true);
        setGameEnded(false);
        setScore(0);
        setTimeLeft(30);
        setAttacks([]);
    };

    const handleReset = () => {
        setGameStarted(false);
        setGameEnded(false);
        setScore(0);
        setTimeLeft(30);
        setAttacks([]);
    };

    const handleGameResult = () => {
        if (gameEnded) {
            onExecute({ score });
        }
    };

    return (
        <div className="flex flex-col">
            <div className="text-center mb-6">
                <h3 className="font-bold text-xl mb-2">보안 공격 차단 게임</h3>
                <div className="flex justify-center gap-6">
                    <div className="bg-blue-100 px-4 py-2 rounded">
                        점수: {score}
                    </div>
                    <div className="bg-red-100 px-4 py-2 rounded">
                        시간: {timeLeft}초
                    </div>
                </div>
            </div>

            <div className="mb-6 min-h-[300px]">
                {!gameStarted && !gameEnded ? (
                    <div className="text-center pt-10">
                        <p className="mb-4 text-gray-600">30초 동안 나타나는 보안 공격을 차단하세요!</p>
                    </div>
                ) : gameEnded ? (
                    <div className="text-center p-4 bg-blue-100 border border-blue-300 rounded">
                        <p className="font-bold">게임 종료! 최종 점수: {score}점</p>
                        <p className="text-sm text-gray-600 mb-4">
                            {score >= 100 ? '훌륭한 보안 실력입니다!' :
                                score >= 50 ? '괜찮은 보안 감각이네요!' :
                                    '보안 공부가 더 필요해요!'}
                        </p>
                        <button
                            onClick={startGame}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            다시 시도
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {attacks.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <p>보안 공격을 감시 중...</p>
                            </div>
                        ) : (
                            attacks.map(attack => (
                                <div
                                    key={attack.id}
                                    className={`p-3 rounded border-2 transition-all ${
                                        attack.blocked
                                            ? 'bg-green-100 border-green-300'
                                            : 'bg-red-100 border-red-300 animate-pulse'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-mono">{attack.type}</span>
                                        {!attack.blocked && (
                                            <button
                                                onClick={() => blockAttack(attack.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                                            >
                                                차단
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* 하단 버튼들 */}
            <div className="flex justify-center gap-4">
                {gameEnded ? (
                    <button
                        onClick={handleGameResult}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg">
                        결과 확인
                    </button>
                ) : (
                    <button
                        onClick={startGame}
                        disabled={gameStarted}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg">
                        {gameStarted ? '게임 진행 중...' : '게임 시작'}
                    </button>
                )}
                <button
                    onClick={handleReset}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg">
                    초기화
                </button>
            </div>
        </div>
    );
};

export default SecurityTestQuest;