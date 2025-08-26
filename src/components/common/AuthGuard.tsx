'use client';

import { PropsWithChildren } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';

type Props = PropsWithChildren<{
    requireAuth?: boolean;
    redirectTo?: string;
    fallback?: React.ReactNode;
}>;

export default function AuthGuard({ children, fallback, ...opts }: Props) {
    const { isLoggedIn, isLoading } = useAuthGuard(opts);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh] text-gray-500">
                {fallback ?? '로딩 중...'}
            </div>
        );
    }
    if (opts.requireAuth !== false && !isLoggedIn) return null;
    if (opts.requireAuth === false && isLoggedIn) return null;

    return <>{children}</>;
}
