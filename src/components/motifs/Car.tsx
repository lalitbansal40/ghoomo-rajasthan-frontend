import { CAR_SVG } from './paths.generated';

/**
 * The logo's white car (owner, 16 Oct 2026: white), Ghoomo Rajasthan on its side. `moving` spins
 * the wheels and gives it a slight road bounce — the booking loader, the cab section. CSS only,
 * still under reduced motion. Decorative: say what it means in text beside it.
 */
export function Car({
  moving = false,
  size = 160,
  className = '',
}: {
  moving?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="-2 -2 124 42"
      width={size}
      height={(size * 42) / 124}
      className={`${moving ? 'gr-car-moving' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: CAR_SVG }}
    />
  );
}
