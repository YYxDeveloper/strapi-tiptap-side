# 部落格 Demo — Strapi + Next.js + TipTap

> Apple 風格部落格展示專案，串接 Headless CMS + 富文字編輯器完整流程。

[![Strapi](https://img.shields.io/badge/Strapi-5.49-4945FF)](https://strapi.io)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000)](https://nextjs.org)
[![TipTap](https://img.shields.io/badge/TipTap-3.27-000000)](https://tiptap.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)](https://www.typescriptlang.org)

## 專案概述

向主管展示 Headless CMS + 富文字編輯器的完整整合能力，以 Apple 官網設計風格為標竿。

| 層面 | 技術 |
|------|------|
| **CMS** | Strapi 5.49 (TypeScript + SQLite) |
| **前端** | Next.js 16.2 (App Router + Turbopack) |
| **編輯器** | TipTap 2/3 + StarterKit + 5 extensions |
| **樣式** | Tailwind CSS v4 + @tailwindcss/typography |
| **語言** | TypeScript 5 |

## 專案結構

```
strapi-tiptap-side/
├── backend/                 # Strapi 5 CMS
│   ├── src/
│   │   ├── api/
│   │   │   ├── article/     # Article content type
│   │   │   └── category/    # Category content type
│   │   ├── extensions/
│   │   └── index.ts         # Bootstrap: 權限 + seed 資料
│   ├── config/              # database / plugins / server
│   ├── start.sh             # 一鍵啟動腳本
│   └── .env.example
├── frontend/                # Next.js 16 App Router
│   ├── app/
│   │   ├── page.tsx         # 首頁（英雄區 + 文章 grid）
│   │   ├── blog/[slug]/     # 文章詳情
│   │   ├── category/[slug]/ # 分類篩選
│   │   ├── login/           # 登入
│   │   ├── admin/new/       # 撰寫新文章（受保護）
│   │   ├── layout.tsx       # Root layout + Navbar
│   │   └── globals.css      # Tailwind v4 + Apple 主題
│   ├── components/
│   │   ├── Navbar.tsx       # Sticky + 登入狀態
│   │   ├── ArticleCard.tsx
│   │   ├── CategoryBadge.tsx
│   │   ├── Editor.tsx       # TipTap 編輯器
│   │   └── CoverUpload.tsx  # 封面圖上傳
│   ├── lib/
│   │   ├── strapi.ts        # API 工具
│   │   └── auth.ts          # JWT 工具
│   ├── proxy.ts             # 路由保護（Next.js 16 新 convention）
│   └── .env.local
└── openspec/                # OpenSpec artifacts（spec-driven 流程）
    └── changes/
        ├── strapi-tiptap-blog-demo/        # 整體 master
        ├── frontend-nextjs-skeleton/       # Sub-issue 2
        └── editor-tiptap-cover-upload/     # Sub-issue 3
```

## 快速啟動

### 1. Strapi Backend

```bash
cd backend
./start.sh develop        # 自動建 .env、建 .tmp、跑 predevelop hooks
# → http://localhost:1337/admin
```

### 2. Next.js Frontend

```bash
cd frontend
npm run dev
# → http://localhost:3000
```

### 🔑 Demo 帳號（自動 seed，登入 Strapi 與前端 `/login` 都用此組）

```
Email    : demo@strapi.local
Password : Demo1234!
```

> 帳號由 `backend/src/index.ts` 的 `seedDemoUser()` 在 Strapi 首次啟動時自動建立。

## 完整 Demo URLs

| 服務 | URL |
|------|-----|
| 🏠 **首頁** | http://localhost:3000/ |
| 📖 **文章詳情** | http://localhost:3000/blog/why-apple-silicon-changed-everything |
| 🏷 **分類頁** | http://localhost:3000/category/tech |
| 🔑 **登入頁** | http://localhost:3000/login |
| ✍️ **撰寫文章** | http://localhost:3000/admin/new（需登入） |
| 🛠 **Strapi Admin** | http://localhost:1337/admin |
| 📚 **REST API** | http://localhost:1337/api/articles?populate[0]=cover&populate[1]=category |

## 給主管的 Demo 流程

1. 開首頁 → 看 Apple 風格 + 3 篇 Demo 文章
2. 點分類 badge → `/category/[slug]` 看篩選
3. 點任一文章 → `/blog/[slug]` 看 TipTap HTML 渲染
4. Navbar「撰寫文章」→ 自動導向 `/login`
5. 輸入 demo 帳號 → 跳轉 `/admin/new`
6. 填標題/分類/摘要 + 試 TipTap 11 個按鈕
7. （選）拖圖片到封面區 → 上傳
8. 點「發佈」→ 自動回首頁，新文章在最上面

## Content Types（Strapi）

### Article

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `title` | String | ✅ | 文章標題 |
| `slug` | UID (title) | ✅ | URL 識別碼（自動生成） |
| `content` | Text | ✅ | TipTap HTML 字串 |
| `excerpt` | Text | ❌ | 摘要（首頁卡片用） |
| `cover` | Media (single) | ❌ | 封面圖片 |
| `category` | Relation → Category | ❌ | 多對一關聯 |

> ⚠️ `content` 用 `text` 類型儲存 HTML（不是 Strapi 5 的 `richtext` blocks editor）

### Category

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `name` | String | ✅ | 分類名稱 |
| `slug` | UID (name) | ✅ | URL 識別碼 |
| `color` | String (hex regex) | ❌ | 標籤顏色 |

## 角色權限

| 角色 | Article | Category | Upload |
|------|---------|----------|--------|
| **Public** | find, findOne | find, findOne | ❌ |
| **Authenticated** | find, findOne, **create** | find, findOne | ✅ |

> 公開註冊（`POST /api/auth/local/register`）**已關閉**，由 `backend/src/index.ts` 的 `disablePublicRegistration()` 處理。
> 若要重新開放，設環境變數 `ENABLE_PUBLIC_REGISTER=true`。

## Next.js 16 重點注意事項

> ⚠️ **This is NOT the Next.js you know**
> Next.js 16 有重大破壞性變更，與訓練資料中的 Next.js 不同：

- **`proxy.ts`** 取代 `middleware.ts`（新 convention，函式 export 名也改為 `proxy`）
- **Tailwind CSS v4** 使用 CSS-based config（`@theme inline` + `@plugin`），不再用 `tailwind.config.js`
- **React 19** 為預設

## 開發指令

### Backend

```bash
cd backend
./start.sh develop      # 開發模式（watch）
./start.sh start        # 正式模式
./start.sh build        # 構建 admin panel
npm run strapi          # Strapi CLI
```

### Frontend

```bash
cd frontend
npm run dev             # 開發（含 Turbopack）
npm run build           # 構建
npm run start           # 啟動正式版
npm run lint            # ESLint
```

## OpenSpec 工作流

本專案使用 [OpenSpec](https://github.com/Fission-AI/OpenSpec) 進行 spec-driven 開發：

- `strapi-tiptap-blog-demo` — 整體 master change（涵蓋 4 個 sub-issues）
- `frontend-nextjs-skeleton` — Sub-issue 2 已歸檔 ✅
- `editor-tiptap-cover-upload` — Sub-issue 3 已歸檔 ✅

每個 change 含 `proposal.md` / `specs/*.md` / `design.md` / `tasks.md`。

## 已知限制（Demo 性質）

- **JWT 存 localStorage + 非 HttpOnly cookie**：簡化做法，**不適用生產環境**（生產應用 HttpOnly + refresh token）
- **SQLite**：Demo 環境，無需 PostgreSQL。生產建議換 PostgreSQL
- **無測試框架**：未引入 Jest/Vitest，verify 透過 E2E 手動測試 + `npm run build`
- **TipTap 圖片插入用 URL**：未整合 TipTap upload extension（避免額外 API 整合複雜度）

## License

MIT — Demo 專案，僅供展示用途。
