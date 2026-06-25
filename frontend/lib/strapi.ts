const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface Media {
  id: number;
  documentId: string;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  color: string | null;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover: Media | null;
  category: Category | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiResponse<T> {
  data: T | T[] | null;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
  error?: {
    status: number;
    name: string;
    message: string;
  };
}

class StrapiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'StrapiError';
  }
}

async function strapiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${STRAPI_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new StrapiError(res.status, `Strapi ${res.status}: ${path}`);
  }

  const json = (await res.json()) as StrapiResponse<T>;
  if (json.error) {
    throw new StrapiError(json.error.status, json.error.message);
  }
  return json.data as T;
}

function getMediaUrl(media: Media | null | undefined): string | null {
  if (!media) return null;
  if (media.url.startsWith('http')) return media.url;
  return `${STRAPI_URL}${media.url}`;
}

function normalizeArticle(raw: any): Article {
  return {
    ...raw,
    cover: raw.cover
      ? { ...raw.cover, url: getMediaUrl(raw.cover) || '' }
      : null,
  };
}

export async function getArticles(): Promise<Article[]> {
  const qs = new URLSearchParams({
    'populate[0]': 'cover',
    'populate[1]': 'category',
    'sort[0]': 'publishedAt:desc',
  });
  const data = await strapiFetch<Article[]>(`/api/articles?${qs}`);
  return (data as any[]).map(normalizeArticle);
}

export async function getArticle(slug: string): Promise<Article | null> {
  const qs = new URLSearchParams({
    'filters[slug][$eq]': slug,
    'populate[0]': 'cover',
    'populate[1]': 'category',
  });
  const data = await strapiFetch<Article[]>(`/api/articles?${qs}`);
  const arr = data as any[];
  if (arr.length === 0) return null;
  return normalizeArticle(arr[0]);
}

export async function getCategories(): Promise<Category[]> {
  const data = await strapiFetch<Category[]>('/api/categories');
  return data as Category[];
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const qs = new URLSearchParams({
    'filters[category][slug][$eq]': categorySlug,
    'populate[0]': 'cover',
    'populate[1]': 'category',
    'sort[0]': 'publishedAt:desc',
  });
  const data = await strapiFetch<Article[]>(`/api/articles?${qs}`);
  return (data as any[]).map(normalizeArticle);
}

export { STRAPI_URL, getMediaUrl, StrapiError };
