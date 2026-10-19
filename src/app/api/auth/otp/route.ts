import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { indianMobile } from '@/lib/enquiry';
import { sameOriginMutation } from '@/lib/mutation-origin';

export async function POST(request: Request) {
  if (!sameOriginMutation(request)) return NextResponse.json({ ok: false, error: { code: 'ORIGIN_INVALID' } }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  const input = await request.json().catch(() => null) as { phone?: unknown } | null;
  const phone = typeof input?.phone === 'string' ? indianMobile(input.phone) : null;
  if (!phone) return NextResponse.json({ ok: false, error: { code: 'PHONE_INVALID' } }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  try {
    const upstream = await fetch(`${env.apiBaseUrl}/auth/otp/request`, {
      method: 'POST', cache: 'no-store', headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ phone: `91${phone}` }),
    });
    const body = await upstream.json().catch(() => null);
    return NextResponse.json(body?.ok ? { ok: true, data: { sent: true } } : body, { status: upstream.status, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'OTP_REQUEST_FAILED' } }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
