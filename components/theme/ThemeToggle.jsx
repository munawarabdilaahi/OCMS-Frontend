import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    return (<Button type="button" variant="ghost" size="icon" aria-label="Toggle theme" title="Toggle theme" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      {isDark ? <Sun /> : <Moon />}
    </Button>);
}
