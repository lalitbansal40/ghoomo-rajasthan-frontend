import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { clearSession, getSession } from '@/lib/session';
import { sameOriginMutation } from '@/lib/mutation-origin';

/** Sign out: the Ghoomo session ends on the server too (every device), then the cookie goes. */
export async function POST(request: Request) {
  if (!sameOriginMutation(request)) return NextResponse.json({ ok: false, error: { code: 'ORIGIN_INVALID' } }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  const token = await getSession();
  if (token) {
    await fetch(`${env.apiBaseUrl}/ghoomo/auth/logout`, { method: 'POST', cache: 'no-store', headers: { accept: 'application/json', authorization: `Bearer ${token}` } }).catch(() => null);
  }
  await clearSession();
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
