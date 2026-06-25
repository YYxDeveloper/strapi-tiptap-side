import Link from 'next/link';
import type { Article } from '@/lib/strapi';
import CategoryBadge from './CategoryBadge';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const coverUrl = article.cover?.url;
  const date = new Date(article.publishedAt).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No cover
          </div>
        )}
      </div>
      <div className="p-5">
        {article.category && (
          <div className="mb-2">
            <CategoryBadge category={article.category} />
          </div>
        )}
        <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2 line-clamp-2 group-hover:text-[#0071e3] transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-[#6e6e73] line-clamp-2 mb-3">
            {article.excerpt}
          </p>
        )}
        <time className="text-xs text-[#6e6e73]">{date}</time>
      </div>
    </Link>
  );
}
