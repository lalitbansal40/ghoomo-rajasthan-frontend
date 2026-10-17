'use client';

import { useEffect, useState } from 'react';
import { getGhoomo, postGhoomo } from '@/lib/api';
import { dict, type Locale } from '@/i18n';
import { cityName } from '@/content/cities';

type View = {
  booking: { bookingNo?: number; status: string; tripType: string; vehicleType: string; passengers?: number; pickupCity?: string; dropCity?: string; scheduledAt?: string; fareEstimate: number; gstAmount: number; totalPayable: number; paidFull: boolean };
  paid: boolean; amountPaid: number; gstPaid: number; billUrl?: string;
};
export function BookingReturn({ id, locale }: { id: string; locale: Locale }) {
  const t = dict(locale).booking;
  const [token, setToken] = useState<string | null>(null);
  const [view, setView] = useState<View | null>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

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

  const money = (n: number) => `₹${Math.round(n / 100).toLocaleString(locale === 'hi' ? 'hi-IN' : 'en-IN')}`;
  const status = view?.booking.status;
  const title = view?.paid ? t.paid : status === 'CANCELLED' ? t.cancelled : status === 'EXPIRED' ? t.expired : status === 'PAYMENT_FAILED' ? t.failed : view ? t.pending : error ? t.returnError : t.checking;
  const canRetry = !view?.paid && (status === 'PAYMENT_PENDING' || status === 'PAYMENT_FAILED');
  const vehicles: Record<string, string> = { hatchback: t.hatchback, dzire: t.dzire, ertiga: t.ertiga, crysta: t.crysta, tt_12: t.tt12, tt_14: t.tt14, tt_16: t.tt16, urbania: t.urbania };
  return <section className="mx-auto w-full max-w-2xl rounded-2xl border border-royal/20 bg-white p-5 shadow-card sm:p-8">
    <h1 className="text-h1 text-royal-600">{title}</h1>
    {error && !view ? <p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-red-800">{t.returnError}</p> : null}
    {view ? <>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4"><dt>{t.bookingNo}</dt><dd>{view.booking.bookingNo ?? id.slice(-6).toUpperCase()}</dd></div>
        {view.booking.pickupCity && view.booking.dropCity ? <div className="flex justify-between gap-4"><dt>{t.route}</dt><dd>{cityName(view.booking.pickupCity, locale)} → {cityName(view.booking.dropCity, locale)}</dd></div> : null}
        <div className="flex justify-between gap-4"><dt>{t.vehicle}</dt><dd>{vehicles[view.booking.vehicleType] ?? view.booking.vehicleType}</dd></div>
        {view.booking.passengers ? <div className="flex justify-between gap-4"><dt>{t.passengers}</dt><dd>{view.booking.passengers}</dd></div> : null}
        {view.booking.scheduledAt ? <div className="flex justify-between gap-4"><dt>{t.pickupTime}</dt><dd>{new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(view.booking.scheduledAt))} IST</dd></div> : null}
        <div className="flex justify-between gap-4"><dt>{t.total}</dt><dd>{money(view.booking.totalPayable)}</dd></div>
        <div className="flex justify-between gap-4"><dt>{t.paidAmount}</dt><dd>{money(view.amountPaid)}</dd></div>
        <div className="flex justify-between gap-4"><dt>{t.taxPaid}</dt><dd>{money(view.gstPaid)}</dd></div>
        <div className="flex justify-between gap-4"><dt>{t.balance}</dt><dd>{money(Math.max(0, view.booking.totalPayable - view.amountPaid))}</dd></div>
      </dl>
      {!view.paid ? <><p className="mt-5 text-sm text-muted">{t.paymentSupport}</p>{canRetry ? <button className="mt-5 min-h-12 rounded-lg bg-maroon-600 px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={busy || token === null} onClick={retry}>{busy ? t.paymentLoading : t.retry}</button> : null}</> : null}
    </> : null}
    <p className="mt-6"><a className="font-semibold text-royal underline" href={locale === 'hi' ? '/hi/contact' : '/contact'}>{t.help}</a></p>
    <p className="mt-3"><a className="font-semibold text-royal underline" href={locale === 'hi' ? '/hi/my-bookings' : '/my-bookings'}>{t.myBookingsLink}</a></p>
  </section>;
}
