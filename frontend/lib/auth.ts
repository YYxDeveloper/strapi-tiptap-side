'use client';

const TOKEN_KEY = 'strapi_jwt';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

function setCookie(jwt: string): void {
  // 1 year expiry, root path. Not HttpOnly (intentional, demo).
  // For production: use HttpOnly cookie set by server + refresh token.
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(jwt)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

function clearCookie(): void {
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function setToken(jwt: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, jwt);
  setCookie(jwt);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  clearCookie();
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export interface LoginResponse {
  jwt: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

export async function login(identifier: string, password: string): Promise<string> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error?.message || `Login failed: ${res.status}`);
  }

  const data: LoginResponse = await res.json();
  setToken(data.jwt);
  return data.jwt;
}
