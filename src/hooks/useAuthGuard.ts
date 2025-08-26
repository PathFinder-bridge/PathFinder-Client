'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

type Options = {
    requireAuth?: boolean;
    redirectTo?: string;
};

export function useAuthGuard({ requireAuth = true, redirectTo = '/login' }: Options = {}) {
    const router = useRouter();
    const { isLoggedIn, isLoading } = useAuth();

    useEffect(() => {
        if (isLoading) return;
        if (requireAuth && !isLoggedIn) router.push(redirectTo);
        if (!requireAuth && isLoggedIn) router.push(redirectTo);
    }, [isLoading, isLoggedIn, requireAuth, redirectTo, router]);

    return { isLoggedIn, isLoading };
}
