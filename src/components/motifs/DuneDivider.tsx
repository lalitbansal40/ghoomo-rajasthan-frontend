/**
 * Two dune ridges — the strip between sections and along the foot of a page. `flip` turns it
 * upside down (a section that starts with dunes); `tone` picks which sand it fades into.
 * Decorative: hidden from screen readers.
 */
const TONES = {
  sand: ['#E8A93A', '#F3D9A4'],
  gold: ['#C08A22', '#E0A93B'],
  ivory: ['#F3D9A4', '#FBF7EF'],
} as const;

export function DuneDivider({
  flip = false,
  tone = 'sand',
  className = '',
}: {
  flip?: boolean;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const [back, front] = TONES[tone];
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      className={`block h-24 w-full sm:h-32 ${flip ? 'rotate-180' : ''} ${className}`}
    >
      <path fill={back} opacity=".45" d="M0 70 C 220 10 420 10 640 50 C 860 90 1020 60 1200 20 V160 H0 Z" />
      <path fill={front} d="M0 110 C 240 60 460 60 700 100 C 920 136 1060 120 1200 85 V160 H0 Z" />
    </svg>
  );
}
