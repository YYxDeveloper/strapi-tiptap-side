# Spec: 認證系統

## 登入流程

```
1. 使用者在 /login 輸入 email + password
2. POST /api/auth/local → { jwt, user }
3. localStorage.setItem('strapi_jwt', jwt)
4. redirect → /admin/new
```

## 登出流程
```
localStorage.removeItem('strapi_jwt')
redirect → /
```

## 路由保護（middleware.ts）

保護路徑：`/admin/*`

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 從 cookie 讀取 token（middleware 無法讀 localStorage，改用 cookie）
  const token = request.cookies.get('strapi_jwt')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

> 注意：middleware 只能讀 cookie，不能讀 localStorage。
> 登入時同時 setItem localStorage 和 setCookie('strapi_jwt', jwt)。

## lib/auth.ts 介面

```typescript
export const login = async (email: string, password: string): Promise<string>
export const logout = (): void
export const getToken = (): string | null
export const isAuthenticated = (): boolean
```

## 安全注意事項（Demo）

- JWT 存 localStorage + cookie（非 HttpOnly），Demo 用，非生產建議
- Cookie 無 expiry，關閉瀏覽器後仍存在，需手動登出
- 生產環境應改用 HttpOnly Cookie + refresh token
