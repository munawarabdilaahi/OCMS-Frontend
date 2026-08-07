import '@/styles/index.css';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SkipToContent } from '@/components/common/SkipToContent';

export const metadata = {
  title: 'OCMS',
  description: 'Online Campus Management System',
};

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('ocms_theme') || 'system';
      var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch(e) {}
  })()
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <SkipToContent />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
