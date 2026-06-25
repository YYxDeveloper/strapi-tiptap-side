# Spec: Strapi 後端

## Content Types

### Category
| 欄位  | 類型        | 必填 | 說明       |
|-----|-----------|-----|----------|
| name  | String  | ✅  | 分類名稱     |
| slug  | UID(name) | ✅  | URL 識別碼  |
| color | String  | ❌  | 標籤顏色 hex |

### Article
| 欄位       | 類型                  | 必填 | 說明               |
|----------|---------------------|----|------------------|
| title    | String              | ✅  | 文章標題             |
| slug     | UID(title)          | ✅  | URL 識別碼（自動生成）    |
| content  | RichText            | ✅  | TipTap HTML 內容   |
| excerpt  | Text                | ❌  | 摘要（首頁卡片用）        |
| cover    | Media (single)      | ❌  | 封面圖片             |
| category | Relation→Category   | ❌  | 多對一關聯            |

## 角色權限設定

| 角色             | Article       | Category      | Upload |
|--------------|---------------|---------------|--------|
| Public       | find, findOne | find, findOne | ❌      |
| Authenticated | find, findOne, create | find, findOne | upload |

## API Endpoints（使用）

| Method | Path                                          | 用途         |
|--------|-----------------------------------------------|------------|
| GET    | `/api/articles?populate=cover,category&sort=createdAt:desc` | 取得文章列表 |
| GET    | `/api/articles?filters[slug][$eq]=<slug>&populate=cover,category` | 取得單篇文章 |
| GET    | `/api/categories`                             | 取得分類列表 |
| GET    | `/api/articles?filters[category][slug][$eq]=<slug>&populate=cover,category` | 依分類篩選 |
| POST   | `/api/auth/local`                             | 登入取得 JWT |
| POST   | `/api/upload`                                 | 上傳封面圖   |
| POST   | `/api/articles`                               | 建立新文章   |

## Demo 資料

### 分類（3 個）
- 科技（slug: tech, color: #0071e3）
- 設計（slug: design, color: #34c759）
- 生活（slug: life, color: #ff9f0a）

### Demo 文章（3 篇）
1. 「為什麼 Apple Silicon 改變了一切」→ 科技
2. 「少即是多：Apple 設計哲學的 5 個核心原則」→ 設計
3. 「用 Mac 工作的一天：我的生產力工具清單」→ 生活

## 啟動方式
```bash
npx create-strapi-app@latest backend --quickstart
cd backend && npm run develop
# http://localhost:1337/admin
```
