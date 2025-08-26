import React, {useState} from 'react';

interface RequirementsQuestProps {
    onExecute: (data?: any) => void;
    isComplete: boolean;
}

const RequirementsQuest: React.FC<RequirementsQuestProps> = ({ onExecute, isComplete }) => {
    const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);

    const clientMessages = [
        "우리 쇼핑몰에 회원가입 기능이 필요해요.",
        "사용자가 로그인할 수 있어야 하고요.",
        "상품을 장바구니에 담을 수 있어야 해요.",
        "결제 기능도 꼭 필요합니다.",
        "관리자가 상품을 등록할 수 있어야 해요.",
        "주문 내역을 볼 수 있으면 좋겠어요.",
        "예쁜 디자인으로 만들어주세요.",
        "모바일에서도 잘 보여야 해요."
    ];

    const handleRequirementToggle = (requirement: string) => {
        setSelectedRequirements(prev =>
            prev.includes(requirement)
                ? prev.filter(r => r !== requirement)
                : [...prev, requirement]
        );
    };

    const handleSubmit = () => {
        onExecute(selectedRequirements);
    };

    const handleReset = () => {
        setSelectedRequirements([]);
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
                {/* 왼쪽: 클라이언트 대화 */}
                <div className="w-full lg:w-1/2 bg-blue-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-4">클라이언트와의 대화</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {clientMessages.map((message, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                                <p className="text-sm">{message}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 오른쪽: 요구사항 체크리스트 */}
                <div className="w-full lg:w-1/2">
                    <h3 className="font-bold text-lg mb-4">핵심 요구사항을 선택하세요</h3>
                    <div className="space-y-3">
                        {[
                            "회원가입/로그인 기능",
                            "상품 장바구니 관리",
                            "결제 시스템 연동",
                            "관리자 상품 관리",
                            "주문 내역 조회",
                            "예쁜 UI 디자인",
                            "모바일 반응형",
                            "소셜 로그인 연동"
                        ].map(requirement => (
                            <label key={requirement} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedRequirements.includes(requirement)}
                                    onChange={() => handleRequirementToggle(requirement)}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">{requirement}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* 하단 버튼들 */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg">
                    요구사항 분석
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

export default RequirementsQuest;