import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../lib/LanguageContext';
import { MainLayout } from '../components/MainLayout';

export const metadata: Metadata = {
  title: "To'rtko'l ixtisoslashtirilgan maktabi | Rasmiy veb-platformasi",
  description: "Qoraqalpog'iston Respublikasi To'rtko'l tumani ixtisoslashtirilgan maktabining rasmiy veb-sayti va platformasi.",
  keywords: ["To'rtko'l maktabi", "ixtisoslashtirilgan maktab", "aniq fanlar", "tabiiy fanlar", "piima", "qabul"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className="min-h-screen flex flex-col bg-[#F7FAFF] text-[#0F172A] antialiased">
        <LanguageProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
