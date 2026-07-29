import '@/styles/index.css';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SkipToContent } from '@/components/common/SkipToContent';

export const metadata = {
  title: 'OCMS',
  description: 'Online Campus Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <SkipToContent />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
