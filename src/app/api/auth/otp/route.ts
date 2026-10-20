import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { indianMobile } from '@/lib/enquiry';
import { sameOriginMutation } from '@/lib/mutation-origin';

const noStore = { 'Cache-Control': 'no-store' };

/**
 * A sign-in code for the visitor's GHOOMO RAJASTHAN account (backend /ghoomo/auth — owner,
 * 20 Oct 2026: a Ghoomo account is separate from a Hello My Cab one, even on the same number).
 */
export async function POST(request: Request) {
  if (!sameOriginMutation(request)) return NextResponse.json({ ok: false, error: { code: 'ORIGIN_INVALID' } }, { status: 403, headers: noStore });
  const input = await request.json().catch(() => null) as { phone?: unknown } | null;
  const phone = typeof input?.phone === 'string' ? indianMobile(input.phone) : null;
  if (!phone) return NextResponse.json({ ok: false, error: { code: 'PHONE_INVALID' } }, { status: 400, headers: noStore });
  try {
    const upstream = await fetch(`${env.apiBaseUrl}/ghoomo/auth/otp/request`, {
      method: 'POST', cache: 'no-store', headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const body = await upstream.json().catch(() => null);
    // Only what the page needs — never a development code or anything else the API adds.
    return NextResponse.json(body?.ok ? { ok: true, data: { sent: true, isNewUser: body.data?.isNewUser === true } } : body, { status: upstream.status, headers: noStore });
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'OTP_REQUEST_FAILED' } }, { status: 502, headers: noStore });
  }
}
