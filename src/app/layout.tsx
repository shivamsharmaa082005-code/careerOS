import type { Metadata } from 'next';
import './globals.css';
import { CareerStoreProvider } from '@/lib/store/careerStore';
import { Navbar } from '@/components/layout/Navbar';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'CareerOS — AI Career Readiness & Employability Platform',
  description: 'Know where you stand. Know what to do next. An evidence-based career readiness system powered by Google Gemini AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <CareerStoreProvider>
          <AppShell>
            {children}
          </AppShell>
        </CareerStoreProvider>
      </body>
    </html>
  );
}
