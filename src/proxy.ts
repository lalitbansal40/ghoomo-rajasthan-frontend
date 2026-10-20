import { NextResponse, type NextRequest } from 'next/server';
import { canonicalRedirect, requestHost } from './lib/canonical-host';

/** Never let a guest token or personal booking page be cached or sent as a referrer. */
export async function proxy(request: NextRequest) {
  // www → the bare host, before anything else (lib/canonical-host.ts).
  const host = requestHost(request.headers.get('x-forwarded-host'), request.headers.get('host'));
  const canonical = canonicalRedirect(host, request.nextUrl.pathname, request.nextUrl.search);
  if (canonical) return NextResponse.redirect(canonical, 301);
  const personal = /^\/(?:hi\/)?(?:booking|my-bookings)(?:\/|$)/.test(request.nextUrl.pathname) || request.nextUrl.pathname.startsWith('/preview');
  if (!personal && process.env.GHOOMO_CATALOG_SOURCE !== 'cms') return NextResponse.next();
  // A visibility lookup failure is a temporary failure, never an unknown-slug 404.
  if (process.env.GHOOMO_CATALOG_SOURCE === 'cms' && /^\/(?:hi\/)?packages(?:\/|$)/.test(request.nextUrl.pathname)) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/ghoomo/packages`, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error('CATALOG_UNAVAILABLE');
    } catch {
      const hindi = request.nextUrl.pathname.startsWith('/hi/');
      const message = hindi ? 'टूर की जानकारी अभी उपलब्ध नहीं है। कृपया थोड़ी देर में फिर कोशिश करें।' : 'Tours are temporarily unavailable. Please try again shortly.';
      return new NextResponse(`<!doctype html><html lang="${hindi ? 'hi' : 'en'}"><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Ghoomo Rajasthan</title></head><body style="margin:0;background:#FBF7EF;color:#1B1B1F;font:1.2rem/1.6 system-ui"><main style="max-width:48rem;margin:4rem auto;padding:1.5rem"><h1>Ghoomo Rajasthan</h1><p role="status">${message}</p><a href="${hindi ? '/hi/enquiry' : '/enquiry'}">${hindi ? 'यात्रा के लिए पूछें' : 'Enquire about your trip'}</a></main></body></html>`, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store, max-age=0', 'Retry-After': '60', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex' } });
    }
  }
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|img/|brand/|fonts/|favicon.ico).*)'] };
