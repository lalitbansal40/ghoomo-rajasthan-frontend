import Link from 'next/link';
import { dict, type Locale } from '@/i18n';
import { env } from '@/lib/env';

export interface Crumb {
  label: string;
  href?: string;
}

/** Home › Packages › Royal Rajasthan — the last one is the page itself (not a link). */
export function Breadcrumbs({ items, locale }: { items: Crumb[]; locale: Locale }) {
  const t = dict(locale);
  return (
    <nav aria-label={t.common.breadcrumb} className="text-small text-muted">
      <ol className="flex flex-wrap items-center gap-x-1.5">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 ? <span aria-hidden className="text-gold-700">›</span> : null}
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="underline-offset-4 hover:text-royal-700 hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? 'page' : undefined} className="text-ink">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** BreadcrumbList structured data — rendered only once the site is live (Phase 7). */
export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: new URL(c.href, env.siteUrl).toString() } : {}),
    })),
  };
}
