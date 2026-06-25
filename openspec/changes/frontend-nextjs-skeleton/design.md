# Design: Next.js 前端骨架架構

## 資料流（Server Components 為主）

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                     │
│  ┌──────────────────┐                                        │
│  │  /  (page.tsx)   │── Server Component ──┐                │
│  └──────────────────┘                       │                │
│  ┌──────────────────┐                       │                │
│  │  /blog/[slug]    │── Server Component ──┤                │
│  └──────────────────┘                       │                │
│                                            ▼                │
│                                   ┌────────────────┐         │
│                                   │  lib/strapi.ts │         │
│                                   │  (fetch)       │         │
│                                   └────────┬───────┘         │
└────────────────────────────────────────────┼────────────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │  Strapi REST API     │
                                  │  localhost:1337      │
                                  └──────────────────────┘
```

## 認證資料流

```
Login Flow:
  /login (client)  ──POST /api/auth/local──>  Strapi
       │                                          │
       │  ← { jwt, user }                        │
       ▼                                          │
  setToken(jwt):                                  │
    - localStorage.setItem('strapi_jwt', jwt)    │
    - document.cookie = `strapi_jwt=${jwt}`      │
  router.push('/admin/new')                       │

Protected Route Check (middleware):
  Browser → /admin/new
       │
       ▼
  Next.js middleware.ts
       │  read cookie 'strapi_jwt'
       ├─ exists → allow
       └─ missing → redirect /login
```

## 為何不用 client-side fetch

- Server Component 直接 fetch Strapi → 資料隨 HTML 一起送到瀏覽器
- 無 client-side waterfall
- SEO 友善（首屏直接有內容）
- Strapi 與 Next.js 都在 localhost 跨域，CORS 需在 Strapi config 設定

## 已知技術債（Sub-issue 4 處理）

- Apple 風格細修（顏色、字型、圓角、陰影）
- Navbar sticky + blur
- 卡片 hover 動畫
- 詳情頁 prose 客製化
