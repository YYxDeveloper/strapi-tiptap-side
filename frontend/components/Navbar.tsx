'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/auth';
import type { Category } from '@/lib/strapi';

interface NavbarProps {
  categories: Category[];
}

export default function Navbar({ categories }: NavbarProps) {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthed(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logout();
    setAuthed(false);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-[#1d1d1f] text-lg">
          部落格 Demo
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="px-3 py-1.5 text-sm text-[#1d1d1f] hover:text-[#0071e3] rounded-md hover:bg-gray-100 transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {mounted && authed ? (
            <>
              <Link
                href="/admin/new"
                className="px-3 py-1.5 text-sm font-medium text-white bg-[#0071e3] hover:bg-[#0051a3] rounded-md transition-colors"
              >
                撰寫文章
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm text-[#6e6e73] hover:text-[#1d1d1f] rounded-md hover:bg-gray-100 transition-colors"
              >
                登出
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm font-medium text-[#0071e3] hover:bg-blue-50 rounded-md transition-colors"
            >
              登入
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
