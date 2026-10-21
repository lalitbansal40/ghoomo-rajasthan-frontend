'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { Dictionary } from '@/i18n/en';
import { localePath, type Locale } from '@/i18n/path';
import { postGhoomo } from '@/lib/api';
import { callbackLead, markSeen, type CallbackStage } from '@/lib/callback';
import { brand } from '@/lib/site';

const remember = () => {
  try {
    markSeen(window.localStorage);
  } catch {
    /* blocked — fine */
  }
};

/** Saved by the backend under Ghoomo Rajasthan (the route sets the brand); never awaited by the visitor. */
function send(phone: string, stage: CallbackStage, path: string, name?: string) {
  const lead = callbackLead(phone, stage, path, name);
  return lead ? postGhoomo('/booking/lead', lead).catch(() => undefined) : Promise.resolve(undefined);
}

/**
 * The call-back popup itself — hellomycabs.com's, in Ghoomo's colours. One thing asked (a
 * mobile number; a name if they like); always closable — Escape, the backdrop or Close; Tab
 * stays inside; focus goes back to what opened it (ContactFab).
 */
export function CallbackDialog({ locale, t, path, onClose }: { locale: Locale; t: Dictionary['contactFab']; path: string; onClose: () => void }) {
  const titleId = useId();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const typedSaved = useRef('');
  const thanks = useRef<HTMLAnchorElement>(null);

  // The form is gone once sent — focus moves to the next thing to do, not to the page behind.
  useEffect(() => { if (sent) thanks.current?.focus(); }, [sent]);

  // A whole number typed and not sent is still somebody to call — saved once per number.
  useEffect(() => {
    const lead = callbackLead(phone, 'callback_typed', path);
    if (sent || !lead || typedSaved.current === lead.phone) return;
    typedSaved.current = lead.phone;
    void send(phone, 'callback_typed', path);
  }, [phone, sent, path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !dialog.current) return;
      const items = [...dialog.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])')];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    const focus = setTimeout(() => input.current?.focus(), 50);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(focus); document.body.style.overflow = overflow; };
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!callbackLead(phone, 'callback', path)) return setError(t.phoneError);
    setError('');
    setBusy(true);
    // Thanked whatever the network does — their number is not their problem to retry.
    await send(phone, 'callback', path, name);
    setBusy(false);
    setSent(true);
    remember();
  }

  const field = 'min-h-12 w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal';
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" aria-hidden tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-ink/50" />
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative w-full max-w-sm rounded-2xl border border-gold-300 bg-ivory p-6 shadow-raised">
        <button type="button" onClick={onClose} aria-label={t.close} className="absolute right-3 top-3 grid size-11 place-items-center rounded-full text-muted hover:bg-sand-100 hover:text-ink">
          <Icon name="close" size={20} />
        </button>
        <span className="grid size-12 place-items-center rounded-full bg-maroon-50 text-maroon-600"><Icon name="phone" size={24} /></span>
        {sent ? (
          <div role="status">
            <h2 id={titleId} className="mt-4 text-h3 text-royal-700">{t.thanks}</h2>
            <p className="mt-2 text-ink/80">{t.thanksBody}</p>
            <div className="mt-5 flex flex-col gap-2">
              <a ref={thanks} href={`${localePath('/', locale)}#book`} onClick={onClose} className="inline-flex min-h-12 items-center justify-center rounded-full bg-royal-600 px-5 font-semibold text-white hover:bg-royal-700">{t.book}</a>
              <button type="button" onClick={onClose} className="min-h-12 rounded-full font-semibold text-royal-600 hover:bg-royal-50">{t.close}</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2 id={titleId} className="mt-4 text-h3 text-royal-700">{t.title}</h2>
            <p className="mt-2 text-ink/80">{t.intro}</p>
            <label className="mt-5 flex flex-col gap-1.5 text-sm font-semibold">{t.phone}
              <input ref={input} className={field} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d+ ]/g, ''))} aria-invalid={error ? true : undefined} aria-describedby={error ? `${titleId}-error` : undefined} />
            </label>
            {error ? <p id={`${titleId}-error`} className="mt-1.5 text-sm text-danger">{error}</p> : null}
            <label className="mt-3 flex flex-col gap-1.5 text-sm font-semibold">{t.name}
              <input className={field} autoComplete="name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <button type="submit" disabled={busy} className="mt-4 min-h-12 w-full rounded-full bg-maroon-600 px-5 font-semibold text-white hover:bg-maroon-700 disabled:opacity-60">{busy ? t.sending : t.send}</button>
            <a href={brand.phoneHref} className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm font-semibold text-royal-600 hover:text-royal-700">
              <Icon name="phone" size={16} />{t.callNow} · {brand.phone}
            </a>
          </form>
        )}
      </div>
    </div>
  );
}
