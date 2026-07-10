import { NavLink } from '@/lib/router';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/cn';
import { useAuth } from '@/hooks/useAuth';
import { navigationItems } from '@/lib/navigation';
import { useState, useEffect } from 'react';

export function Sidebar({ onNavigate }) {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 1. Halkaan waxaan si toos ah u qaadanaynaa dhamaan menu-yada (navigationItems) 
    // si aan u dawayno dhibka filter-ka hortaagan.
    const items = navigationItems || [];

    const userRole = typeof user?.role === 'object' ? user?.role?.name : user?.role;

    if (!mounted) {
        return <div className="w-64 h-full bg-card" />;
    }

    return (
        <aside className="flex h-full flex-col bg-card">
          <div className="flex h-16 items-center gap-3 px-4">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-emerald-700 dark:text-teal-200">
              <GraduationCap className="size-5"/>
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">OCMS</p>
              <p className="truncate text-xs text-muted-foreground">Campus Suite</p>
            </div>
          </div>
          <Separator />
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {/* Hubi in items ay jiraan ka hor intaanan map gareyn */}
            {items && items.length > 0 ? (
              items.map((item) => (
                <NavLink 
                  key={item.href} 
                  to={item.href} 
                  onClick={onNavigate} 
                  className={({ isActive }) => cn(
                    'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground', 
                    isActive && 'bg-secondary text-foreground shadow-sm'
                  )}
                >
                  {item.icon && <item.icon className="size-4"/>}
                  <span className="truncate">{item.title}</span>
                </NavLink>
              ))
            ) : (
              <p className="text-xs text-center text-muted-foreground p-4">Menu-yo ma helin...</p>
            )}
          </nav>
          <div className="border-t p-4">
            <div className="rounded-lg border bg-secondary/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="size-4 text-emerald-700 dark:text-emerald-300"/>
                  Access
                </p>
                <Badge variant="secondary">{userRole || 'ADMIN'}</Badge>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">Navigation loaded directly without filters.</p>
            </div>
          </div>
        </aside>
    );
}