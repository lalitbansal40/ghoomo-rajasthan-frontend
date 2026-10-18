import { PUBLIC_LAUNCHED } from '@/lib/seo';
import { releaseEligible } from '@/lib/release';
import type { Locale } from '@/i18n';

/**
 * Structured data for search engines — rendered ONLY once the site is launched (SITE_LAUNCHED).
 * Until then a page carries none, so nothing about sample tours or prices can reach a search
 * result. `<` is escaped so the data can never close the script tag.
 */
export function JsonLd({ data, path, locale, eligible = true, revision }: {
  data: object | object[]; path: string; locale: Locale; eligible?: boolean; revision?: number;
}) {
  if (!PUBLIC_LAUNCHED || !releaseEligible(path, locale, eligible, revision)) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
