# Next.js Frontend

Next.js 16 App Router 前端，提供文章瀏覽 + 登入 + TipTap 編輯器。

> 屬於 [strapi-tiptap-side](../) demo 專案的一部分。

## 快速啟動

```bash
# 1. 確認 backend 已啟動（http://localhost:1337）
cd ../backend && ./start.sh develop &

# 2. 啟動 frontend
npm install
npm run dev
# → http://localhost:3000
```

## 環境變數

`.env.local`：
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## 目錄結構

```
frontend/
├── app/
│   ├── page.tsx              # 首頁（英雄區 + 文章 grid）
│   ├── blog/[slug]/page.tsx  # 文章詳情（TipTap HTML + prose）
│   ├── category/[slug]/page.tsx  # 分類篩選
│   ├── login/page.tsx        # 登入表單
│   ├── admin/new/page.tsx    # 撰寫新文章（受保護）
│   ├── layout.tsx            # Root layout + Navbar
│   └── globals.css           # Tailwind v4 + Apple 主題
├── components/
│   ├── Navbar.tsx            # Sticky + 登入狀態 + 分類連結
│   ├── ArticleCard.tsx       # 封面 + 標題 + 摘要 + 分類 badge
│   ├── CategoryBadge.tsx     # 依 category.color 上色
│   ├── Editor.tsx            # TipTap 編輯器（11 工具列按鈕）
│   └── CoverUpload.tsx       # 封面圖拖拉上傳
├── lib/
│   ├── strapi.ts             # Strapi API 工具（fetch + 型別）
│   └── auth.ts               # JWT 工具（localStorage + cookie）
└── proxy.ts                  # 路由保護（Next.js 16 convention）
```

## 頁面

| Path | 用途 | 保護 |
|------|------|------|
| `/` | 首頁 | 公開 |
| `/blog/[slug]` | 文章詳情 | 公開 |
| `/category/[slug]` | 分類篩選 | 公開 |
| `/login` | 登入 | 公開 |
| `/admin/new` | 撰寫文章 | **需登入**（proxy.ts 保護） |

## 🌐 完整 Demo URLs（啟動後可直接瀏覽）

**本機服務**：
- Frontend：http://localhost:3000
- Backend (Strapi)：http://localhost:1337

**公開頁面**：

| URL | 頁面 |
|---|---|
| http://localhost:3000/ | 🏠 首頁（英雄區 + 文章 grid） |
| http://localhost:3000/blog/why-apple-silicon-changed-everything | 📖 文章詳情（科技：Apple Silicon） |
| http://localhost:3000/blog/less-is-more-apple-design-philosophy | 📖 文章詳情（設計：少即是多） |
| http://localhost:3000/blog/my-mac-productivity-toolkit | 📖 文章詳情（生活：Mac 工具） |
| http://localhost:3000/category/tech | 🏷 分類頁（科技） |
| http://localhost:3000/category/design | 🏷 分類頁（設計） |
| http://localhost:3000/category/life | 🏷 分類頁（生活） |
| http://localhost:3000/login | 🔑 登入頁 |

**受保護頁面**（需登入後才能進）：

| URL | 頁面 |
|---|---|
| http://localhost:3000/admin/new | ✍️ 撰寫新文章（TipTap + 封面圖上傳） |

**後端 Strapi**：

| URL | 用途 |
|---|---|
| http://localhost:1337/admin | 🛠 Strapi 管理後台 |
| http://localhost:1337/api/articles?populate[0]=cover&populate[1]=category | 📚 文章列表 JSON |
| http://localhost:1337/api/categories | 🏷 分類列表 JSON |

## 🔑 Demo 帳號（在 `/login` 頁面輸入）

```
Email    : demo@strapi.local
Password : Demo1234!
```

> 帳號由 Strapi backend 的 `src/index.ts` 自動 seed，建立後同步可用於本前端登入。

## 重要技術決策

### Next.js 16 重大變更

> ⚠️ **This is NOT the Next.js you know**
> Next.js 16 有重大破壞性變更：

- **`proxy.ts`** 取代 `middleware.ts`（檔名 + 函式 export 名都改為 `proxy`）
- **React 19** 為預設
- **Tailwind CSS v4** 使用 CSS-based config

```typescript
// proxy.ts
export function proxy(request: NextRequest) {  // 不是 middleware
  // ...
}
export const config = { matcher: ['/admin/:path*'] };
```

### Tailwind v4 設定

不再用 `tailwind.config.js`，改在 `app/globals.css` 內：

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme inline {
  --color-apple-blue: #0071e3;
  --color-apple-gray: #6e6e73;
  --color-apple-black: #1d1d1f;
  --font-sans: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}
```

### JWT 認證

JWT 同時存：
- `localStorage.strapi_jwt` — client component 讀取
- Cookie `strapi_jwt` — `proxy.ts` 在 edge runtime 讀取（middleware 無法讀 localStorage）

```typescript
// lib/auth.ts
export function setToken(jwt: string) {
  localStorage.setItem('strapi_jwt', jwt);
  document.cookie = `strapi_jwt=${jwt}; path=/; SameSite=Lax`;
}
```

### Strapi Populate 語法

Strapi 5 改為 bracket notation（**不是** Strapi 4 的逗號分隔）：

```typescript
// Strapi 4
'?populate=cover,category'

// Strapi 5
'?populate[0]=cover&populate[1]=category'
```

## 開發指令

```bash
npm run dev       # 開發模式（Turbopack）
npm run build     # 構建
npm run start     # 啟動正式版
npm run lint      # ESLint
```

## 已知限制

- **localStorage JWT**：Demo 簡化，生產環境應改 HttpOnly cookie + refresh token
- **無 RWD 行動版優化**：Desktop-first
- **無單元測試**：驗證透過 E2E 手動測試
- **TipTap 圖片用 URL 插入**：未整合 TipTap upload extension
