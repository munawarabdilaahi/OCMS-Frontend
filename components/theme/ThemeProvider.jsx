import { useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '@/components/theme/theme-context';
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined')
            return 'system';
        return window.localStorage.getItem('ocms_theme') || 'system';
    });
    useEffect(() => {
        const root = window.document.documentElement;
        const isDark = theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        root.classList.toggle('dark', isDark);
        window.localStorage.setItem('ocms_theme', theme);
    }, [theme]);
    const value = useMemo(() => ({ theme, setTheme }), [theme]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
