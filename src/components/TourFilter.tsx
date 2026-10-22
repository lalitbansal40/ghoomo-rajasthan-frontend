'use client';

import { Children, isValidElement, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Chip } from '@/components/ui/Chip';

/**
 * Filter (and, on the tours page, sort) a list of tours — by city and by days.
 *
 * The server renders EVERY card (the children, in `items` order); this only hides and reorders
 * them, so with JavaScript off the whole list is there. The choice lives in the URL
 * (`?city=&days=&sort=`) — a filtered list can be shared, and opening such a link applies it.
 */
export interface FilterItem {
  slug: string;
  cities: string[];
  days: number;
  price: number | null;
}

export function TourFilter({
  items,
  cities,
  dayBuckets,
  labels,
  sort = false,
  empty,
  children,
}: {
  items: FilterItem[];
  cities: Array<{ key: string; label: string }>;
  dayBuckets: Array<{ key: string; label: string; min: number; max: number }>;
  labels: { city: string; days: string; all: string; sort?: string; recommended?: string; byDays?: string; byPrice?: string };
  sort?: boolean;
  /** Shown when nothing matches. */
  empty: ReactNode;
  children: ReactNode;
}) {
  const [city, setCity] = useState<string | null>(null);
  const [days, setDays] = useState<string | null>(null);
  const [order, setOrder] = useState<'recommended' | 'days' | 'price'>('recommended');

  // The URL's choice, once, on arrival (the server rendered the unfiltered list).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const c = q.get('city')?.toUpperCase().replace(/-/g, '_') ?? null;
    const d = q.get('days');
    const o = q.get('sort');
    /* eslint-disable react-hooks/set-state-in-effect -- reading the URL after hydration is the point */
    if (c && cities.some((x) => x.key === c)) setCity(c);
    if (d && dayBuckets.some((x) => x.key === d)) setDays(d);
    if (o === 'days' || o === 'price') setOrder(o);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [cities, dayBuckets]);

  // …and every change back into it, without a new history entry per tap.
  const write = (c: string | null, d: string | null, o: string) => {
    const q = new URLSearchParams(window.location.search);
    if (c) q.set('city', c.toLowerCase().replace(/_/g, '-'));
    else q.delete('city');
    if (d) q.set('days', d);
    else q.delete('days');
    if (o !== 'recommended') q.set('sort', o);
    else q.delete('sort');
    const s = q.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${s ? `?${s}` : ''}`);
  };

  const cards = Children.toArray(children).filter(isValidElement);
  const shown = useMemo(() => {
    const bucket = dayBuckets.find((b) => b.key === days);
    const keep = items.map((it, i) => ({ it, i })).filter(({ it }) => {
      if (city && !it.cities.includes(city)) return false;
      if (bucket && (it.days < bucket.min || it.days > bucket.max)) return false;
      return true;
    });
    if (order === 'days') keep.sort((a, b) => a.it.days - b.it.days || (a.it.price ?? Infinity) - (b.it.price ?? Infinity));
    if (order === 'price') keep.sort((a, b) => (a.it.price ?? Infinity) - (b.it.price ?? Infinity));
    return keep.map(({ i }) => i);
  }, [items, city, days, order, dayBuckets]);

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div role="group" aria-label={labels.city} className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-small font-semibold text-subtle">{labels.city}</span>
          <Chip pressed={!city} onChange={() => { setCity(null); write(null, days, order); }}>
            {labels.all}
          </Chip>
          {cities.map((c) => (
            <Chip
              key={c.key}
              pressed={city === c.key}
              onChange={(p) => {
                const next = p ? c.key : null;
                setCity(next);
                write(next, days, order);
              }}
            >
              {c.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label={labels.days} className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-small font-semibold text-subtle">{labels.days}</span>
            {dayBuckets.map((b) => (
              <Chip
                key={b.key}
                pressed={days === b.key}
                onChange={(p) => {
                  const next = p ? b.key : null;
                  setDays(next);
                  write(city, next, order);
                }}
              >
                {b.label}
              </Chip>
            ))}
          </div>
          {sort ? (
            <label className="flex items-center gap-2 text-small font-semibold text-subtle">
              {labels.sort}
              <select
                value={order}
                onChange={(e) => {
                  const o = e.target.value as typeof order;
                  setOrder(o);
                  write(city, days, o);
                }}
                className="min-h-11 rounded-full border border-edge-strong bg-surface px-3 text-[0.9375rem] font-semibold text-heading"
              >
                <option value="recommended">{labels.recommended}</option>
                <option value="days">{labels.byDays}</option>
                <option value="price">{labels.byPrice}</option>
              </select>
            </label>
          ) : null}
        </div>
      </div>
      <div aria-live="polite" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Hidden, not removed: what the server sent stays in the page. */}
        {cards.map((card, i) => {
          const pos = shown.indexOf(i);
          return (
            <div key={items[i]?.slug ?? i} hidden={pos === -1} style={{ order: pos === -1 ? undefined : pos }}>
              {card}
            </div>
          );
        })}
      </div>
      {shown.length === 0 ? <div className="mt-6">{empty}</div> : null}
    </div>
  );
}
