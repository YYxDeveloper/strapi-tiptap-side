# strapi-tiptap-side

Apple 風格部落格 Demo：Next.js 前端 + Strapi 後端 + TipTap 富文字編輯器。
用於向主管展示 Headless CMS + 富文字編輯 + 登入 + 封面圖上傳 + 分類功能。

---

## 專案結構

```
strapi-tiptap-side/
├── frontend/          # Next.js 14 (App Router)
│   ├── app/
│   │   ├── page.tsx                  # 首頁：文章列表（Apple 大圖風格）
│   │   ├── blog/[slug]/page.tsx      # 文章詳情頁
│   │   ├── category/[slug]/page.tsx  # 分類篩選頁
│   │   ├── login/page.tsx            # 登入頁
│   │   └── admin/
│   │       └── new/page.tsx          # 新增文章（TipTap + 封面圖上傳）
│   ├── components/
│   │   ├── Editor.tsx                # TipTap 編輯器元件
│   │   ├── CoverUpload.tsx           # 封面圖上傳元件
│   │   ├── ArticleCard.tsx           # 文章卡片
│   │   ├── CategoryBadge.tsx         # 分類標籤
│   │   └── Navbar.tsx                # 全站導航（含登入狀態）
│   ├── lib/
│   │   ├── strapi.ts                 # API 工具函式
│   │   └── auth.ts                   # 登入 / JWT 工具函式
│   └── middleware.ts                 # 保護 /admin/* 路由（未登入導向 /login）
└── backend/           # Strapi 5
    └── src/api/
        ├── article/                  # Article content type
        └── category/                 # Category content type
```

---

## 技術棧

| 層面        | 技術                                                |
|-----------|---------------------------------------------------|
| 前端框架      | Next.js 14 (App Router)                           |
| 富文字編輯器    | TipTap 2 (StarterKit + Image + Link + Placeholder)|
| 後端 CMS    | Strapi 5                                          |
| 樣式        | Tailwind CSS v3 + @tailwindcss/typography (prose) |
| API 溝通    | Strapi REST API                                   |
| 認證        | Strapi Users & Permissions（JWT Token）             |
| 圖片上傳      | Strapi Upload API（`/api/upload`）                 |
| 開發語言      | TypeScript                                        |

---

## 頁面規劃

| 路由                      | 說明                              | 需登入 |
|-------------------------|-----------------------------------|------|
| `/`                     | 首頁：英雄區 + 文章卡片 grid（含分類 filter） | 否    |
| `/blog/[slug]`          | 文章詳情頁（TipTap HTML + 封面圖）        | 否    |
| `/category/[slug]`      | 依分類篩選文章列表                       | 否    |
| `/login`                | 登入頁（Email + Password）            | 否    |
| `/admin/new`            | 新增文章（TipTap 編輯器 + 封面圖上傳）      | **是** |

---

## Strapi Content Types

### Article

| 欄位        | 類型              | 說明                    |
|-----------|-----------------|------------------------|
| title     | String          | 文章標題                   |
| slug      | UID (title)     | URL 識別碼（自動生成）          |
| content   | RichText        | TipTap 輸出的 HTML 內容     |
| excerpt   | Text            | 摘要（首頁卡片顯示）             |
| cover     | Media (single)  | 封面圖片                   |
| category  | Relation → Category (many-to-one) | 文章分類 |
| publishedAt | DateTime      | 發佈時間（Strapi 內建）        |

### Category

| 欄位    | 類型          | 說明              |
|-------|-------------|-----------------|
| name  | String      | 分類名稱（如：科技、設計）   |
| slug  | UID (name)  | URL 識別碼         |
| color | String      | 標籤顏色（hex，選填）    |

---

## 認證流程（Strapi JWT）

```
登入流程：
POST /api/auth/local
Body: { identifier: email, password }
Response: { jwt: "...", user: {...} }

前端儲存：
localStorage.setItem('token', jwt)

受保護 API 呼叫（新增文章、上傳圖片）：
Header: Authorization: Bearer <jwt>

登出：
localStorage.removeItem('token')
```

Next.js middleware.ts 保護 `/admin/*`：
- 讀取 localStorage token → 無效則 redirect 到 `/login`

---

## 封面圖上傳流程

```
1. 使用者在 /admin/new 選擇圖片檔案
2. CoverUpload.tsx 呼叫 POST /api/upload（multipart/form-data）
   Header: Authorization: Bearer <jwt>
3. Strapi 回傳 [{ id, url, ... }]
4. 儲存 imageId，在 POST /api/articles 時帶入 cover: imageId
5. 文章詳情頁透過 populate=cover 取得封面圖 URL 顯示
```

---

## 設計風格（Apple Style）

- **背景**：純白 `#ffffff`
- **主字色**：`#1d1d1f`（Apple 近黑色）
- **次字色**：`#6e6e73`（Apple 灰）
- **強調色**：`#0071e3`（Apple 藍，用於連結、按鈕）
- **字型**：`-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`
- **排版**：大量留白，`max-w-5xl mx-auto`，行距 1.8
- **首頁英雄區**：全寬大標題 + 主打文章圖片
- **文章卡片**：圓角 `rounded-2xl`，封面圖 16:9，hover 輕微縮放
- **分類標籤**：小膠囊 badge，依 `color` 欄位上色
- **文章詳情**：`prose prose-lg` class，最大寬度 680px
- **登入頁**：居中卡片，極簡白色

---

## 開發順序

### Phase 1：Strapi 後端 + 認證 + 分類
1. `npx create-strapi-app@latest backend --quickstart`
2. 建立 Category content type（name, slug, color）
3. 建立 Article content type（含 category relation, cover media）
4. 設定角色權限：
   - Public：find, findOne（articles & categories）
   - Authenticated：create（articles）, upload（files）
5. 新增 3 個分類：科技、設計、生活
6. 透過 Strapi Admin 建立 3 篇 Demo 文章（含分類、封面）
7. 驗證 API：`GET /api/articles?populate=cover,category`

### Phase 2：Next.js 前端骨架 + 認證
1. `npx create-next-app@latest frontend --typescript --tailwind --app`
2. 安裝：`@tailwindcss/typography`
3. 建立 `lib/strapi.ts`（API base + fetch 工具）
4. 建立 `lib/auth.ts`（login, logout, getToken, isAuthenticated）
5. 建立 `middleware.ts`（保護 /admin/*）
6. 建立登入頁 `/login/page.tsx`
7. 建立首頁 + 分類篩選

### Phase 3：TipTap 編輯器 + 圖片上傳
1. 安裝 TipTap：
   ```
   @tiptap/react @tiptap/starter-kit
   @tiptap/extension-link @tiptap/extension-image
   @tiptap/extension-placeholder @tiptap/extension-character-count
   ```
2. 建立 `components/Editor.tsx`（含工具列：粗體、斜體、標題、連結、圖片）
3. 建立 `components/CoverUpload.tsx`（拖拉上傳 + 預覽）
4. 建立新增文章頁 `/admin/new/page.tsx`
5. 整合：選分類下拉 + 封面上傳 + TipTap 內容 → POST /api/articles

### Phase 4：Apple 視覺設計
1. Navbar（Logo、分類連結、登入/登出按鈕）
2. 首頁英雄區（Featured 文章大圖）
3. 文章卡片 grid（響應式 1-2-3 欄）
4. 分類 badge + 篩選列
5. 文章詳情頁（封面大圖 + prose 排版）
6. 登入頁（極簡卡片）
7. 編輯器頁（TipTap 工具列樣式）

---

## Demo 文章規劃（3 篇）

### 文章 1：科技分類
- **標題**：「為什麼 Apple Silicon 改變了一切」
- **封面**：深色晶片特寫風格圖
- **摘要**：從 Intel 到自研晶片，Apple 如何重新定義效能與續航的平衡點。
- **內容重點**：H2 標題 × 3、粗體、引用區塊、一張圖片

### 文章 2：設計分類
- **標題**：「少即是多：Apple 設計哲學的 5 個核心原則」
- **封面**：極簡白色產品風格圖
- **摘要**：Jony Ive 留下的設計遺產，以及它如何影響現代 UI/UX 設計思維。
- **內容重點**：有序清單（5 原則）、H2、粗體強調詞

### 文章 3：生活分類
- **標題**：「用 Mac 工作的一天：我的生產力工具清單」
- **封面**：桌面工作站佈置風格圖
- **摘要**：分享我每天依賴的 macOS App 與快捷鍵，讓工作流更順暢。
- **內容重點**：無序清單（工具清單）、連結、H2

---

## 本機啟動

```bash
# 後端（Strapi）
cd backend && npm run develop
# Admin：http://localhost:1337/admin

# 前端（Next.js）
cd frontend && npm run dev
# 前台：http://localhost:3000
```

---

## 環境變數

### frontend/.env.local
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

---

## Demo 展示流程（給主管看）

1. 開啟 `http://localhost:3000` → 首頁英雄區 + 3 篇文章卡片
2. 點擊分類 badge → 分類篩選頁
3. 點進一篇文章 → 詳情頁（封面大圖 + 精美排版）
4. 點擊 Navbar「撰寫文章」→ 自動導向 `/login`
5. 輸入帳密登入 → 跳轉至 `/admin/new`
6. **展示 TipTap 編輯器**：
   - 輸入標題
   - 選擇分類
   - 上傳封面圖（拖拉）
   - 編輯正文（粗體、標題、插圖、連結）
7. 點擊「發佈」→ 返回首頁，新文章出現在列表第一篇

---

## 重要限制 / 注意事項

- TipTap 輸出 HTML 字串 → 存入 Strapi `richtext` 欄位（設定為 `html` 格式）
- 文章詳情頁用 `dangerouslySetInnerHTML` 渲染（Demo，非生產用）
- JWT Token 存 localStorage（Demo 簡化做法，生產應用 HttpOnly Cookie）
- 封面圖 URL 前綴需加 `NEXT_PUBLIC_STRAPI_URL`（Strapi 回傳相對路徑）
- Strapi `populate` 參數：`?populate=cover,category` 才能取得關聯資料

---

## Agent 使用規劃

| 階段          | 推薦 Agent                 |
|-------------|--------------------------|
| Phase 1 後端  | Backend Architect        |
| Phase 2 認證  | Backend Architect        |
| Phase 3 前端  | Frontend Developer       |
| Phase 4 編輯器 | Frontend Developer       |
| Phase 5 設計  | UI Designer              |
| 全程品質        | code-reviewer            |
| Demo 前驗證    | e2e-runner / qa skill    |
