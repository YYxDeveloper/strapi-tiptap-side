'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/new';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(identifier, password);
      router.push(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
          Email 或帳號
        </label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          autoComplete="username"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
          密碼
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-[#0071e3] hover:bg-[#0051a3] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
      >
        {loading ? '登入中...' : '登入'}
      </button>
    </form>
  );
}

function LoginFormFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-gray-200 rounded-lg" />
      <div className="h-10 bg-gray-200 rounded-lg" />
      <div className="h-10 bg-gray-300 rounded-lg" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-[#1d1d1f] mb-2 text-center">登入</h1>
        <p className="text-sm text-[#6e6e73] mb-8 text-center">
          使用 Strapi 帳號登入以撰寫文章
        </p>

        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 text-xs text-center text-[#6e6e73]">
          Demo 帳號：demo@strapi.local / Demo1234!
        </div>
      </div>
    </div>
  );
}
