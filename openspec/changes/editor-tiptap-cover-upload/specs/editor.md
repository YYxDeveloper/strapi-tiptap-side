# Spec: TipTap 編輯器 + 封面圖上傳

## 安裝套件

```bash
cd frontend
npm install @tiptap/react @tiptap/starter-kit \
  @tiptap/extension-link @tiptap/extension-image \
  @tiptap/extension-placeholder @tiptap/extension-character-count
```

## Editor.tsx

### 工具列（11 按鈕）
| 圖示 | 功能 | TipTap 指令 |
|------|------|-------------|
| **B** | 粗體 | `editor.chain().focus().toggleBold().run()` |
| **I** | 斜體 | `toggleItalic` |
| **H1** | 大標題 | `toggleHeading({ level: 1 })` |
| **H2** | 中標題 | `toggleHeading({ level: 2 })` |
| **H3** | 小標題 | `toggleHeading({ level: 3 })` |
| **≡** | 無序清單 | `toggleBulletList` |
| **1.** | 有序清單 | `toggleOrderedList` |
| **"** | 引用 | `toggleBlockquote` |
| **🔗** | 插入連結 | `setLink({ href: prompt() })` |
| **🖼** | 插入圖片 | `setImage({ src: prompt() })` |
| **—** | 分隔線 | `setHorizontalRule` |

### Props 介面
```typescript
interface EditorProps {
  content: string          // 初始 HTML
  onChange: (html: string) => void
  placeholder?: string
}
```

### 輸出
- `editor.getHTML()` → 存入 Strapi `content` 欄位

## CoverUpload.tsx

### 限制
- 格式：JPEG, PNG, WebP
- 大小：≤ 5 MB（client 端檢查）

### 上傳流程
```
1. 使用者拖拉/點擊選圖
2. localStorage 預覽（URL.createObjectURL）
3. 點「上傳」→ FormData POST /api/upload
   Headers: Authorization: Bearer <jwt>
4. 回傳 [{ id, url, ... }] → 儲存 fileId
5. 顯示已上傳預覽（用 Strapi URL）
```

### Props 介面
```typescript
interface CoverUploadProps {
  onUpload: (fileId: number, url: string) => void
  token: string
}
```

## /admin/new 頁面

### 欄位
| 欄位 | 元件 | 必填 | API 欄位 |
|------|------|------|----------|
| 標題 | `<input>` | ✅ | `title` |
| 分類 | `<select>` | ❌ | `category` (id) |
| 摘要 | `<textarea>` | ❌ | `excerpt` |
| 封面圖 | CoverUpload | ❌ | `cover` (id) |
| 內文 | Editor | ✅ | `content` |

### 發佈流程
```typescript
async function handlePublish() {
  // 1. 上傳封面（若有）
  let coverId: number | null = null;
  if (coverFile) {
    const formData = new FormData();
    formData.append('files', coverFile);
    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const uploaded = await res.json();
    coverId = uploaded[0].id;
  }

  // 2. 建立文章
  const articleRes = await fetch(`${STRAPI_URL}/api/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        title, excerpt, content, category, cover: coverId,
      },
    }),
  });

  // 3. Redirect 首頁
  router.push('/');
}
```

## 錯誤處理

| 情境 | UI 行為 |
|------|---------|
| 圖片 > 5MB | 顯示紅字「檔案過大」|
| 上傳失敗 | 顯示錯誤訊息，保留本地預覽 |
| 建立文章失敗 | 顯示錯誤訊息，保留表單內容 |
| 401 Unauthorized | 清 token、redirect /login |
