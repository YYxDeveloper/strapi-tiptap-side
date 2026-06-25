import { notFound } from 'next/navigation';
import { getArticlesByCategory, getCategories } from '@/lib/strapi';
import ArticleCard from '@/components/ArticleCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [categories, articles] = await Promise.all([
    getCategories().catch(() => []),
    getArticlesByCategory(slug).catch(() => []),
  ]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.color || '#6e6e73' }}
          />
          <h1 className="text-3xl md:text-4xl font-bold text-[#1d1d1f]">
            {category.name}
          </h1>
        </div>
        <p className="text-[#6e6e73]">
          {articles.length} 篇{category.name}文章
        </p>
      </header>

      {articles.length === 0 ? (
        <p className="text-[#6e6e73]">此分類尚無文章。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
