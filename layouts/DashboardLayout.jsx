'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const mainRef = useRef(null);
    const pathname = usePathname();

    const closeSidebar = useCallback(() => setSidebarOpen(false), []);
    const toggleCollapse = useCallback(() => setSidebarCollapsed((prev) => !prev), []);

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.focus();
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);

    return (
        <div className="flex h-screen overflow-hidden">
            <aside className={`hidden flex-col border-r bg-card lg:flex ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={toggleCollapse}
                    onNavigate={closeSidebar}
                />
            </aside>

            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="w-64 p-0">
                    <Sidebar
                        collapsed={false}
                        onToggleCollapse={null}
                        onNavigate={closeSidebar}
                    />
                </SheetContent>
            </Sheet>

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
