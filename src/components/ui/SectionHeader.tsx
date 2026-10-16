import type { ReactNode } from 'react';
import { SparkleDivider } from '@/components/motifs';

/**
 * The top of a section: a small gold eyebrow, the title in Rozha One, the logo's ✦ divider and
 * an intro line. `as` keeps the heading levels right (h1 on a page's first section).
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  as: Tag = 'h2',
  align = 'center',
  className = '',
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  as?: 'h1' | 'h2';
  align?: 'center' | 'left';
  className?: string;
}) {
  const centre = align === 'center';
  return (
    <header className={`${centre ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow ? (
        <p className="text-small font-semibold uppercase tracking-[0.12em] text-gold-700 [:lang(hi)_&]:normal-case [:lang(hi)_&]:tracking-normal">
          {eyebrow}
        </p>
      ) : null}
      <Tag className={`${Tag === 'h1' ? 'text-h1' : 'text-h2'} mt-1 text-royal-600`}>{title}</Tag>
      <SparkleDivider className={`mt-3 ${centre ? 'mx-auto' : ''}`} />
      {intro ? <p className="text-body-lg mt-3 text-ink/80">{intro}</p> : null}
    </header>
  );
}
