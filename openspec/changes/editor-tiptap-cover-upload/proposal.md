# Proposal: TipTap 編輯器 + 封面圖上傳（Sub-issue 3）

## 背景

`strapi-tiptap-blog-demo` 第三階段：在已完成的 Next.js 前端骨架（Issue #2）之上，新增「撰寫文章」頁面，串接 Strapi 的 create article + upload API，提供：
- TipTap 2 富文字編輯器（11 個工具列按鈕）
- 封面圖拖拉上傳（Strapi Upload API）
- 發佈流程整合（上傳封面 → 建立文章 → redirect 首頁）

## 範圍

| 包含 | 不包含 |
|------|--------|
| TipTap 2 + StarterKit + 5 個 extensions | 文章編輯、刪除（不在 demo 範圍）|
| CoverUpload 元件（拖拉 + 預覽 + 上傳）| 多圖管理 |
| `/admin/new` 撰寫頁面 | 草稿自動儲存 |
| 表單整合（標題/分類/摘要/封面/內容）| 多語言 |
| Strapi Authenticated 權限流程 | Apple 視覺風格細修（Sub-issue 4）|

## 技術決策

- **TipTap 2 over Quill**：React 原生支援、Extension 架構、無 jQuery 依賴
- **圖片插入用 URL 輸入**（不整合 TipTap upload extension）：Demo 簡化，避免額外 API 整合
- **封面圖上傳用 Strapi Upload API**：保留 media 管理在 Strapi Admin，符合 Headless CMS 概念

## 成功標準

- 登入後進 `/admin/new` 看到完整表單
- TipTap 編輯器 11 個按鈕都可正常運作
- 拖拉圖片到 CoverUpload → 預覽 → 點上傳 → 拿到 fileId
- 點發佈 → 文章出現在 Strapi DB + 首頁
- 未登入進 `/admin/new` → redirect `/login`（middleware 保護）

## 相關資源

- 父 change：`openspec/changes/strapi-tiptap-blog-demo/specs/editor.md`
- 對應 Issue：#3
