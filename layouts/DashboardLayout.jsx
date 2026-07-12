import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Header } from '@/components/navigation/Header';
import { Sidebar } from '@/components/navigation/Sidebar';
export function DashboardLayout({ children }) {
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    return (<div className="min-h-screen bg-background">
      <div className={`fixed inset-y-0 left-0 z-30 hidden border-r border-border bg-card transition-all duration-300 lg:block ${collapsed ? 'w-16' : 'w-56'}`}>
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)}/>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="left-0 top-0 h-full w-80 max-w-none translate-x-0 translate-y-0 rounded-none p-0">
          <Sidebar onNavigate={() => setOpen(false)}/>
        </DialogContent>
      </Dialog>
      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-16' : 'lg:pl-56'}`}>
        <Header onOpenMenu={() => setOpen(true)}/>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>);
}
