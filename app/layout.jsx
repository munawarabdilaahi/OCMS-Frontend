import '@/styles/index.css';

export const metadata = {
  title: 'OCMS',
  description: 'Online Campus Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">{children}</body>
    </html>
  );
}
