import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import { PREVIEW_COOKIE } from '@/lib/preview-session';
export async function POST(request: Request) {
  const headers = { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer' };
  if (request.headers.get('origin') !== new URL(request.url).origin) return NextResponse.json({ ok: false }, { status: 403, headers });
  const raw = await request.text(); if (raw.length > 2000) return NextResponse.json({ ok: false }, { status: 413, headers });
  try {
    const input = JSON.parse(raw);
    const response = await fetch(`${env.apiBaseUrl}/public/ghoomo/package-preview/exchange`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input), cache: 'no-store', signal: AbortSignal.timeout(8000) });
    const body = await response.json();
    if (!response.ok || !body?.ok || !/^\/preview\/(en|hi)\/packages\/[a-z0-9-]+$/.test(body.data?.path)) return NextResponse.json({ ok: false }, { status: 404, headers });
    const ttl = Math.floor((new Date(body.data.expiresAt).getTime() - Date.now()) / 1000);
    if (ttl <= 0 || ttl > 600) return NextResponse.json({ ok: false }, { status: 404, headers });
    (await cookies()).set(PREVIEW_COOKIE, body.data.sessionToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/preview', maxAge: ttl });
    return NextResponse.json({ ok: true, path: body.data.path }, { headers });
  } catch { return NextResponse.json({ ok: false }, { status: 503, headers }); }
}
