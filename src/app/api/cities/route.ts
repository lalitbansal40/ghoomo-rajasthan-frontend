import { NextResponse } from 'next/server';
import { safe } from '@/lib/api';

/**
 * Every city a trip can start or end in, compact — [key, label, state] — for the booking widget's
 * city pickers. Asked for by the browser only when somebody starts filling a trip: the whole
 * list is 6,000+ cities (~170 KB), far too much to put in every page's HTML (home went from
 * Lighthouse 95 to 80 when it was, 21 Oct 2026). Cached for a day, like the fares.
 */
export const revalidate = 86400;

export async function GET() {
  const cities = await safe.cities();
  if (!cities) return NextResponse.json({ ok: false, error: { code: 'CITIES_UNAVAILABLE' } }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  return NextResponse.json(
    { ok: true, data: cities.map((c) => [c.name, c.label, c.state]) },
    { headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400' } },
  );
}
