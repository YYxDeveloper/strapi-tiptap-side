# Spec: TipTap 編輯器 + 封面圖上傳

## TipTap 擴充套件

```bash
npm install @tiptap/react @tiptap/starter-kit \
  @tiptap/extension-link @tiptap/extension-image \
  @tiptap/extension-placeholder @tiptap/extension-character-count
```

## Editor.tsx 功能規格

### 工具列按鈕（依序）
| 按鈕 | 功能 | TipTap 指令 |
|------|------|-----------|
| B | 粗體 | toggleBold |
| I | 斜體 | toggleItalic |
| H1 | 大標題 | toggleHeading({ level: 1 }) |
| H2 | 中標題 | toggleHeading({ level: 2 }) |
| H3 | 小標題 | toggleHeading({ level: 3 }) |
| ≡ | 無序清單 | toggleBulletList |
| 1. | 有序清單 | toggleOrderedList |
| " | 引用 | toggleBlockquote |
| 🔗 | 插入連結 | setLink |
| 🖼 | 插入圖片 | setImage（URL 輸入） |
| ↩ | 分隔線 | setHorizontalRule |

### Props 介面
```typescript
interface EditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}
```

### 輸出格式
- TipTap `getHTML()` 輸出 HTML 字串
- 存入 Strapi `content` 欄位（RichText 設為 HTML 模式）

## CoverUpload.tsx 規格

### 支援格式
- JPEG, PNG, WebP
- 最大 5MB

### 上傳流程
```
1. 使用者拖拉或點擊選擇圖片
2. 本地預覽（URL.createObjectURL）
3. 點擊「上傳」→ FormData POST /api/upload
   Header: Authorization: Bearer <jwt>
4. 回傳 [{ id, url, ... }] → 儲存 fileId
5. 顯示已上傳預覽圖
```

### Props 介面
```typescript
interface CoverUploadProps {
  onUpload: (fileId: number, url: string) => void
  token: string
}
```

## /admin/new 頁面欄位

| 欄位 | 元件 | 必填 |
|------|------|------|
| 標題 | `<input>` | ✅ |
| 分類 | `<select>`（從 API 載入） | ❌ |
| 摘要 | `<textarea>` | ❌ |
| 封面圖 | CoverUpload | ❌ |
| 內文 | Editor | ✅ |

### 發佈 POST body
```json
{
  "data": {
    "title": "...",
    "content": "<p>...</p>",
    "excerpt": "...",
    "category": 1,
    "cover": 3
  }
}
```
