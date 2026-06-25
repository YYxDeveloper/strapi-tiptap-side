# Proposal: Next.js 前端骨架（Sub-issue 2）

## 背景

`strapi-tiptap-blog-demo` demo 的第二階段：在已完成 Strapi 後端（Issue #1）之上，建立 Next.js 14 App Router 前端，串接 Strapi REST API，提供：
- 文章列表 / 詳情 / 分類篩選（公開頁面）
- 登入頁 + JWT 認證（cookie + localStorage）
- 路由保護（middleware）

## 範圍

| 包含 | 不包含 |
|------|--------|
| Next.js 14 App Router 專案 | TipTap 編輯器（Sub-issue 3）|
| Tailwind CSS + typography | 封面圖拖拉上傳（Sub-issue 3）|
| `lib/strapi.ts` API 工具 | Apple 視覺風格細修（Sub-issue 4）|
| `lib/auth.ts` JWT 工具 | 註冊功能（已關閉公開註冊）|
| `middleware.ts` 保護 `/admin/*` | 多語系、RWD 行動版優化 |
| 5 個公開頁面 | 文章編輯、刪除 |

## 技術決策

- **Next.js 14 App Router**：Server Components 直接 fetch Strapi，無需 client API route
- **JWT in localStorage + cookie**：middleware 讀 cookie、client 用 localStorage
- **Server-side data fetch**：在 page.tsx 直接呼叫 `getArticles()`，避免 client waterfall

## 成功標準

- 首頁 `/` 顯示 3 篇 Demo 文章卡片
- `/blog/[slug]` 文章詳情頁正確渲染 TipTap HTML
- `/category/[slug]` 分類頁篩選正確
- `/login` 登入後導向 `/admin/new`
- middleware 保護 `/admin/*`：未登入自動 redirect `/login`
- Apple 風格先以基本樣式呈現，細修在 Sub-issue 4

## 相關資源

- 父 change：`openspec/changes/strapi-tiptap-blog-demo/`（specs/auth.md, design.md）
- 後端 API：http://localhost:1337
- 對應 Issue：#2（Sub-issue 2: frontend skeleton）
