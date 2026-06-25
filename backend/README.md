# Strapi Backend

Strapi 5 Headless CMS，提供 Article / Category content types 與 REST API。

> 屬於 [strapi-tiptap-side](../) demo 專案的一部分。

## 快速啟動

```bash
./start.sh develop
# → http://localhost:1337/admin
```

`start.sh` 會自動：
1. 從 `.env.example` 複製產生 `.env`（若不存在）
2. 安裝依賴（若 `node_modules` 缺失）
3. 確保 SQLite 資料庫目錄存在
4. 啟動 Strapi

## 🔑 Demo 帳號（首次啟動時自動 seed）

```
Email    : demo@strapi.local
Password : Demo1234!
```

> 此帳號同步用於前端 `/login` 頁面。帳號由 `src/index.ts` 的 `seedDemoUser()` 在首次啟動時建立。

## Strapi 指令

```bash
npm run develop    # 開發模式（watch + auto-reload）
npm run start      # 正式模式
npm run build      # 構建 admin panel
npm run console    # 開 Strapi REPL
```

## Content Types

| Type | 用途 |
|------|------|
| **Article** | 部落格文章（title / slug / content / excerpt / cover / category） |
| **Category** | 文章分類（name / slug / color） |

詳細 schema 見 `src/api/article/content-types/article/schema.json` 與 `src/api/category/content-types/category/schema.json`。

## Bootstrap 自動設定

`src/index.ts` 在 Strapi 啟動時會：

1. 設定 Public / Authenticated 角色權限
2. 停用公開註冊（移除 `auth.register` 權限，可由 `ENABLE_PUBLIC_REGISTER=true` 開啟）
3. Seed 3 個 Demo 分類：科技 / 設計 / 生活
4. Seed 3 篇 Demo 文章（Apple Silicon / 設計哲學 / Mac 工具）
5. Seed Demo User：`demo@strapi.local` / `Demo1234!`

## 環境變數

完整變數見 `.env.example`。重點：

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `HOST` | `0.0.0.0` | 綁定位址 |
| `PORT` | `1337` | 通訊埠 |
| `DATABASE_CLIENT` | `sqlite` | 資料庫類型 |
| `DATABASE_FILENAME` | `.tmp/data.db` | SQLite 檔案路徑 |
| `ENABLE_PUBLIC_REGISTER` | `false` | 公開註冊開關 |
| `APP_KEYS` / `API_TOKEN_SALT` / `ADMIN_JWT_SECRET` 等 | 自動生成 | JWT 密鑰（勿 commit 到 git） |

## REST API 重點端點

| Method | Path | 用途 | 認證 |
|--------|------|------|------|
| GET | `/api/articles?populate[0]=cover&populate[1]=category` | 文章列表 | 公開 |
| GET | `/api/articles?filters[slug][$eq]=<slug>&populate[0]=cover&populate[1]=category` | 單篇 | 公開 |
| GET | `/api/categories` | 分類列表 | 公開 |
| POST | `/api/auth/local` | 登入（回傳 JWT） | — |
| POST | `/api/upload` | 上傳檔案 | JWT |
| POST | `/api/articles` | 建立文章 | JWT |

> ⚠️ Strapi 5 的 `populate` 改為 bracket notation：
> `?populate[0]=cover&populate[1]=category`（**不是** Strapi 4 的 `populate=cover,category`）

## 部署

正式部署見 [Strapi 官方文件](https://docs.strapi.io/dev-docs/deployment)。
本專案為 Demo 性質，預設使用 SQLite，正式環境建議：

1. 改用 PostgreSQL：`DATABASE_CLIENT=postgres` + 設定 `DATABASE_*` 連線資訊
2. JWT secrets 用強隨機值
3. 改用 HttpOnly cookie 認證

## 相關資源

- [Strapi 官方文件](https://docs.strapi.io)
- [REST API 參考](https://docs.strapi.io/dev-docs/api/rest)
- [Users & Permissions plugin](https://docs.strapi.io/dev-docs/plugins/users-permissions)
