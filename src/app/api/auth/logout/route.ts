import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/session';
import { sameOriginMutation } from '@/lib/mutation-origin';

export async function POST(request: Request) {
  if (!sameOriginMutation(request)) return NextResponse.json({ ok: false, error: { code: 'ORIGIN_INVALID' } }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  await clearSession();
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
