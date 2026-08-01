'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { navigationItems } from '@/lib/navigation';
import { UnauthorizedPage } from '@/features/UnauthorizedPage';

const authRoutes = new Set(['/login', '/forgot-password', '/reset-password']);

function isRouteAllowed(pathname, userRole) {
    const sorted = [...navigationItems].sort((a, b) => b.href.length - a.href.length);
    for (const item of sorted) {
        if (pathname === item.href || pathname.startsWith(item.href + '/')) {
            return item.roles.includes(userRole);
        }
    }
    return true;
}

export function ProtectedRoute({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, isHydrated, user } = useAuth();
    const isAuthRoute = authRoutes.has(pathname);

    useEffect(() => {
        if (isHydrated && !isAuthenticated && !isAuthRoute) {
            router.replace('/login');
        }
    }, [isHydrated, isAuthenticated, isAuthRoute, router]);

    if (isAuthRoute) return children;

    if (!isHydrated || !isAuthenticated) return null;

    const userRole = typeof user?.role === 'object' ? user?.role?.name : user?.role;
    const allowed = isRouteAllowed(pathname, userRole);

    if (!allowed) {
        return <UnauthorizedPage />;
    }

    return children;
}
