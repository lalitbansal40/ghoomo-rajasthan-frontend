import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import { PREVIEW_COOKIE } from '@/lib/preview-session';
export async function GET(_request: Request, { params }: { params: Promise<{ assetId: string; variant: string }> }) {
  const { assetId, variant } = await params; const token = (await cookies()).get(PREVIEW_COOKIE)?.value;
  const headers = { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex', 'X-Content-Type-Options': 'nosniff' };
  if (!token || !/^[a-f\d]{24}$/i.test(assetId) || !['cover', 'card', 'thumb', 'og'].includes(variant)) return new Response(null, { status: 404, headers });
  try {
    const response = await fetch(`${env.apiBaseUrl}/public/ghoomo/package-preview/media/${assetId}/${variant}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(8000) });
    if (!response.ok || response.headers.get('content-type') !== 'image/jpeg') return new Response(null, { status: 404, headers });
    return new Response(response.body, { headers: { ...headers, 'Content-Type': 'image/jpeg' } });
  } catch { return new Response(null, { status: 503, headers }); }
}
