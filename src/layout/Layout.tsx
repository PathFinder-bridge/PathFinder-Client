import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    showFooter?: boolean;
    className?: string;
    variant?: 'default' | 'auth' | 'landing';
}

export const Layout: React.FC<LayoutProps> = ({
                                                  children,
                                                  showHeader = true,
                                                  showFooter = true,
                                                  className = "",
                                                  variant = 'default'
                                              }) => {
    const getBackgroundClass = () => {
        switch (variant) {
            case 'auth':
                return 'min-h-screen bg-gray-50';
            case 'landing':
                return 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50';
            default:
                return 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50';
        }
    };

    return (
        <div className={`${getBackgroundClass()} flex flex-col ${className}`}>
            {showHeader && <Header />}
            <main className="flex-1">
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
};