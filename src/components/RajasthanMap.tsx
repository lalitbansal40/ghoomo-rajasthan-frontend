import Link from 'next/link';
import { MAP, RAJASTHAN_PATH } from './rajasthan-outline.generated';

export interface MapPoint {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  href: string;
  /** Named on the map; the rest are named on hover / focus. */
  labelled?: boolean;
  /** Where the name sits — for points so close their names would collide. */
  side?: 'left' | 'right' | 'above' | 'below';
}

const x = (lng: number) => (lng - MAP.minLng) * MAP.c * MAP.k;
const y = (lat: number) => (MAP.maxLat - lat) * MAP.k;

/**
 * Rajasthan with a point for every destination — inline SVG, no image, no script. Each point
 * is a link to its page, reachable by keyboard; the outline is Natural Earth's (public domain).
 */
export function RajasthanMap({ points, label, className = '' }: { points: MapPoint[]; label: string; className?: string }) {
  const pad = 14;
  return (
    <svg
      viewBox={`${-pad} ${-pad} ${MAP.width + pad * 2} ${MAP.height + pad * 2}`}
      role="group"
      aria-label={label}
      className={`h-auto w-full ${className}`}
    >
      <path d={RAJASTHAN_PATH} fill="var(--color-sand-200)" stroke="var(--color-gold-500)" strokeWidth="2" strokeLinejoin="round" />
      {points.map((p) => {
        const cx = x(p.lng);
        const cy = y(p.lat);
        // By default east-half labels go left, so none runs off the state's edge.
        const side = p.side ?? (cx > MAP.width * 0.62 ? 'left' : 'right');
        const lx = side === 'left' ? cx - 10 : side === 'right' ? cx + 10 : cx;
        const ly = side === 'above' ? cy - 11 : side === 'below' ? cy + 19 : cy + 4;
        const anchor = side === 'left' ? 'end' : side === 'right' ? 'start' : 'middle';
        return (
          <Link key={p.slug} href={p.href} aria-label={p.name} className="group outline-none">
            <title>{p.name}</title>
            {/* A larger, invisible target for a finger. */}
            <circle cx={cx} cy={cy} r="12" fill="transparent" />
            <circle
              cx={cx}
              cy={cy}
              r={p.labelled ? 6 : 4.5}
              fill="var(--color-maroon-600)"
              stroke="white"
              strokeWidth="2"
              className="transition-[r] group-hover:[r:8] group-focus-visible:[r:8] group-focus-visible:stroke-[var(--color-gold-700)]"
            />
            {p.labelled ? (
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                className="fill-[var(--color-royal-700)] text-[13px] font-semibold"
                style={{ paintOrder: 'stroke', stroke: 'var(--color-sand-200)', strokeWidth: 3 }}
              >
                {p.name}
              </text>
            ) : null}
          </Link>
        );
      })}
    </svg>
  );
}
