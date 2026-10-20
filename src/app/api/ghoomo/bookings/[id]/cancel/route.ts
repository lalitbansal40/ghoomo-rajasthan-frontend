import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { getSession } from '@/lib/session';
import { sameOriginMutation } from '@/lib/mutation-origin';

const noStore = { 'Cache-Control': 'no-store' };

/** Cancel one of the signed-in customer's own Ghoomo bookings (backend refunds by its policy). */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOriginMutation(request)) return NextResponse.json({ ok: false, error: { code: 'ORIGIN_INVALID' } }, { status: 403, headers: noStore });
  const token = await getSession();
  if (!token) return NextResponse.json({ ok: false, error: { code: 'AUTH_REQUIRED' } }, { status: 401, headers: noStore });
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) return NextResponse.json({ ok: false, error: { code: 'BOOKING_NOT_FOUND' } }, { status: 404, headers: noStore });
  const input = await request.json().catch(() => null) as { reason?: unknown } | null;
  const reason = typeof input?.reason === 'string' ? input.reason.trim().slice(0, 300) : undefined;
  try {
    const upstream = await fetch(`${env.apiBaseUrl}/bookings/ghoomo/${id}/cancel`, {
      method: 'POST', cache: 'no-store',
      headers: { accept: 'application/json', 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify(reason ? { reason } : {}),
    });
    return new NextResponse(await upstream.text(), { status: upstream.status, headers: { 'content-type': 'application/json', 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'CANCEL_UNAVAILABLE' } }, { status: 502, headers: noStore });
  }
}
