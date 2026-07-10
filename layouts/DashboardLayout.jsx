import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Header } from '@/components/navigation/Header';
import { Sidebar } from '@/components/navigation/Sidebar';
export function DashboardLayout({ children }) {
    const [open, setOpen] = useState(false);
    return (<div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 hidden w-72 border-r lg:block">
        <Sidebar />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="left-0 top-0 h-full w-80 max-w-none translate-x-0 translate-y-0 rounded-none p-0">
          <Sidebar onNavigate={() => setOpen(false)}/>
        </DialogContent>
      </Dialog>
      <div className="lg:pl-72">
        <Header onOpenMenu={() => setOpen(true)}/>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>);
}
