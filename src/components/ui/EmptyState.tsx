import type { ReactNode } from 'react';
import { Camel, DuneDivider } from '@/components/motifs';

/** Nothing to show yet: a camel on a dune, one line, and what to do instead. */
export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center overflow-hidden rounded-[var(--radius-lg)] bg-soft pt-8 text-center ring-1 ring-edge">
      <Camel size={80} />
      <DuneDivider tone="ivory" className="!h-10" />
      <div className="w-full bg-page px-6 pb-8">
        <h3 className="text-h3 text-heading">{title}</h3>
        {body ? <p className="mt-2 text-subtle">{body}</p> : null}
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}
