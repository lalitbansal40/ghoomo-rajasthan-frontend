import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { indianMobile } from '@/lib/enquiry';
import { setSession } from '@/lib/session';
import { sameOriginMutation } from '@/lib/mutation-origin';

export async function POST(request: Request) {
  if (!sameOriginMutation(request)) return NextResponse.json({ ok: false, error: { code: 'ORIGIN_INVALID' } }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  const input = await request.json().catch(() => null) as { phone?: unknown; code?: unknown; name?: unknown } | null;
  const phone = typeof input?.phone === 'string' ? indianMobile(input.phone) : null;
  const code = typeof input?.code === 'string' && /^\d{4,8}$/.test(input.code) ? input.code : null;
  const name = typeof input?.name === 'string' ? input.name.trim().slice(0, 60) : '';
  if (!phone || !code) return NextResponse.json({ ok: false, error: { code: 'INPUT_INVALID' } }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  try {
    const upstream = await fetch(`${env.apiBaseUrl}/auth/otp/verify`, {
      method: 'POST', cache: 'no-store', headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ phone: `91${phone}`, code, role: 'CUSTOMER', name: name || undefined, client: 'web' }),
    });
    const body = await upstream.json().catch(() => null);
    if (!upstream.ok || !body?.ok || typeof body?.data?.accessToken !== 'string') {
      return NextResponse.json(body, { status: upstream.status || 502, headers: { 'Cache-Control': 'no-store' } });
    }
    await setSession(body.data.accessToken as string);
    return NextResponse.json({ ok: true, data: { user: body.data.user } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'OTP_VERIFY_FAILED' } }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
