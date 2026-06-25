import { getArticles } from '@/lib/strapi';
import ArticleCard from '@/components/ArticleCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const articles = await getArticles().catch(() => []);
  const [featured, ...rest] = articles;

  return (
    <div>
      {/* Hero */}
      {featured && (
        <section className="bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-4">
              部落格 Demo
            </h1>
            <p className="text-lg md:text-xl text-[#6e6e73] max-w-2xl mx-auto mb-12">
              Apple 風格部落格展示 — Strapi 5 + Next.js 14 + TipTap
            </p>
            {featured.cover && (
              <a
                href={`/blog/${featured.slug}`}
                className="block max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl"
              >
                <img
                  src={featured.cover.url}
                  alt={featured.title}
                  className="w-full h-auto"
                />
              </a>
            )}
          </div>
        </section>
      )}

      {/* Articles grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-8">最新文章</h2>
        {articles.length === 0 ? (
          <p className="text-[#6e6e73]">尚無文章，請確認 Strapi 服務是否運行。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
