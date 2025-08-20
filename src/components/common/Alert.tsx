'use client';

import {useEffect, useRef, useState} from 'react';

interface AlertProps {
    type: 'error' | 'success' | 'warning' | 'info';
    message: string;
    onClose: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
    className?: string;
}

const alertStyles = {
    error: {
        container: 'bg-red-100 border-red-400 text-red-700',
        icon: (
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"/>
            </svg>
        ),
        closeButtonColor: 'text-red-700 hover:text-red-900'
    },
    success: {
        container: 'bg-green-100 border-green-400 text-green-700',
        icon: (
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"/>
            </svg>
        ),
        closeButtonColor: 'text-green-700 hover:text-green-900'
    },
    warning: {
        container: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        icon: (
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"/>
            </svg>
        ),
        closeButtonColor: 'text-yellow-700 hover:text-yellow-900'
    },
    info: {
        container: 'bg-blue-100 border-blue-400 text-blue-700',
        icon: (
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"/>
            </svg>
        ),
        closeButtonColor: 'text-blue-700 hover:text-blue-900'
    }
};

export const Alert: React.FC<AlertProps> = ({
                                                type,
                                                message,
                                                onClose,
                                                autoClose = true,
                                                autoCloseDelay = 5000,
                                                className = ''
                                            }) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const style = alertStyles[type];

    useEffect(() => {
        if (autoClose) {
            timerRef.current = setTimeout(() => {
                onClose();
            }, autoCloseDelay);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [autoClose, autoCloseDelay, onClose]);

    const handleClose = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        onClose();
    };

    return (
        <div className={`mb-4 p-3 border rounded relative ${style.container} ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {style.icon}
                    <span>{message}</span>
                </div>
                <button
                    onClick={handleClose}
                    className={`${style.closeButtonColor} ml-2 hover:opacity-75 transition-opacity`}
                    aria-label="알림 닫기"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

// useAlert 훅 - 알림 상태 관리를 쉽게 하기 위한 커스텀 훅
export const useAlert = () => {
    const [alerts, setAlerts] = useState<Array<{
        id: string;
        type: 'error' | 'success' | 'warning' | 'info';
        message: string;
    }>>([]);

    const showAlert = (type: 'error' | 'success' | 'warning' | 'info', message: string) => {
        const id = Date.now().toString();
        setAlerts(prev => [...prev, {id, type, message}]);
    };

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const clearAllAlerts = () => {
        setAlerts([]);
    };

    return {
        alerts,
        showAlert,
        removeAlert,
        clearAllAlerts,
        showError: (message: string) => showAlert('error', message),
        showSuccess: (message: string) => showAlert('success', message),
        showWarning: (message: string) => showAlert('warning', message),
        showInfo: (message: string) => showAlert('info', message),
    };
};