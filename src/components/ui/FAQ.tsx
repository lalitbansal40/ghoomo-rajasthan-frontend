import { Icon } from './Icon';

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Questions that open in place — <details>/<summary>, so no JavaScript. The plus turns into a
 * minus by CSS alone (group-open).
 */
export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-edge rounded-[var(--radius-md)] bg-surface ring-1 ring-line/5">
      {items.map((it) => (
        <details key={it.q} className="group px-4">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold text-heading [&::-webkit-details-marker]:hidden">
            <span>{it.q}</span>
            <span aria-hidden className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-tint text-link">
              <Icon name="plus" size={16} className="group-open:hidden" />
              <Icon name="minus" size={16} className="hidden group-open:block" />
            </span>
          </summary>
          <p className="pb-4 text-content/85">{it.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Optional semantic FAQPage for visible answers; Google FAQ rich results retired in2026. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}
