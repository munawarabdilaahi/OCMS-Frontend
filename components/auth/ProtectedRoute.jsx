'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { navigationItems } from '@/lib/navigation';
import { UnauthorizedPage } from '@/features/UnauthorizedPage';
import { PageLoader } from '@/components/common/PageLoader';

const authRoutes = new Set(['/login', '/forgot-password', '/reset-password']);

function isRouteAllowed(pathname, userRole, canAny) {
    const sorted = [...navigationItems].sort((a, b) => b.href.length - a.href.length);
    for (const item of sorted) {
        if (pathname === item.href || pathname.startsWith(item.href + '/')) {
            if (item.roles && item.roles.length > 0 && !item.roles.includes(userRole)) {
                return false;
            }
            if (item.permissions && item.permissions.length > 0) {
                return canAny(item.permissions);
            }
            return true;
        }
    }
    return true;
}

export function ProtectedRoute({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, isHydrated, user, canAny } = useAuth();
    const isAuthRoute = authRoutes.has(pathname);

    useEffect(() => {
        if (isHydrated && !isAuthenticated && !isAuthRoute) {
            router.replace('/login');
        }
    }, [isHydrated, isAuthenticated, isAuthRoute, router]);

    if (isAuthRoute) return children;

    if (!isHydrated || !isAuthenticated) return <PageLoader />;

    const userRole = typeof user?.role === 'object' ? user?.role?.name : user?.role;
    const allowed = isRouteAllowed(pathname, userRole, canAny);

    if (!allowed) {
        return <UnauthorizedPage />;
    }

    return children;
}
