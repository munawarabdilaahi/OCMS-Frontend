'use client';
import { useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '@/components/theme/theme-context';

function getInitialTheme() {
    if (typeof window === 'undefined') return 'system';
    return window.localStorage.getItem('ocms_theme') || 'system';
}

function getIsDark(theme) {
    if (typeof window === 'undefined') return false;
    return theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.toggle('dark', getIsDark(theme));
        window.localStorage.setItem('ocms_theme', theme);
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme }), [theme]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
