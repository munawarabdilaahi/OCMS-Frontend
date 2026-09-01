'use client';
import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageLoader } from '@/components/common/PageLoader';
import { matchRoute } from '@/lib/routes';
import { Login } from '@/features/auth/Login';
import { ForgotPassword } from '@/features/auth/ForgotPassword';
import { ResetPassword } from '@/features/auth/ResetPassword';
import { NotFoundPage } from '@/features/NotFoundPage';

function AppContent() {
    const pathname = usePathname() || '/';

    if (pathname === '/login') return <AuthLayout><Login /></AuthLayout>;
    if (pathname === '/forgot-password') return <AuthLayout><ForgotPassword /></AuthLayout>;
    if (pathname === '/reset-password') return <AuthLayout><ResetPassword /></AuthLayout>;

    const Component = matchRoute(pathname);

    return (
        <DashboardLayout>
            <Suspense fallback={<PageLoader />}>
                {Component ? <Component /> : <NotFoundPage />}
            </Suspense>
        </DashboardLayout>
    );
}

export function AppShell() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ProtectedRoute>
                    <AppContent />
                </ProtectedRoute>
                <Toaster />
            </AuthProvider>
        </ThemeProvider>
    );
}
