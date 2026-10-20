/**
 * Where to go after signing in — this site's own path only, never another site (no open
 * redirect): a single leading slash, no scheme, no backslash, no `//`.
 */
export function safeNext(raw: unknown, fallback: string): string {
  if (typeof raw !== 'string' || raw.length > 300) return fallback;
  if (!/^\/(?![/\\])[A-Za-z0-9\-._~/?=&%#]*$/.test(raw)) return fallback;
  return raw;
}

/** The sign-in page for `next`, in the page's language. */
export const loginHref = (locale: 'en' | 'hi', next: string): string =>
  `${locale === 'hi' ? '/hi' : ''}/login?next=${encodeURIComponent(next)}`;
