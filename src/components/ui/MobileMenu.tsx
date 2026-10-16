'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

export interface MenuItem {
  label: string;
  href: string | null;
  soon?: string;
}

/**
 * The phone and tablet menu (below 1024 px — the full menu does not fit a 768 px tablet): a button that opens a panel of links. Esc closes it and gives focus back to
 * the button; the first link takes focus on opening. Small, and the only client code the header
 * needs.
 */
export function MobileMenu({ items, openLabel, closeLabel }: { items: MenuItem[]; openLabel: string; closeLabel: string }) {
  const [open, setOpen] = useState(false);
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
        onClick={() => setOpen((v) => !v)}
        className="grid h-11 w-11 place-items-center rounded-full text-royal-700 hover:bg-royal-50"
      >
        <Icon name={open ? 'close' : 'menu'} size={24} />
      </button>
      {open ? (
        <div
          ref={panel}
          id="gr-mobile-menu"
          className="absolute inset-x-0 top-full border-b border-gold-300 bg-ivory px-4 pb-4 shadow-raised"
        >
          <ul className="flex flex-col">
            {items.map((it) => (
              <li key={it.label} className="border-b border-sand-200 last:border-0">
                {it.href ? (
                  <Link
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center text-lg font-semibold text-royal-700"
                  >
                    {it.label}
                  </Link>
                ) : (
                  <span aria-disabled className="flex min-h-12 items-center justify-between text-lg font-semibold text-muted">
                    {it.label}
                    <span className="text-small rounded-full bg-sand-100 px-2">{it.soon}</span>
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
