import Link from 'next/link';
import type { Category } from '@/lib/strapi';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
  asLink?: boolean;
}

export default function CategoryBadge({ category, size = 'sm', asLink = true }: CategoryBadgeProps) {
  const color = category.color || '#6e6e73';
  const padding = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  const style = {
    backgroundColor: `${color}15`,
    color: color,
    borderColor: `${color}40`,
  };

  const className = `inline-flex items-center rounded-full border font-medium ${padding}`;

  if (asLink) {
    return (
      <Link
        href={`/category/${category.slug}`}
        className={`${className} hover:opacity-80 transition-opacity`}
        style={style}
      >
        {category.name}
      </Link>
    );
  }

  return (
    <span className={className} style={style}>
      {category.name}
    </span>
  );
}
