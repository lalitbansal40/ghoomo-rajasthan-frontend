/**
 * Two dune ridges in sand and gold — the strip along the bottom of a page or between
 * sections. Inline SVG, a few hundred bytes; decorative, so hidden from screen readers.
 */
export function Dunes({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      className={`block h-24 w-full sm:h-32 ${className}`}
    >
      <path fill="#E8A93A" opacity=".45" d="M0 70 C 220 10 420 10 640 50 C 860 90 1020 60 1200 20 V160 H0 Z" />
      <path fill="#F3D9A4" d="M0 110 C 240 60 460 60 700 100 C 920 136 1060 120 1200 85 V160 H0 Z" />
    </svg>
  );
}
