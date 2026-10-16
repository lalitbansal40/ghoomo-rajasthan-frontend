import { FORT_SVG } from './paths.generated';

/**
 * The logo's fort on its rock against the setting sun — for a hero, the footer, the 404.
 * `colour`: a sun-gradient disc behind a maroon fort. `silhouette`: one colour (currentColor),
 * for a band of sand or a dark strip. Decorative.
 */
export function FortSun({
  tone = 'colour',
  className = '',
}: {
  tone?: 'colour' | 'silhouette';
  className?: string;
}) {
  const colour = tone === 'colour';
  return (
    <svg aria-hidden viewBox="40 74 130 112" className={`block ${colour ? 'text-maroon-600' : ''} ${className}`}>
      {colour ? (
        <defs>
          <linearGradient id="gr-fortsun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFD27A" />
            <stop offset="1" stopColor="#F5A623" />
          </linearGradient>
        </defs>
      ) : null}
      <circle cx="109" cy="124" r="44" fill={colour ? 'url(#gr-fortsun)' : 'currentColor'} opacity={colour ? 1 : 0.25} />
      <g transform="translate(9 0)" fill="currentColor" dangerouslySetInnerHTML={{ __html: FORT_SVG }} />
    </svg>
  );
}
