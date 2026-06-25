# Spec: Next.js 前端骨架

## 技術棧

| 層面 | 技術 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS v3 + @tailwindcss/typography |
| API 通訊 | Strapi REST API（fetch，server-side） |
| 認證 | Strapi JWT（cookie + localStorage） |

## 環境變數

`frontend/.env.local`:
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## 目錄結構

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout（Navbar）
│   ├── page.tsx                # 首頁：英雄區 + 文章 grid
│   ├── blog/[slug]/page.tsx    # 文章詳情
│   ├── category/[slug]/page.tsx# 分類篩選
│   └── login/page.tsx          # 登入頁
├── components/
│   ├── Navbar.tsx
│   ├── ArticleCard.tsx
│   └── CategoryBadge.tsx
├── lib/
│   ├── strapi.ts               # API 工具
│   └── auth.ts                 # JWT 工具
└── middleware.ts               # 保護 /admin/*
```

## lib/strapi.ts 介面

```typescript
export interface Article {
  id: number
  documentId: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover: { url: string } | null
  category: Category
  publishedAt: string
}

export interface Category {
  id: number
  documentId: string
  name: string
  slug: string
  color: string
}

export async function getArticles(): Promise<Article[]>
export async function getArticle(slug: string): Promise<Article | null>
export async function getCategories(): Promise<Category[]>
export async function getArticlesByCategory(slug: string): Promise<Article[]>
```

## Strapi Populate 語法

⚠️ Strapi 5 改為 bracket notation：
```
?populate[0]=cover&populate[1]=category&sort=createdAt:desc
```

封面圖 URL 需加 `${STRAPI_URL}` prefix：
```typescript
const coverUrl = article.cover?.url.startsWith('http')
  ? article.cover.url
  : `${STRAPI_URL}${article.cover?.url}`
```

## 認證（lib/auth.ts）

```typescript
export const login = async (identifier: string, password: string): Promise<string>
export const logout = (): void
export const getToken = (): string | null  // 從 localStorage 讀
export const setToken = (jwt: string): void  // 同時 setItem + setCookie
export const isAuthenticated = (): boolean
```

> 為何同時存 localStorage + cookie？
> - localStorage：client component 用
> - cookie：middleware 在 edge runtime 只能讀 cookie，無法讀 localStorage

## Middleware 路由保護

```typescript
// middleware.ts
export const config = { matcher: ['/admin/:path*'] }

export function middleware(request: NextRequest) {
  const token = request.cookies.get('strapi_jwt')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
```

## 頁面

### `/`（首頁）
- Server Component
- `const articles = await getArticles()`
- 顯示 ArticleCard grid（響應式 1/2/3 欄）

### `/blog/[slug]`（文章詳情）
- Server Component
- `const article = await getArticle(params.slug)`
- `dangerouslySetInnerHTML={{ __html: article.content }}`（Demo 簡化）
- 封面圖置頂、prose 排版

### `/category/[slug]`（分類頁）
- Server Component
- 顯示分類名稱 + 篩選後的文章 grid

### `/login`
- Client Component（需要 onClick 處理登入）
- Form: email + password
- 成功後 `setToken(jwt)` → `router.push('/admin/new')`
