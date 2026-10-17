import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { getSession } from '@/lib/session';

export async function GET() {
  const token = await getSession();
  if (!token) return NextResponse.json({ ok: false, error: { code: 'AUTH_REQUIRED' } }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  try {
    const upstream = await fetch(`${env.apiBaseUrl}/bookings/ghoomo/mine`, { cache: 'no-store', headers: { accept: 'application/json', authorization: `Bearer ${token}` } });
    return new NextResponse(await upstream.text(), { status: upstream.status, headers: { 'content-type': 'application/json', 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'BOOKINGS_UNAVAILABLE' } }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
