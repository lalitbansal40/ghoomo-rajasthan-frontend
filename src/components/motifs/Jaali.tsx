/**
 * The jaali — the carved stone lattice of a jharokha — as a faint background texture. One small
 * SVG tile, repeated by the browser. Decorative; sits behind content (`absolute inset-0`).
 */
const TILE = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>` +
    `<path d='M16 2 L19 13 L30 16 L19 19 L16 30 L13 19 L2 16 L13 13 Z' fill='none' stroke='%23946A18' stroke-width='1'/>` +
    `<circle cx='16' cy='16' r='2.4' fill='none' stroke='%23946A18' stroke-width='1'/>` +
    `<path d='M0 0 L4 4 M32 0 L28 4 M0 32 L4 28 M32 32 L28 28' stroke='%23946A18' stroke-width='1'/></svg>`,
).replace(/%2523/g, '%23');

export function Jaali({ opacity = 0.08, className = '' }: { opacity?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ backgroundImage: `url("data:image/svg+xml,${TILE}")`, backgroundSize: '32px 32px', opacity }}
    />
  );
}
