'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Sidebar } from '@/components/navigation/Sidebar';

export function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const mainRef = useRef(null);
    const pathname = usePathname();

    const closeSidebar = useCallback(() => setSidebarOpen(false), []);
    const openSidebar = useCallback(() => setSidebarOpen(true), []);
    const toggleCollapse = useCallback(() => setSidebarCollapsed((prev) => !prev), []);

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.focus();
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);

    return (
        <div className="flex h-screen overflow-hidden">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
                Skip to main content
            </a>

            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-card transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}
            >
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={toggleCollapse}
                    onNavigate={closeSidebar}
                />
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header onOpenMenu={openSidebar} />
                <main
                    id="main-content"
                    ref={mainRef}
                    tabIndex={-1}
                    className="flex-1 overflow-y-auto p-4 lg:p-6 focus:outline-none"
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
