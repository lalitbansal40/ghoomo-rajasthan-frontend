import { CAMEL_D, SADDLE_D } from './paths.generated';

/**
 * The logo's camel. `walking` sways it gently, as if on the move — the loader and empty
 * states. CSS only, and still for anyone who asked their phone for less motion.
 */
export function Camel({
  walking = false,
  saddle = true,
  size = 64,
  className = '',
}: {
  walking?: boolean;
  saddle?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="-2 -48 64 50"
      width={size}
      height={(size * 50) / 64}
      className={`${walking ? 'gr-camel-walk' : ''} ${className}`}
    >
      <path fill="#8E1B1B" d={CAMEL_D} />
      {saddle ? <path fill="#E0A93B" d={SADDLE_D} /> : null}
    </svg>
  );
}
