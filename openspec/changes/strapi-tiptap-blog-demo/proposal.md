# Proposal: Apple 風格部落格 Demo（Strapi + TipTap）

## 背景與動機

向主管展示 Headless CMS + 富文字編輯器的完整整合能力。
以 Apple 官網設計風格為標竿，讓 Demo 具有視覺衝擊力。

## 目標

1. 展示 Strapi 5 作為 Headless CMS 的靈活性（Content Type 管理、REST API、媒體上傳）
2. 展示 TipTap 2 富文字編輯器（工具列、圖片插入、格式化）
3. 展示 Next.js 14 App Router 與 Strapi 的完整串接
4. 提供完整使用者流程：瀏覽 → 登入 → 建立文章 → 即時上線

## 範圍

| 包含 | 不包含 |
|------|--------|
| 文章 CRUD（建立、讀取） | 文章編輯、刪除 |
| 分類系統（3 個分類） | 標籤系統 |
| JWT 登入認證 | 社群登入（OAuth） |
| 封面圖上傳 | 多圖管理 |
| 3 篇預建 Demo 文章 | 留言系統 |
| Apple 視覺風格 | RWD 行動版優化 |

## 技術決策

- **Strapi 5 over WordPress**：API-first、TypeScript 支援、Content Type Builder 直觀
- **TipTap 2 over Quill**：React 原生支援、Extension 架構、無 jQuery 依賴
- **Next.js App Router**：Server Components 提升 SEO、資料直接 fetch Strapi API
- **JWT in localStorage**：Demo 簡化，非生產用

## 成功標準

- 首頁在 2s 內載入完成
- TipTap 支援：粗體、斜體、H1/H2/H3、有序清單、無序清單、連結、圖片插入
- 登入 → 新增文章 → 首頁看到文章，完整流程不超過 60 秒
- 視覺風格通過主管認可
