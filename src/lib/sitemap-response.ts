import { siteOpen, type SitePolicy } from './indexing-policy.ts';

const xml = (s: string) => s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]!);
/** No editorial dates are invented: add lastmod only when a public revision supplies evidence. */
export function sitemapXml(origin: string, paths: readonly string[]): string {
  const abs = (p: string) => new URL(p, origin).toString();
  const urls = [...new Set(paths)].sort().flatMap((path) => {
    const en = abs(path);
    const hi = abs(path === '/' ? '/hi' : `/hi${path}`);
    const alts = [['en-IN', en], ['hi-IN', hi], ['x-default', en]];
    return [en, hi].map((url) => `<url><loc>${xml(url)}</loc>${alts.map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${xml(href)}"/>`).join('')}</url>`);
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>\n`;
}

export async function sitemapResponse(policy: SitePolicy, loadPaths: () => Promise<string[]>): Promise<Response> {
  const headers = { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'private, no-store, max-age=0' };
  if (!siteOpen(policy)) return new Response(sitemapXml(policy.origin, []), { headers });
  try {
    return new Response(sitemapXml(policy.origin, await loadPaths()), { headers });
  } catch {
    return new Response('Sitemap temporarily unavailable. Please retry.', { status: 503, headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '60' } });
  }
}
