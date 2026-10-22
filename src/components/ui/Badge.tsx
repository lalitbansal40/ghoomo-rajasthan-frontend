import type { ReactNode } from 'react';

/**
 * Small labels on a card. `sample` is the one that matters most: every made-up price or package
 * carries it until the real ones arrive (PACKAGES_ARE_SAMPLE). Ink on sun passes contrast;
 * white on sun does not — so it is ink.
 */
const TONE = {
  sample: 'bg-sun-500 text-on-gold',
  popular: 'bg-action text-white',
  new: 'bg-primary text-white',
  days: 'bg-sand-soft text-content ring-1 ring-gold-500/60',
  neutral: 'bg-tint text-heading',
} as const;

export function Badge({ tone = 'neutral', children, className = '' }: { tone?: keyof typeof TONE; children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.8125rem] font-semibold leading-6 ${TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
