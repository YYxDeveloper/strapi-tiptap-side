# Tasks: strapi-tiptap-blog-demo

## Sub-issue 1：backend — Strapi 後端建置 + Demo 資料

- [ ] `npx create-strapi-app@latest backend --quickstart`
- [ ] 建立 Category content type（name, slug, color）
- [ ] 建立 Article content type（title, slug, content, excerpt, cover, category）
- [ ] 設定 Public 角色權限（articles: find/findOne, categories: find/findOne）
- [ ] 設定 Authenticated 角色權限（articles: create, upload: upload）
- [ ] 新增 3 個分類（科技/設計/生活 + color）
- [ ] 透過 Strapi Admin 建立 3 篇 Demo 文章（含封面圖、分類）
- [ ] 驗證 `GET /api/articles?populate=cover,category` 回傳正確

## Sub-issue 2：frontend — Next.js 骨架 + 認證 + 分類頁

- [ ] `npx create-next-app@latest frontend --typescript --tailwind --app`
- [ ] 安裝 `@tailwindcss/typography`，設定 tailwind.config
- [ ] 建立 `frontend/.env.local`（NEXT_PUBLIC_STRAPI_URL）
- [ ] 建立 `lib/strapi.ts`（getArticles, getArticle, getCategories, getArticlesByCategory）
- [ ] 建立 `lib/auth.ts`（login, logout, getToken, isAuthenticated）
- [ ] 建立 `middleware.ts`（保護 /admin/*，redirect 到 /login）
- [ ] 建立 `components/Navbar.tsx`
- [ ] 建立 `components/ArticleCard.tsx`
- [ ] 建立 `components/CategoryBadge.tsx`
- [ ] 建立首頁 `app/page.tsx`（英雄區 + 文章卡片 grid）
- [ ] 建立文章詳情頁 `app/blog/[slug]/page.tsx`
- [ ] 建立分類頁 `app/category/[slug]/page.tsx`
- [ ] 建立登入頁 `app/login/page.tsx`

## Sub-issue 3：editor — TipTap 編輯器 + 封面圖上傳

- [ ] 安裝 TipTap 套件（react, starter-kit, link, image, placeholder, character-count）
- [ ] 建立 `components/Editor.tsx`（含工具列 11 個按鈕）
- [ ] 建立 `components/CoverUpload.tsx`（拖拉上傳 + 預覽）
- [ ] 建立 `app/admin/new/page.tsx`（標題/分類/摘要/封面/編輯器 + 發佈按鈕）
- [ ] 整合發佈流程：上傳封面圖 → POST /api/articles → redirect 首頁

## Sub-issue 4：design — Apple 視覺風格全站打磨

- [ ] 設定 Tailwind extend（colors, fontFamily, borderRadius）
- [ ] 首頁英雄區（全寬封面圖 + overlay + 大標題）
- [ ] 文章卡片 hover 動畫（scale + shadow）
- [ ] 分類 badge 顏色系統（依 category.color 動態）
- [ ] 文章詳情頁 prose 排版（@tailwindcss/typography 客製化）
- [ ] 登入頁極簡卡片 UI
- [ ] TipTap 工具列 Apple 風格（active 狀態、focus ring）
- [ ] Navbar sticky + blur 背景效果
- [ ] Footer（極簡，版權資訊）
- [ ] 全站 font-family 設定（SF Pro / -apple-system）
