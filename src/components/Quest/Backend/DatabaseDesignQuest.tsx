import React, { useState } from 'react';

interface DatabaseDesignQuestProps {
    onExecute: (data?: any) => void;
    isComplete: boolean;
}

const DatabaseDesignQuest: React.FC<DatabaseDesignQuestProps> = ({ onExecute, isComplete }) => {
    const [connections, setConnections] = useState<{from: string, to: string}[]>([]);

    const tables = [
        { id: 'users', name: 'Users', fields: ['id', 'email', 'password'] },
        { id: 'products', name: 'Products', fields: ['id', 'name', 'price'] },
        { id: 'orders', name: 'Orders', fields: ['id', 'user_id', 'total'] },
        { id: 'order_items', name: 'OrderItems', fields: ['id', 'order_id', 'product_id', 'quantity'] }
    ];

    const handleTableClick = (tableId: string) => {
        const lastConnection = connections[connections.length - 1];
        if (lastConnection && !lastConnection.to) {
            setConnections(prev =>
                prev.map((conn, index) =>
                    index === prev.length - 1 ? {...conn, to: tableId} : conn
                )
            );
        } else {
            setConnections(prev => [...prev, { from: tableId, to: '' }]);
        }
    };

    const handleCheckConnections = () => {
        const completeConnections = connections.filter(conn => conn.to !== '');
        onExecute(completeConnections);
    };

    const handleReset = () => {
        setConnections([]);
    };

    return (
        <div className="flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-center">테이블 간의 관계를 설정하세요</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {tables.map(table => (
                    <div
                        key={table.id}
                        onClick={() => handleTableClick(table.id)}
                        className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                        <h4 className="font-bold text-blue-800 mb-2">{table.name}</h4>
                        <div className="text-xs space-y-1">
                            {table.fields.map(field => (
                                <div key={field} className="text-gray-600">
                                    {field.includes('id') ? '🔑 ' : '📝 '}{field}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-6">
                <h4 className="font-semibold mb-2">연결된 관계:</h4>
                <div className="space-y-2 min-h-[60px] bg-gray-50 p-3 rounded">
                    {connections.filter(conn => conn.to).length === 0 ? (
                        <p className="text-gray-500 text-sm">테이블을 클릭해서 관계를 설정하세요.</p>
                    ) : (
                        connections.filter(conn => conn.to).map((conn, index) => (
                            <div key={index} className="bg-white p-2 rounded text-sm border">
                                {conn.from} ↔ {conn.to}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 하단 버튼들 */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={handleCheckConnections}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
                >
                    관계 확인
                </button>
                <button
                    onClick={handleReset}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg"
                >
                    초기화
                </button>
            </div>
        </div>
    );
};

export default DatabaseDesignQuest;