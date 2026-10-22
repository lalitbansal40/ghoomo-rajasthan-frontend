'use client';

import { Children, isValidElement, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Chip } from '@/components/ui/Chip';

/**
 * The cab page's roads, grouped by the city they start from, with one row of chips to show
 * one group. The server renders every group and every card; this only hides, so with
 * JavaScript off the whole list is there. The choice is kept in the URL (`?from=jaipur`).
 */
export function RouteFilter({
  groups,
  label,
  all,
  children,
}: {
  /** Each group in page order: its key, its heading, and how many cards (children) it has. */
  groups: Array<{ key: string; name: string; count: number }>;
  label: string;
  all: string;
  children: ReactNode;
}) {
  const [group, setGroup] = useState<string | null>(null);
  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get('from');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL after hydration is the point
    if (f && groups.some((g) => g.key === f)) setGroup(f);
  }, [groups]);
  const set = (g: string | null) => {
    setGroup(g);
    const q = new URLSearchParams(window.location.search);
    if (g) q.set('from', g);
    else q.delete('from');
    const s = q.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${s ? `?${s}` : ''}${window.location.hash}`);
  };
  const cards = Children.toArray(children).filter(isValidElement);
  const starts = useMemo(() => groups.reduce<number[]>((a, g, i) => [...a, i ? a[i - 1] + groups[i - 1].count : 0], []), [groups]);

  return (
    <div>
      <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-small font-semibold text-subtle">{label}</span>
        <Chip pressed={!group} onChange={() => set(null)}>
          {all}
        </Chip>
        {groups.map((g) => (
          <Chip key={g.key} pressed={group === g.key} onChange={(p) => set(p ? g.key : null)}>
            {g.name}
          </Chip>
        ))}
      </div>
      <div aria-live="polite">
        {groups.map((g, i) => (
          <section key={g.key} hidden={Boolean(group) && group !== g.key} className="mt-8">
            <h3 className="text-h3 text-heading">{g.name}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{cards.slice(starts[i], starts[i] + g.count)}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
