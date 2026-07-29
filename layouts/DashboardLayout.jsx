'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Sidebar } from '@/components/navigation/Sidebar';

export function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const mainRef = useRef(null);
    const pathname = usePathname();

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.focus();
        }
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex h-screen overflow-hidden">
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-card transition-transform duration-200 lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}
            >
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
                    onNavigate={() => setSidebarOpen(false)}
                />
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header onOpenMenu={() => setSidebarOpen(true)} />
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
