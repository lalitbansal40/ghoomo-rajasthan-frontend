import Image from 'next/image';
import { ARCH_CUSPS_SVG, ARCH_INNER_D, ARCH_OUTER_D } from './paths.generated';

/**
 * A photograph inside the logo's jharokha — the cusped arch, the gold edge, the finial and the
 * sill. The photo is masked to the arch's window (an SVG mask, no JS); the band is drawn over it.
 * The arch is the logo's own (scripts/brand/art.py), so a framed photo and the logo match.
 */
const VIEW = '26 0 148 218';
const MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${VIEW}' preserveAspectRatio='none'><path d='${ARCH_INNER_D}'/></svg>`,
)}")`;

export function MehrabFrame({
  src,
  alt,
  sizes = '(min-width: 768px) 360px, 80vw',
  preload = false,
  unoptimized = false,
  srcSet,
  className = '',
}: {
  src: string;
  unoptimized?: boolean;
  /** Verified pre-generated managed derivatives, bypassing the long-lived optimizer. */
  srcSet?: string;
  alt: string;
  sizes?: string;
  /**
   * The LCP image — Next 16 `preload` (replaces the deprecated `priority`), fetched at high
   * priority and eagerly: `preload` alone left it Low and lazy, behind the scripts on a slow
   * phone (LCP 3.1 s, 16 Oct 2026).
   */
  preload?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '148 / 218' }}>
      {preload && srcSet ? <link rel="preload" as="image" href={src} imageSrcSet={srcSet} imageSizes={sizes} fetchPriority="high" /> : null}
      <div
        className="absolute inset-0"
        style={{ maskImage: MASK, WebkitMaskImage: MASK, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }}
      >
        {srcSet ? (
          // eslint-disable-next-line @next/next/no-img-element -- verified managed derivatives need native srcSet without the optimizer cache
          <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} loading={preload ? 'eager' : 'lazy'} fetchPriority={preload ? 'high' : undefined} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        ) : <Image
          src={src}
          unoptimized={unoptimized}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          fetchPriority={preload ? 'high' : undefined}
          loading={preload ? 'eager' : undefined}
          className="object-cover"
        />}
      </div>
      <svg
        viewBox={VIEW}
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        <g dangerouslySetInnerHTML={{ __html: ARCH_CUSPS_SVG }} />
        <path fill="#1E3A7B" fillRule="evenodd" d={`${ARCH_OUTER_D} ${ARCH_INNER_D}`} />
        <path fill="none" stroke="#E0A93B" strokeWidth="2.2" d="M 44 214 L 44 104 M 156 214 L 156 104" />
        <path fill="none" stroke="#E0A93B" strokeWidth="3.4" d={ARCH_OUTER_D} />
        <path fill="#E0A93B" d="M 100 0 C 104 7 105 11 100 17 C 95 11 96 7 100 0 Z" />
        <rect x="20" y="211" width="160" height="7" rx="3.5" fill="#E0A93B" />
      </svg>
    </div>
  );
}
