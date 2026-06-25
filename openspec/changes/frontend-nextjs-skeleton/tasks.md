# Tasks: frontend-nextjs-skeleton（Sub-issue 2）

## Setup
- [ ] `npx create-next-app@latest frontend --typescript --tailwind --app`
- [ ] 安裝 `@tailwindcss/typography`，設定 tailwind.config
- [ ] 建立 `frontend/.env.local`（NEXT_PUBLIC_STRAPI_URL）

## API 層
- [ ] 建立 `lib/strapi.ts`（getArticles, getArticle, getCategories, getArticlesByCategory）
- [ ] 建立 `lib/auth.ts`（login, logout, getToken, setToken, isAuthenticated）

## 路由保護
- [ ] 建立 `middleware.ts`（保護 /admin/*，未登入 redirect /login）

## Components
- [ ] 建立 `components/Navbar.tsx`（logo + 分類 + 登入/登出）
- [ ] 建立 `components/ArticleCard.tsx`（封面 + 標題 + 摘要 + 分類 badge）
- [ ] 建立 `components/CategoryBadge.tsx`（依 category.color 上色）

## 頁面
- [ ] 建立 `app/page.tsx`（首頁：英雄區 + 文章 grid）
- [ ] 建立 `app/blog/[slug]/page.tsx`（文章詳情）
- [ ] 建立 `app/category/[slug]/page.tsx`（分類篩選）
- [ ] 建立 `app/login/page.tsx`（登入表單）

## 驗證
- [ ] `npm run dev` → http://localhost:3000 顯示 3 篇文章
- [ ] 點文章 → `/blog/[slug]` 顯示詳情 + 封面
- [ ] 點分類 → `/category/[slug]` 篩選正確
- [ ] 進 `/admin/new` 未登入 → redirect `/login`
- [ ] `/login` 用 demo@strapi.local 登入成功 → 進入 `/admin/new`
- [ ] `npm run build` 通過

## 不在此 issue 範圍（後續 sub-issues）
- TipTap 編輯器 + 封面圖上傳 → Sub-issue 3
- Apple 視覺風格細修 → Sub-issue 4
