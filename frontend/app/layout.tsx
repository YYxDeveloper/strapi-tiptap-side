import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { getCategories } from '@/lib/strapi';

export const metadata: Metadata = {
  title: '部落格 Demo',
  description: 'Apple 風格部落格 - Strapi + Next.js + TipTap',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    categories = await getCategories();
  } catch (err) {
    // Strapi may not be running during build; render empty nav.
    console.error('Failed to load categories for Navbar:', err);
  }

  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-[#1d1d1f]">
        <Navbar categories={categories} />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 py-6 text-center text-sm text-[#6e6e73]">
          © 2026 部落格 Demo. Strapi + Next.js + TipTap.
        </footer>
      </body>
    </html>
  );
}
