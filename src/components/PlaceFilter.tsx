'use client';

import { Children, isValidElement, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Chip } from '@/components/ui/Chip';

/**
 * The destinations page's filter — by region and by kind of place.
 *
 * The server renders every region's heading and every card (the children, in `items` order);
 * this only hides what does not match, so with JavaScript off the whole list is there. The
 * choice lives in the URL (`?region=&tag=`), the same way the tours filter keeps its own.
 */
export interface PlaceItem {
  slug: string;
  region: string;
  tags: string[];
}

export function PlaceFilter({
  items,
  regions,
  tags,
  labels,
  empty,
  children,
}: {
  items: PlaceItem[];
  /** Every region with places, in page order — its heading and line. */
  regions: Array<{ key: string; name: string; line: string }>;
  tags: Array<{ key: string; label: string }>;
  labels: { region: string; kind: string; all: string };
  empty: ReactNode;
  children: ReactNode;
}) {
  const [region, setRegion] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const r = q.get('region');
    const t = q.get('tag');
    /* eslint-disable react-hooks/set-state-in-effect -- reading the URL after hydration is the point */
    if (r && regions.some((x) => x.key === r)) setRegion(r);
    if (t && tags.some((x) => x.key === t)) setTag(t);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [regions, tags]);

  const write = (r: string | null, t: string | null) => {
    const q = new URLSearchParams(window.location.search);
    if (r) q.set('region', r);
    else q.delete('region');
    if (t) q.set('tag', t);
    else q.delete('tag');
    const s = q.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${s ? `?${s}` : ''}`);
  };

  const cards = Children.toArray(children).filter(isValidElement);
  const visible = useMemo(
    () => new Set(items.filter((it) => (!region || it.region === region) && (!tag || it.tags.includes(tag))).map((it) => it.slug)),
    [items, region, tag],
  );

  const chipRow = (
    label: string,
    options: Array<{ key: string; label: string }>,
    value: string | null,
    set: (v: string | null) => void,
  ) => (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-small font-semibold text-subtle">{label}</span>
      <Chip pressed={!value} onChange={() => set(null)}>
        {labels.all}
      </Chip>
      {options.map((o) => (
        <Chip key={o.key} pressed={value === o.key} onChange={(p) => set(p ? o.key : null)}>
          {o.label}
        </Chip>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex flex-col gap-3">
        {chipRow(labels.region, regions.map((r) => ({ key: r.key, label: r.name })), region, (v) => {
          setRegion(v);
          write(v, tag);
        })}
        {chipRow(labels.kind, tags, tag, (v) => {
          setTag(v);
          write(region, v);
        })}
      </div>
      <div aria-live="polite">
        {regions.map((r) => {
          const mine = items.map((it, i) => ({ it, i })).filter(({ it }) => it.region === r.key);
          const any = mine.some(({ it }) => visible.has(it.slug));
          return (
            <section key={r.key} id={r.key} hidden={!any} className="mt-10 scroll-mt-24">
              <h2 className="text-h2 text-link">{r.name}</h2>
              <p className="mt-1 text-subtle">{r.line}</p>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {mine.map(({ it, i }) => (
                  <div key={it.slug} hidden={!visible.has(it.slug)}>
                    {cards[i]}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      {visible.size === 0 ? <div className="mt-6">{empty}</div> : null}
    </div>
  );
}
