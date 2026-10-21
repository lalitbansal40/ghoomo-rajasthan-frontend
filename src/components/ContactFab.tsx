'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { Dictionary } from '@/i18n/en';
import type { Locale } from '@/i18n/path';
import { AUTO_OPEN_AFTER_MS, autoPopupAllowed, markSeen, seenRecently } from '@/lib/callback';
import { whatsappLink } from '@/lib/site';

/** The popup's code loads only when it opens — nothing of it on a page that never asks. */
const CallbackDialog = dynamic(() => import('./CallbackDialog').then((m) => m.CallbackDialog), { ssr: false });

const storage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

/**
 * WhatsApp and "call me back", bottom right on every page (owner, 20 Oct 2026: "call and
 * whatsapp wala right bottom m button and wo popup lagao jo hello my cab m hai"), with
 * hellomycabs.com's popup rules (lib/callback.ts). On a phone they sit above the sticky Book bar
 * (StickyCta sets --sticky-cta-h) and step aside while somebody types in a form.
 */
export type ContactFabWords = Dictionary['contactFab'] & { whatsappMessage: string };

/** Words come from the layout (server): the dictionaries never travel to the browser. */
export function ContactFab({ locale, t }: { locale: Locale; t: ContactFabWords }) {
  const path = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const opener = useRef<HTMLElement | null>(null);

  const show = useCallback(() => {
    opener.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    markSeen(storage());
    opener.current?.focus?.();
  }, []);

  // Once, by itself, eight seconds in — not where somebody is booking, and not twice a day.
  useEffect(() => {
    if (!autoPopupAllowed(path) || seenRecently(storage())) return;
    const timer = setTimeout(() => {
      if (!seenRecently(storage())) show();
    }, AUTO_OPEN_AFTER_MS);
    return () => clearTimeout(timer);
  }, [path, show]);

  // Out of the way of the keyboard: a field in focus on a phone has the screen to itself.
  useEffect(() => {
    const field = (e: Event) => e.target instanceof HTMLElement && e.target.matches('input, textarea, select');
    const onIn = (e: FocusEvent) => { if (field(e) && !(e.target as HTMLElement).closest('[role="dialog"]')) setTyping(true); };
    const onOut = (e: FocusEvent) => { if (field(e)) setTyping(false); };
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => { document.removeEventListener('focusin', onIn); document.removeEventListener('focusout', onOut); };
  }, []);

  const away = typing ? 'max-md:pointer-events-none max-md:translate-y-4 max-md:opacity-0' : '';
  const round = 'grid size-12 place-items-center rounded-full text-white shadow-raised ring-2 ring-gold-300 transition-[transform,opacity] duration-[var(--dur-fast)] hover:scale-105 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 md:size-14';
  return (
    <>
      <div
        className={`gr-contact-fab fixed bottom-4 right-4 z-40 flex flex-col gap-3 md:bottom-6 md:right-6 transition-[transform,opacity] duration-[var(--dur-fast)] motion-reduce:transition-none ${away}`}
        aria-hidden={typing ? true : undefined}
      >
        <button type="button" onClick={show} aria-label={t.callback} aria-haspopup="dialog" tabIndex={typing ? -1 : undefined} className={`group relative bg-maroon-600 ${round}`}>
          <Icon name="phone" size={22} />
          <span aria-hidden className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-white opacity-0 shadow-card transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block">{t.hint}</span>
        </button>
        <a href={whatsappLink(t.whatsappMessage)} target="_blank" rel="noopener" aria-label={t.whatsapp} tabIndex={typing ? -1 : undefined} className={`bg-success ${round}`}>
          <Icon name="whatsapp" size={26} />
        </a>
      </div>
      {open ? <CallbackDialog locale={locale} t={t} path={path} onClose={close} /> : null}
    </>
  );
}
