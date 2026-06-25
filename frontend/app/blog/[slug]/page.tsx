import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/strapi';
import CategoryBadge from '@/components/CategoryBadge';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug).catch(() => null);
  if (!article) notFound();

  const date = new Date(article.publishedAt).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {article.cover && (
        <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-8 -mt-4">
          <img
            src={article.cover.url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <header className="mb-8">
        {article.category && (
          <div className="mb-3">
            <CategoryBadge category={article.category} size="md" />
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mb-3">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-lg text-[#6e6e73] mb-4">{article.excerpt}</p>
        )}
        <time className="text-sm text-[#6e6e73]">{date}</time>
      </header>

      <div
        className="prose prose-lg max-w-none
          prose-headings:font-semibold prose-headings:text-[#1d1d1f]
          prose-p:text-[#1d1d1f] prose-p:leading-relaxed
          prose-a:text-[#0071e3] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#1d1d1f]
          prose-blockquote:border-l-[#0071e3] prose-blockquote:text-[#6e6e73]
          prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-li:text-[#1d1d1f]"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
