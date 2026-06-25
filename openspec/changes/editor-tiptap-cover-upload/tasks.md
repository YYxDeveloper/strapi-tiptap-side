# Tasks: editor-tiptap-cover-upload（Sub-issue 3）

## Setup
- [ ] 安裝 TipTap：`@tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder @tiptap/extension-character-count`

## Components
- [ ] 建立 `components/Editor.tsx`（11 個工具列按鈕 + 內容區 + 字數）
- [ ] 建立 `components/CoverUpload.tsx`（拖拉 + 預覽 + 5MB 限制 + 上傳）

## API helper
- [ ] 在 `lib/strapi.ts` 加 `uploadFile(file, token)` 函式
- [ ] 在 `lib/strapi.ts` 加 `createArticle(data, token)` 函式

## 頁面
- [ ] 建立 `app/admin/new/page.tsx`（標題/分類/摘要/封面/編輯器 + 發佈按鈕）
- [ ] 整合發佈流程：上傳封面 → POST /api/articles → redirect /

## 驗證
- [ ] 進 `/admin/new` 看到完整表單
- [ ] TipTap 11 個按鈕都可使用
- [ ] 拖拉圖片 → 本地預覽 → 點上傳 → 拿到 fileId
- [ ] 點發佈 → Strapi DB 有新文章 + 首頁顯示
- [ ] 未登入進 `/admin/new` → redirect /login
- [ ] `npm run build` 通過

## 不在此 issue 範圍（後續 sub-issues）
- Apple 視覺風格細修 → Sub-issue 4
