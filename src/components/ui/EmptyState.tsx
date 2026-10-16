import type { ReactNode } from 'react';
import { Camel, DuneDivider } from '@/components/motifs';

/** Nothing to show yet: a camel on a dune, one line, and what to do instead. */
export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center overflow-hidden rounded-[var(--radius-lg)] bg-sand-50 pt-8 text-center ring-1 ring-gold-300">
      <Camel size={80} />
      <DuneDivider tone="ivory" className="!h-10" />
      <div className="w-full bg-ivory px-6 pb-8">
        <h3 className="text-h3 text-royal-700">{title}</h3>
        {body ? <p className="mt-2 text-muted">{body}</p> : null}
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}
