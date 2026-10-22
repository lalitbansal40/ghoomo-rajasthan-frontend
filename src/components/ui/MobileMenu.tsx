'use client';

import { HEADER_PANEL, openHeaderPanel } from '@/lib/header-panel';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

export interface MenuItem {
  label: string;
  href: string | null;
  soon?: string;
  /** A short list under the item — the destinations menu's regions. */
  children?: Array<{ label: string; href: string }>;
}

/**
 * The phone and tablet menu (below 1024 px — the full menu does not fit a 768 px tablet): a button that opens a panel of links. Esc closes it and gives focus back to
 * the button; the first link takes focus on opening. Independent of page/booking state.
 */
export function MobileMenu({ items, openLabel, closeLabel }: { items: MenuItem[]; openLabel: string; closeLabel: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (e: Event) => { if ((e as CustomEvent).detail !== 'mobile') setOpen(false); };
    document.addEventListener(HEADER_PANEL, close);
    return () => document.removeEventListener(HEADER_PANEL, close);
  }, []);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('a,button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="gr-mobile-menu"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => { if (!open) openHeaderPanel('mobile'); setOpen((v) => !v); }}
        className="grid h-11 w-11 place-items-center rounded-full text-heading hover:bg-tint"
      >
        <Icon name={open ? 'close' : 'menu'} size={24} />
      </button>
      {open ? (
        <div
          ref={panel}
          id="gr-mobile-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-edge bg-page px-4 pb-4 shadow-raised"
        >
          <ul className="flex flex-col">
            {items.map((it) => (
              <li key={it.label} className="border-b border-edge last:border-0">
                {it.href ? (
                  <Link
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center text-lg font-semibold text-heading"
                  >
                    {it.label}
                  </Link>
                ) : null}
                {it.href && it.children?.length ? (
                  <ul className="-mt-1 mb-2 grid grid-cols-2 gap-x-3 pl-3">
                    {it.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} onClick={() => setOpen(false)} className="flex min-h-10 items-center text-link">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {it.href ? null : (
                  <span aria-disabled className="flex min-h-12 items-center justify-between text-lg font-semibold text-subtle">
                    {it.label}
                    <span className="text-small rounded-full bg-sand-soft px-2">{it.soon}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
