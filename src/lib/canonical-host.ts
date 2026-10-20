/**
 * www.ghoomorajasthan.com → ghoomorajasthan.com, one 301 (owner, 20 Oct 2026, Phase 1
 * decision 6: in code, not an Amplify console rule). Two hosts answering the same pages split a
 * site's standing in search; every canonical already names the bare host.
 *
 * Only that exact host is redirected — never localhost, a preview (…amplifyapp.com) or the bare
 * host itself. Pure, so it is tested without a server.
 */
export const CANONICAL_HOST = 'ghoomorajasthan.com';
const WWW_HOST = `www.${CANONICAL_HOST}`;

/** The host a request was made to: behind Amplify's CDN the forwarded host is the one typed. */
export function requestHost(forwardedHost: string | null, host: string | null): string {
  const raw = (forwardedHost?.split(',')[0] ?? host ?? '').trim().toLowerCase();
  return raw.replace(/:\d+$/, '');
}

/** Where a request to the www host should go, or null when it should be served as it is. */
export function canonicalRedirect(host: string, pathname: string, search: string): string | null {
  if (host !== WWW_HOST) return null;
  return `https://${CANONICAL_HOST}${pathname}${search}`;
}
