# Design: Apple 視覺風格規格

## Design Tokens

```css
/* Colors */
--color-primary: #1d1d1f;      /* Apple 近黑 */
--color-secondary: #6e6e73;    /* Apple 灰 */
--color-accent: #0071e3;       /* Apple 藍 */
--color-bg: #ffffff;           /* 純白背景 */
--color-surface: #f5f5f7;      /* Apple 淺灰底 */
--color-border: #d2d2d7;       /* 分隔線 */

/* Typography */
--font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
--font-size-hero: 56px;        /* 英雄標題 */
--font-size-h1: 40px;
--font-size-h2: 28px;
--font-size-body: 17px;
--line-height-body: 1.7;

/* Spacing */
--max-width: 980px;
--max-width-prose: 680px;
--section-padding: 80px 0;
```

## 元件設計

### Navbar
```
| Logo (strapi-blog) |  科技  設計  生活  |  撰寫文章  登入/登出 |
高度：52px，白底，底部 1px border #d2d2d7，sticky
```

### 首頁英雄區
```
全寬，高度 520px
Featured 文章封面圖（object-cover）
左下角：分類 badge + 大標題 + 摘要 + 閱讀更多按鈕
overlay：黑色漸層 from-transparent to-black/60
```

### 文章卡片（ArticleCard）
```
圓角 rounded-2xl，overflow-hidden，白底
封面圖：aspect-video（16:9），object-cover
卡片 body：p-6
  分類 badge（小膠囊）
  標題：font-semibold text-xl，2 行截斷
  摘要：text-secondary，3 行截斷
  日期：text-sm text-secondary
hover：shadow-lg，transform scale-[1.01]，transition-all 0.2s
```

### 分類 Badge（CategoryBadge）
```
px-3 py-1，rounded-full，text-xs font-medium
背景色：category.color + 20%（淡色），文字色：category.color
```

### 文章詳情頁
```
封面：全寬，max-h-[480px]，object-cover，rounded-none
內文容器：max-w-[680px] mx-auto px-4 py-16
標題：text-4xl font-bold mb-4
分類 + 日期：flex gap-3 mb-8 text-secondary text-sm
prose 內文：prose prose-lg prose-headings:font-semibold
```

### 登入頁
```
居中卡片：max-w-[400px]，bg-white，rounded-2xl，shadow-xl，p-10
Logo：mb-8，text-center
輸入框：h-12，border border-[#d2d2d7]，rounded-lg，px-4，text-[17px]
登入按鈕：bg-[#0071e3]，text-white，h-12，rounded-lg，font-medium，w-full
錯誤訊息：text-red-500 text-sm mt-2
```

### TipTap 編輯器頁
```
兩欄：左側元資料（標題/分類/摘要/封面），右側編輯器
工具列：bg-[#f5f5f7]，border-b，sticky，gap-1，px-4，py-2
工具列按鈕：圓角，active 時 bg-[#1d1d1f] text-white
編輯器區：min-h-[500px]，focus-within:ring-1 ring-[#0071e3]
```

## 響應式（Demo 優先桌面）

- 首頁 grid：1 欄（<768px）→ 2 欄（768px）→ 3 欄（1024px）
- 文章詳情：全寬，prose max-width 自動居中
- 編輯器頁：桌面兩欄，行動版單欄（堆疊）
