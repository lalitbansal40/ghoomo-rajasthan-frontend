import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { indianMobile } from '@/lib/enquiry';
import { clearSession, getSession, setSession } from '@/lib/session';
import { sameOriginMutation } from '@/lib/mutation-origin';

const noStore = { 'Cache-Control': 'private, no-store' };
type User = { name?: string; phone?: string };
/** The signed-in person as the page may see them: a name and the ten-digit number, nothing else. */
const publicUser = (u: User | undefined) => ({ name: u?.name ?? '', phone: indianMobile(u?.phone ?? '') ?? '' });

/**
 * Who is signed in on Ghoomo Rajasthan — `user: null` when nobody is (an old Hello My Cab session
 * is cleared too). Never a 401: the header asks on every page, and nobody signed in is the usual
 * answer, not an error in the visitor's console.
 */
export async function GET() {
  const nobody = () => NextResponse.json({ ok: true, data: { user: null } }, { headers: noStore });
  const token = await getSession();
  if (!token) return nobody();
  try {
    const upstream = await fetch(`${env.apiBaseUrl}/ghoomo/auth/me`, { cache: 'no-store', headers: { accept: 'application/json', authorization: `Bearer ${token}` } });
    const body = await upstream.json().catch(() => null);
    if (upstream.status === 401 || upstream.status === 403) {
      // Signed out, blocked, or a session from before Ghoomo accounts (a Hello My Cab token).
      await clearSession();
      return nobody();
    }
    if (!upstream.ok || !body?.ok) return NextResponse.json({ ok: false, error: { code: 'SESSION_UNAVAILABLE' } }, { status: 502, headers: noStore });
    return NextResponse.json({ ok: true, data: { user: publicUser(body.data?.user) } }, { headers: noStore });
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'SESSION_UNAVAILABLE' } }, { status: 502, headers: noStore });
  }
}

/** Verify the code and sign in to (or create) the visitor's Ghoomo Rajasthan account. */
export async function POST(request: Request) {
  if (!sameOriginMutation(request)) return NextResponse.json({ ok: false, error: { code: 'ORIGIN_INVALID' } }, { status: 403, headers: noStore });
  const input = await request.json().catch(() => null) as { phone?: unknown; code?: unknown; name?: unknown } | null;
  const phone = typeof input?.phone === 'string' ? indianMobile(input.phone) : null;
  const code = typeof input?.code === 'string' && /^\d{4,8}$/.test(input.code) ? input.code : null;
  const name = typeof input?.name === 'string' ? input.name.trim().slice(0, 60) : '';
  if (!phone || !code) return NextResponse.json({ ok: false, error: { code: 'INPUT_INVALID' } }, { status: 400, headers: noStore });
  try {
    const upstream = await fetch(`${env.apiBaseUrl}/ghoomo/auth/otp/verify`, {
      method: 'POST', cache: 'no-store', headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ phone, code, ...(name ? { name } : {}) }),
    });
    const body = await upstream.json().catch(() => null);
    if (!upstream.ok || !body?.ok || typeof body?.data?.accessToken !== 'string') {
      return NextResponse.json(body ?? { ok: false, error: { code: 'OTP_VERIFY_FAILED' } }, { status: upstream.status || 502, headers: noStore });
    }
    await setSession(body.data.accessToken as string);
    return NextResponse.json({ ok: true, data: { user: publicUser(body.data.user) } }, { headers: noStore });
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'OTP_VERIFY_FAILED' } }, { status: 502, headers: noStore });
  }
}
