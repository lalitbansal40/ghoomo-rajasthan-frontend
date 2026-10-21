import { SVG_HEADERS, carSvg } from '@/lib/car-svg';

/** The logo's car, still (lib/car-svg.ts) — built once at deploy. */
export const dynamic = 'force-static';

export function GET() {
  return new Response(carSvg(false), { headers: SVG_HEADERS });
}
