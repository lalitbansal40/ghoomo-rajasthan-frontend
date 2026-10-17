import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { PREVIEW_COOKIE } from '@/lib/preview-session';
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return new Response(null, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  (await cookies()).set(PREVIEW_COOKIE, '', { path: '/preview', maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  return NextResponse.redirect(new URL('/', request.url), { status: 303, headers: { 'Cache-Control': 'no-store' } });
}
