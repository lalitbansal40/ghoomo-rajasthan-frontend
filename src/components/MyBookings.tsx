'use client';

import { useEffect, useState } from 'react';
import { dict, localePath, type Locale } from '@/i18n';
import { cityName } from '@/content/cities';
import { loginHref } from '@/lib/account';

type Row = {
  _id: string; bookingNo?: number; status: string; kind?: 'cab' | 'package' | 'safari'; vehicleType: string;
  package?: { name: string }; safari?: { name: string };
  pickupCity?: string; dropCity?: string; scheduledAt?: string; fareEstimate: number;
  gstAmount?: number; totalPayable?: number;
};

/**
 * The signed-in customer's Ghoomo Rajasthan bookings — cab, tour and safari — each opening its
 * own page (pay again, share, cancel). Not signed in: the way to sign in, and back here after.
 */
export function MyBookings({ locale }: { locale: Locale }) {
  const t = dict(locale).myBookings;
  const a = dict(locale).account;
  const b = dict(locale).booking;
  const [state, setState] = useState<'loading' | 'signedOut' | 'ready' | 'error'>('loading');
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let live = true;
    fetch('/api/ghoomo/bookings', { cache: 'no-store' }).then(async (r) => {
      const body = await r.json().catch(() => null);
      if (!live) return;
      if (r.status === 401) return setState('signedOut');
      if (!r.ok || !body?.ok) return setState('error');
      setRows(body.data.bookings as Row[]); setState('ready');
    }).catch(() => { if (live) setState('error'); });
    return () => { live = false; };
  }, []);

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' }).catch(() => undefined);
    setRows([]); setState('signedOut');
  }

  const money = (paise: number) => `₹${Math.round(paise / 100).toLocaleString(locale === 'hi' ? 'hi-IN' : 'en-IN')}`;
  const status = (s: string) => ({ PAYMENT_PENDING: t.pending, PAYMENT_FAILED: t.failed, CONFIRMED: t.confirmed, DRIVER_ASSIGNED: t.assigned, ONGOING: t.ongoing, COMPLETED: t.completed, CANCELLED: t.cancelled, EXPIRED: t.expired } as Record<string, string>)[s] ?? s;
  const title = (r: Row) => r.kind === 'package' && r.package ? `${b.tour}: ${r.package.name}`
    : r.kind === 'safari' && r.safari ? `${b.safari}: ${r.safari.name}`
    : r.pickupCity && r.dropCity ? `${cityName(r.pickupCity, locale)} → ${cityName(r.dropCity, locale)}` : t.title;
  const date = (iso?: string) => (iso ? new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(iso)) : '');

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <h1 className="text-h1 text-royal-600">{t.title}</h1>
      {state === 'loading' ? <p className="text-muted" aria-live="polite">{t.checking}</p> : null}
      {state === 'signedOut' ? (
        <section className="rounded-xl border border-gold-300 bg-white p-5 shadow-card sm:p-7">
          <p>{a.signInToSee}</p>
          <a href={loginHref(locale, localePath('/my-bookings', locale))} className="mt-4 inline-flex min-h-12 items-center rounded-full bg-royal-600 px-6 font-semibold text-white hover:bg-royal-700">{a.login}</a>
        </section>
      ) : null}
      {state === 'error' ? <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{t.loadError}</p> : null}
      {state === 'ready' ? (
        <>
          <div className="flex justify-end"><button type="button" className="min-h-11 rounded-full border-2 border-royal-600 px-4 font-semibold text-royal-600" onClick={signOut}>{t.signOut}</button></div>
          {rows.length ? (
            <ol className="space-y-3">
              {rows.map((r) => (
                <li key={r._id}>
                  <a href={localePath(`/booking/${r._id}`, locale)} className="block rounded-xl border border-royal/20 bg-white p-5 shadow-card hover:border-royal/50">
                    <span className="flex flex-wrap items-center justify-between gap-2 font-semibold"><span>{title(r)}</span><span className="text-sm text-royal">{status(r.status)}</span></span>
                    <span className="mt-2 block text-sm text-muted">{r.bookingNo ? `#${r.bookingNo} · ` : ''}{date(r.scheduledAt)} · {money(r.totalPayable ?? r.fareEstimate + (r.gstAmount ?? 0))}</span>
                  </a>
                </li>
              ))}
            </ol>
          ) : <p className="rounded-xl border border-royal/20 bg-white p-5">{t.empty}</p>}
        </>
      ) : null}
    </div>
  );
}
