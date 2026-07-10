import { Bell, Menu, Search } from 'lucide-react';
import { Link } from '@/lib/router';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
export function Header({ onOpenMenu }) {
    const { user, logout } = useAuth();
    const initials = user?.name?.slice(0, 2).toUpperCase() || 'OC';
    return (<header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-6">
      <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMenu}>
        <Menu />
        <span className="sr-only">Open navigation</span>
      </Button>

      <div className="min-w-0">
        <p className="hidden text-sm font-medium text-muted-foreground md:block">Online Campus Management System</p>
        <p className="truncate text-sm font-semibold md:hidden">OCMS</p>
      </div>

      <div className="relative hidden w-full max-w-md sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
        <Input className="pl-9" placeholder="Search students, courses, invoices..."/>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" aria-label="Notifications" title="Notifications" onClick={() => toast.info('No unread notifications right now.')}>
          <Bell />
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" className="h-10 gap-3 px-2">
              <Avatar className="size-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-left text-sm md:block">
                <span className="block font-medium leading-none">{user?.name}</span>
                <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="h-5 px-1.5">
                    {user?.role}
                  </Badge>
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/settings">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">Account settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={logout}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>);
}
