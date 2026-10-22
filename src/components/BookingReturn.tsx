'use client';

import { useEffect, useState } from 'react';
import { getGhoomo, postGhoomo } from '@/lib/api';
import { dict, type Locale } from '@/i18n';
import { cityName } from '@/content/cities';

type View = {
  booking: {
    kind?: 'cab' | 'package' | 'safari';
    package?: { name: string; days: number; startDate: string };
    safari?: { name: string; date: string; items: Array<{ name: string; qty: number; nights?: number }> };
    pickup?: { address?: string }; drop?: { address?: string };
    bookingNo?: number; status: string; tripType: string; vehicleType: string; passengers?: number; pickupCity?: string; dropCity?: string; scheduledAt?: string; fareEstimate: number; gstAmount: number; totalPayable: number; paidFull: boolean };
  paid: boolean; amountPaid: number; gstPaid: number; billUrl?: string;
};
export function BookingReturn({ id, locale }: { id: string; locale: Locale }) {
  const t = dict(locale).booking;
  const [token, setToken] = useState<string | null>(null);
  const [view, setView] = useState<View | null>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cancelState, setCancelState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  // Signed in on Ghoomo Rajasthan: the booking can be cancelled from here (the backend checks it is theirs).
  useEffect(() => {
    let live = true;
    fetch('/api/auth/session', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((b) => { if (live && b?.data?.user) setSignedIn(true); }).catch(() => {});
    return () => { live = false; };
  }, []);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('g') || '';
    const key = `ghoomo-booking:${id}`;
    const saved = fromUrl || window.sessionStorage.getItem(key) || '';
    if (saved) window.sessionStorage.setItem(key, saved);
    const timer = window.setTimeout(() => setToken(saved || 'AUTH'), 0);
    if (window.location.search) window.history.replaceState(null, '', window.location.pathname);
    return () => window.clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (token === null) return;
    const ctl = new AbortController();
    let active = true;
    (async () => {
      const guestToken = token === 'AUTH' ? '' : token;
      for (let attempt = 0; attempt < (guestToken ? 3 : 1); attempt++) {
        try {
          let result: View;
          if (guestToken) {
            result = await getGhoomo<View>(`/bookings/${encodeURIComponent(id)}?g=${encodeURIComponent(guestToken)}`, ctl.signal);
          } else {
            const response = await fetch(`/api/ghoomo/bookings/${encodeURIComponent(id)}/reconcile`, { method: 'POST', cache: 'no-store', signal: ctl.signal });
            const body = await response.json().catch(() => null);
            if (!response.ok || !body?.ok) throw new Error('Booking unavailable');
            result = body.data as View;
          }
          if (!active) return;
          setView(result); setError(false);
          if (result.paid || attempt === 2) return;
        } catch { if (!active) return; setError(true); return; }
        await new Promise(resolve => window.setTimeout(resolve, 1800));
      }
    })();
    return () => { active = false; ctl.abort(); };
  }, [id, token]);

  async function retry() {
    if (token === null || busy) return;
    setBusy(true); setError(false);
    try {
      const result = token === 'AUTH'
        ? await fetch(`/api/ghoomo/bookings/${encodeURIComponent(id)}/pay-link`, { method: 'POST', cache: 'no-store' }).then(async response => {
            const body = await response.json().catch(() => null);
            if (!response.ok || !body?.ok) throw new Error('Payment retry unavailable');
            return body.data as { paymentUrl: string };
          })
        : await postGhoomo<{ paymentUrl: string }>(`/bookings/${encodeURIComponent(id)}/pay-link?g=${encodeURIComponent(token)}`, {});
      if (!/^https:\/\//i.test(result.paymentUrl)) throw new Error('Invalid payment URL');
      window.location.assign(result.paymentUrl);
    } catch { setError(true); setBusy(false); }
  }

  async function cancel() {
    if (!signedIn || cancelState === 'busy' || !window.confirm(t.cancelConfirm)) return;
    setCancelState('busy');
    try {
      const response = await fetch(`/api/ghoomo/bookings/${encodeURIComponent(id)}/cancel`, { method: 'POST', cache: 'no-store', headers: { 'content-type': 'application/json' }, body: '{}' });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) throw new Error('Cancel unavailable');
      setCancelState('done');
      setView((v) => (v ? { ...v, booking: { ...v.booking, status: 'CANCELLED' } } : v));
    } catch { setCancelState('error'); }
  }

  async function share() {
    // A guest's link carries its read-only token, so whoever it is sent to can open it.
    const link = `${window.location.origin}${window.location.pathname}${token && token !== 'AUTH' ? `?g=${encodeURIComponent(token)}` : ''}`;
    try {
      if (navigator.share) await navigator.share({ title: t.bookingNo, url: link });
      else { await navigator.clipboard.writeText(link); setCopied(true); }
    } catch { /* closed — fine */ }
  }

  const money = (n: number) => `₹${Math.round(n / 100).toLocaleString(locale === 'hi' ? 'hi-IN' : 'en-IN')}`;
  const status = view?.booking.status;
  const title = view?.paid ? t.paid : status === 'CANCELLED' ? t.cancelled : status === 'EXPIRED' ? t.expired : status === 'PAYMENT_FAILED' ? t.failed : view ? t.pending : error ? t.returnError : t.checking;
  const canRetry = !view?.paid && (status === 'PAYMENT_PENDING' || status === 'PAYMENT_FAILED');
  const canCancel = status !== undefined && ['PAYMENT_PENDING', 'PAYMENT_FAILED', 'CONFIRMED', 'DRIVER_ASSIGNED'].includes(status) && cancelState !== 'done';
  const dateWords = (d: string) => new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(`${d}T12:00:00+05:30`));
  const loginHref = `${locale === 'hi' ? '/hi' : ''}/login?next=${encodeURIComponent(`/booking/${id}`)}`;
  const vehicles: Record<string, string> = { hatchback: t.hatchback, dzire: t.dzire, ertiga: t.ertiga, crysta: t.crysta, tt_12: t.tt12, tt_14: t.tt14, tt_16: t.tt16, urbania: t.urbania };
  return <section className="mx-auto w-full max-w-2xl rounded-2xl border border-link/20 bg-surface p-5 shadow-card sm:p-8">
    <h1 className="text-h1 text-link">{title}</h1>
    {error && !view ? <p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-red-800">{t.returnError}</p> : null}
    {view ? <>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4"><dt>{t.bookingNo}</dt><dd>{view.booking.bookingNo ?? id.slice(-6).toUpperCase()}</dd></div>
        {view.booking.kind === 'package' && view.booking.package ? <>
          <div className="flex justify-between gap-4"><dt>{t.tour}</dt><dd>{view.booking.package.name}</dd></div>
          <div className="flex justify-between gap-4"><dt>{t.days}</dt><dd>{view.booking.package.days}</dd></div>
          <div className="flex justify-between gap-4"><dt>{t.starts}</dt><dd>{dateWords(view.booking.package.startDate)}</dd></div>
        </> : null}
        {view.booking.kind === 'safari' && view.booking.safari ? <>
          <div className="flex justify-between gap-4"><dt>{t.safari}</dt><dd>{view.booking.safari.name}</dd></div>
          {view.booking.safari.items.map((item) => <div key={item.name} className="flex justify-between gap-4"><dt>{item.name}</dt><dd>× {item.qty}{item.nights ? ` · ${item.nights}` : ''}</dd></div>)}
        </> : null}
        {view.booking.kind !== 'package' && view.booking.kind !== 'safari' && view.booking.pickupCity && view.booking.dropCity ? <div className="flex justify-between gap-4"><dt>{t.route}</dt><dd>{cityName(view.booking.pickupCity, locale)} → {cityName(view.booking.dropCity, locale)}</dd></div> : null}
        {view.booking.kind !== 'safari' ? <div className="flex justify-between gap-4"><dt>{t.vehicle}</dt><dd>{vehicles[view.booking.vehicleType] ?? view.booking.vehicleType}</dd></div> : null}
        {view.booking.pickup?.address ? <div className="flex justify-between gap-4"><dt>{t.pickupAddress}</dt><dd className="text-right">{view.booking.pickup.address}</dd></div> : null}
        {view.booking.kind === 'cab' || !view.booking.kind ? (view.booking.drop?.address && view.booking.drop.address !== view.booking.pickup?.address ? <div className="flex justify-between gap-4"><dt>{t.dropAddress}</dt><dd className="text-right">{view.booking.drop.address}</dd></div> : null) : null}
        {view.booking.passengers ? <div className="flex justify-between gap-4"><dt>{t.passengers}</dt><dd>{view.booking.passengers}</dd></div> : null}
        {view.booking.scheduledAt ? <div className="flex justify-between gap-4"><dt>{t.pickupTime}</dt><dd>{new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(view.booking.scheduledAt))} IST</dd></div> : null}
        <div className="flex justify-between gap-4"><dt>{t.total}</dt><dd>{money(view.booking.totalPayable)}</dd></div>
        <div className="flex justify-between gap-4"><dt>{t.paidAmount}</dt><dd>{money(view.amountPaid)}</dd></div>
        <div className="flex justify-between gap-4"><dt>{t.taxPaid}</dt><dd>{money(view.gstPaid)}</dd></div>
        <div className="flex justify-between gap-4"><dt>{t.balance}</dt><dd>{money(Math.max(0, view.booking.totalPayable - view.amountPaid))}</dd></div>
      </dl>
      {view.billUrl ? <p className="mt-5"><a className="font-semibold text-link underline" href={view.billUrl} target="_blank" rel="noreferrer" referrerPolicy="no-referrer">{t.bill}</a></p> : null}
      {!view.paid ? <><p className="mt-5 text-sm text-subtle">{t.paymentSupport}</p>{canRetry ? <button className="mt-5 min-h-12 rounded-lg bg-action px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={busy || token === null} onClick={retry}>{busy ? t.paymentLoading : t.retry}</button> : null}</> : null}
    </> : null}
    {view ? <div className="mt-6 flex flex-wrap gap-3">
      <button type="button" onClick={share} className="min-h-12 rounded-full border-2 border-link px-5 font-semibold text-link hover:bg-tint">{copied ? t.copied : t.share}</button>
      {canCancel && signedIn ? <button type="button" onClick={cancel} disabled={cancelState === 'busy'} className="min-h-12 rounded-full border-2 border-accent px-5 font-semibold text-accent hover:bg-error-surface disabled:opacity-60">{cancelState === 'busy' ? t.cancelling : t.cancel}</button> : null}
      {canCancel && !signedIn ? <a href={loginHref} className="inline-flex min-h-12 items-center font-semibold text-link underline">{t.signInToCancel}</a> : null}
    </div> : null}
    {cancelState === 'done' ? <p role="status" className="mt-3 rounded-lg bg-soft p-3 text-sm">{t.cancelDone}</p> : null}
    {cancelState === 'error' ? <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">{t.cancelError}</p> : null}
    <p className="mt-6"><a className="font-semibold text-link underline" href={locale === 'hi' ? '/hi/contact' : '/contact'}>{t.help}</a></p>
    <p className="mt-3"><a className="font-semibold text-link underline" href={locale === 'hi' ? '/hi/my-bookings' : '/my-bookings'}>{t.myBookingsLink}</a></p>
  </section>;
}
