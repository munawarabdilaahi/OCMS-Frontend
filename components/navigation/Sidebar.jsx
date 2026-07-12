import { NavLink } from '@/lib/router';
import { GraduationCap, ShieldCheck, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { useAuth } from '@/hooks/useAuth';
import { navigationItems } from '@/lib/navigation';

export function Sidebar({ collapsed = false, onToggleCollapse, onNavigate }) {
    const { user } = useAuth();

    const items = navigationItems || [];

    const userRole = typeof user?.role === 'object' ? user?.role?.name : user?.role;

    return (
        <aside className="flex h-full flex-col bg-card">
          <div className="relative flex h-16 items-center border-b">
            <div className={cn("flex h-full items-center gap-3", collapsed ? "w-full justify-center px-2" : "px-4")}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/15 text-emerald-700 dark:text-teal-200">
                <GraduationCap className="size-5"/>
              </span>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">OCMS</p>
                  <p className="truncate text-xs text-muted-foreground">Campus Suite</p>
                </div>
              )}
            </div>
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-md"
                onClick={onToggleCollapse}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed ? <PanelLeftOpen className="size-3.5"/> : <PanelLeftClose className="size-3.5"/>}
              </Button>
            )}
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-2">
            {items && items.length > 0 ? (
              items.map((item) => (
                <NavLink 
                  key={item.href} 
                  to={item.href} 
                  onClick={onNavigate} 
                  title={item.title}
                  className={({ isActive }) => cn(
                    'flex h-10 items-center gap-3 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground', 
                    collapsed ? 'justify-center px-2' : 'px-3',
                    isActive && 'bg-secondary text-foreground shadow-sm'
                  )}
                >
                  {item.icon && <item.icon className="size-4 shrink-0"/>}
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </NavLink>
              ))
            ) : (
              <p className="text-xs text-center text-muted-foreground p-4">Menu-yo ma helin...</p>
            )}
          </nav>
        </aside>
    );
}