# Design: TipTap + 封面圖上傳

## 發佈流程時序

```
User                /admin/new (client)       Strapi
  │                       │                       │
  ├─ 填表 + 編輯 ────────>│                       │
  │                       │                       │
  ├─ 選封面圖 ──────────>│                       │
  │   (CoverUpload 預覽)  │                       │
  │                       │                       │
  ├─ 點「發佈」 ────────>│                       │
  │                       ├─ POST /api/upload ───>│
  │                       │   (multipart, Bearer) │
  │                       │<─ { id, url, ... } ───┤
  │                       │                       │
  │                       ├─ POST /api/articles ─>│
  │                       │   (JSON, Bearer)      │
  │                       │<─ { data: article } ──┤
  │                       │                       │
  │<─── redirect / ───────┤                       │
  │                       │                       │
```

## TipTap 編輯器內部

```
┌──────────────────────────────────────────┐
│  [B] [I] [H1] [H2] [H3] [≡] [1.] ["]  │  ← 工具列
│  [🔗] [🖼] [—]                            │
├──────────────────────────────────────────┤
│                                          │
│  內容編輯區                              │
│  - StarterKit (基本)                    │
│  - Link                                  │
│  - Image                                 │
│  - Placeholder                           │
│  - CharacterCount                        │
│                                          │
├──────────────────────────────────────────┤
│  字數: 0 / 無上限                       │  ← CharacterCount
└──────────────────────────────────────────┘
```

## 為何不整合 TipTap upload extension

Demo 範圍只允許用「貼 URL」插入內文圖片（避免額外 API 整合）：
- TipTap `setImage({ src: prompt('圖片 URL') })`
- 封面圖走獨立的 CoverUpload 元件

## Auth 流程整合

```
1. /admin/new 載入時（client component）：
   - 從 localStorage 讀 token
   - 若無 → 雖然 middleware 已 redirect，但保險檢查

2. 發佈時：
   - Header: Authorization: Bearer <token>
   - 401 response → logout() + redirect /login
```

## 已知技術債

- 表單無草稿自動儲存（demo 簡化）
- 圖片壓縮/裁切在 client 端（可用 browser-image-compression）
- 拖入圖片到 editor 直接上傳（未來可用 TipTap upload extension）
