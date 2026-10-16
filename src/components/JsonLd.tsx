import { SITE_LAUNCHED } from '@/lib/site';

/**
 * Structured data for search engines — rendered ONLY once the site is launched (SITE_LAUNCHED).
 * Until then a page carries none, so nothing about sample tours or prices can reach a search
 * result. `<` is escaped so the data can never close the script tag.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  if (!SITE_LAUNCHED) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
