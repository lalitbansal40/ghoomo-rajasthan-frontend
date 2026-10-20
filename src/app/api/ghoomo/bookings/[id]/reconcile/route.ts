import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { getSession } from '@/lib/session';
import { sameOriginMutation } from '@/lib/mutation-origin';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Cookie-signed: only this site's own page may ask.
  if (!sameOriginMutation(request)) return NextResponse.json({ ok: false, error: { code: 'ORIGIN_INVALID' } }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  const token = await getSession();
  if (!token) return NextResponse.json({ ok: false, error: { code: 'AUTH_REQUIRED' } }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) return NextResponse.json({ ok: false, error: { code: 'BOOKING_NOT_FOUND' } }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  try {
    const upstream = await fetch(`${env.apiBaseUrl}/bookings/ghoomo/${id}/reconcile`, { method: 'POST', cache: 'no-store', headers: { accept: 'application/json', authorization: `Bearer ${token}` } });
    return new NextResponse(await upstream.text(), { status: upstream.status, headers: { 'content-type': 'application/json', 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'RECONCILIATION_UNAVAILABLE' } }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
