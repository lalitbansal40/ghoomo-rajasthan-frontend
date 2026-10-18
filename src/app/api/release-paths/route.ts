import { PUBLIC_LAUNCHED } from '@/lib/seo';
import { publicReleasePaths } from '@/lib/public-release';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store, max-age=0', 'X-Robots-Tag': 'noindex', 'Referrer-Policy': 'no-referrer' };

/** Read-only current PUBLIC paths, no customer input, tokens or records. Never caches a withdrawal. */
export async function GET() {
  if (!PUBLIC_LAUNCHED) return Response.json({ paths: [] }, { headers });
  try { return Response.json({ paths: (await publicReleasePaths()).analyticsPaths }, { headers }); }
  catch { return Response.json({ paths: [] }, { status: 503, headers: { ...headers, 'Retry-After': '60' } }); }
}
