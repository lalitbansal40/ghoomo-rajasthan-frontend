'use client';
import { useCallback, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { localePath, type Locale } from '@/i18n';
import { TravelLogin } from './TravelLogin';
type Reservation = { id: string; reference: string; revision: number; status: string; holdExpiresAt: string;
  items: Array<{ title: { en: string; hi: string }; amountPaise: number; input: { startDate: string; endDate: string };
    terms: { en: string; hi: string }; cancellation: { en: string; hi: string } }>;
  totalPaise: number; currency: string; confirmedAt?: string; createdAt: string };
type Detail = { reservation: Reservation; payment: { state: string; amountPaise: number; refundedAmount: number; refundExpectedPaise: number; needsReview: boolean } | null };
const statusText: Record<string, { en: string; hi: string }> = {
  payment_pending: { en: 'Awaiting payment', hi: 'भुगतान की प्रतीक्षा' }, confirmed: { en: 'Booking confirmed', hi: 'बुकिंग की पुष्टि हो गई' },
  expired: { en: 'Checkout hold expired', hi: 'चेकआउट की अवधि समाप्त' }, cancelled: { en: 'Cancelled', hi: 'रद्द' },
  needs_reconciliation: { en: 'Payment received; team reconciliation required', hi: 'भुगतान मिला; टीम द्वारा मिलान आवश्यक' },
};
export function TravelBookings({ locale, id }: { locale: Locale; id?: string }) {
  const hi = locale === 'hi'; const [rows, setRows] = useState<Reservation[]>([]), [detail, setDetail] = useState<Detail | null>(null);
  const [login, setLogin] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const command = useRef<{ body: string; key: string } | null>(null);
  const [checkedAt, setCheckedAt] = useState(0);
  const [cursor, setCursor] = useState<string | null>(null), [reason, setReason] = useState(''), [cancelAccepted, setCancelAccepted] = useState(false);
  const money = (v: number) => new Intl.NumberFormat(hi ? 'hi-IN' : 'en-IN', { style: 'currency', currency: 'INR' }).format(v / 100);
  const load = useCallback(async (next?: string, signal?: AbortSignal) => {
    const path = id ? `/reservations/${id}` : `/reservations${next ? `?cursor=${encodeURIComponent(next)}` : ''}`;
    const r = await fetch(`/api/travel${path}`, { cache: 'no-store', signal: signal ?? AbortSignal.timeout(20000) });
    if (signal?.aborted) return;
    if (r.status === 401) { setLogin(true); return; }
    const b = await r.json(); if (!r.ok || !b?.ok) throw Error(hi ? 'बुकिंग अभी उपलब्ध नहीं है।' : 'Bookings are unavailable right now.');
    if (signal?.aborted) return;
    setLogin(false);
    setCheckedAt(Date.now());
    if (id) setDetail(b.data as Detail);
    else { setRows(previous => next ? [...previous, ...b.data.items] : b.data.items); setCursor(b.data.cursor); }
  }, [id, hi]);
  useEffect(() => {
    let active = true; const controller = new AbortController();
    const timer = setTimeout(() => { void load(undefined, controller.signal).catch(() => { if (active) setError(hi ? 'बुकिंग लोड नहीं हुई। दोबारा कोशिश करें।' : 'Could not load bookings. Please retry.'); }); }, 0);
    return () => { active = false; controller.abort(); clearTimeout(timer); };
  }, [load, hi]);
  async function action(kind: 'pay' | 'reconcile' | 'cancel') {
    if (!id || !detail || busy) return; setBusy(true); setError('');
    const body = JSON.stringify(kind === 'cancel' ? { expectedRevision: detail.reservation.revision, reason } : {});
    if (command.current?.body !== body) command.current = { body, key: crypto.randomUUID() };
    try {
      const r = await fetch(`/api/travel/reservations/${id}/${kind}`, { method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(25000),
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': command.current.key },
        body });
      if (r.status === 401) { setLogin(true); return; }
      const b = await r.json(); if (!r.ok || !b?.ok) throw Error();
      if (kind === 'pay') {
        const u = new URL(b.data.paymentUrl);
        if (u.protocol !== 'https:' || !['rzp.io', 'razorpay.com'].includes(u.hostname) || u.port || u.username || u.password) throw Error();
        window.location.assign(u.toString());
      } else await load();
    } catch { setError(hi ? 'कार्य का परिणाम नहीं मिला। वर्तमान स्थिति जाँचें या सहायता से संपर्क करें।' : 'The result is uncertain. Check the current status or contact support.'); }
    finally { setBusy(false); }
  }
  const button = 'min-h-12 rounded-lg bg-royal px-5 py-3 font-semibold text-white disabled:opacity-50';
  if (login) return <TravelLogin locale={locale} onVerified={() => { void load().catch(() => setError(hi ? 'लोड नहीं हुआ।' : 'Could not load.')); }} />;
  const r = detail?.reservation;
  return <div className="space-y-6">
    <nav className="flex flex-wrap gap-5 text-royal underline"><Link href={localePath('/trip-requests', locale)}>{hi ? 'रिक्वेस्ट और कोटेशन' : 'Requests and quotes'}</Link><Link href={localePath('/plan-your-trip', locale)}>{hi ? 'नई यात्रा बुक करें' : 'Book a new trip'}</Link><Link href={localePath('/travel-bookings', locale)}>{hi ? 'यात्रा बुकिंग' : 'Travel bookings'}</Link><Link href={localePath('/my-bookings', locale)}>{hi ? 'कैब बुकिंग' : 'Cab bookings'}</Link></nav>
    {r ? <section className="space-y-4 rounded-xl border border-gold-300 bg-white p-5">
      <h2 className="text-h3 text-royal">{r.reference}</h2>
      <p role="status" className="font-semibold">{statusText[r.status]?.[locale] ?? r.status}</p>
      {r.status === 'payment_pending' ? <p>{hi ? 'भुगतान से पहले आपकी बुकिंग की पुष्टि नहीं हुई है। होल्ड की अंतिम समय सीमा: ' : 'Your booking is not yet confirmed. Checkout hold ends: '}{new Intl.DateTimeFormat(hi ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(r.holdExpiresAt))} IST</p> : null}
      <ol className="space-y-4">{r.items.map((i, n) => <li key={n}><h3 className="font-semibold">{i.title[locale]}</h3><p>{i.input.startDate} → {i.input.endDate} · {money(i.amountPaise)}</p><details><summary className="cursor-pointer underline">{hi ? 'स्वीकृत शर्तें' : 'Accepted terms'}</summary><p className="whitespace-pre-wrap">{i.terms[locale]}</p><p className="mt-3 whitespace-pre-wrap">{i.cancellation[locale]}</p></details></li>)}</ol>
      <p className="text-lg font-bold">{hi ? 'कुल' : 'Total'}: {money(r.totalPaise)}</p>
      {detail?.payment?.refundExpectedPaise ? <p>{hi ? 'रिफंड के लिए निर्धारित राशि' : 'Refund amount determined'}: {money(detail.payment.refundExpectedPaise)} · {hi ? 'वापस की गई राशि' : 'Refunded'}: {money(detail.payment.refundedAmount)}</p> : null}
      {detail?.payment?.needsReview ? <p role="status">{hi ? 'टीम भुगतान का मिलान कर रही है। दोबारा भुगतान न करें।' : 'The team is reconciling your payment. Do not pay again.'}</p> : null}
      <div className="flex flex-wrap gap-3">
        {r.status === 'payment_pending' && Date.parse(r.holdExpiresAt) > checkedAt && !detail?.payment?.needsReview ? <button className={button} disabled={busy} onClick={() => void action('pay')}>{hi ? 'सुरक्षित ऑनलाइन भुगतान' : 'Pay securely online'}</button> : null}
        <button className={button} disabled={busy} onClick={() => void action('reconcile')}>{hi ? 'भुगतान की स्थिति जाँचें' : 'Check payment status'}</button>
        <button className={button} disabled={busy} onClick={() => { void load().catch(() => setError(hi ? 'स्थिति उपलब्ध नहीं है।' : 'Status unavailable.')); }}>{hi ? 'स्थिति रीफ्रेश करें' : 'Refresh status'}</button>
      </div>
      {['payment_pending', 'confirmed'].includes(r.status) ? <details><summary className="cursor-pointer underline">{hi ? 'बुकिंग रद्द करना' : 'Cancel this booking'}</summary><div className="mt-4 space-y-3">
        <p>{hi ? 'ऊपर दी गई स्वीकृत रद्द करने की शर्तें लागू होंगी।' : 'The accepted cancellation terms above apply.'}</p>
        <label className="block">{hi ? 'कारण' : 'Reason'}<textarea className="mt-1 min-h-24 w-full rounded-lg border p-3" value={reason} maxLength={500} onChange={e => setReason(e.target.value)} /></label>
        <label className="flex gap-3"><input type="checkbox" checked={cancelAccepted} onChange={e => setCancelAccepted(e.target.checked)} /><span>{hi ? 'मैं लागू रद्द करने की शर्तें स्वीकार करता/करती हूँ।' : 'I accept the applicable cancellation terms.'}</span></label>
        <button className={button} disabled={busy || reason.trim().length < 5 || !cancelAccepted} onClick={() => void action('cancel')}>{hi ? 'रद्द करने की पुष्टि' : 'Confirm cancellation'}</button>
      </div></details> : null}
      <Link href={localePath('/contact', locale)} className="inline-block min-h-11 text-royal underline">{hi ? 'सहायता से संपर्क करें' : 'Contact support'}</Link>
    </section> : rows.length ? <ol className="space-y-4">{rows.map(row => <li key={row.id}><Link className="block rounded-xl border border-gold-300 bg-white p-5" href={localePath(`/travel-bookings/${row.id}`, locale)}><strong>{row.reference}</strong><p>{statusText[row.status]?.[locale] ?? row.status} · {money(row.totalPaise)}</p><p>{row.items.map(i => i.title[locale]).join(' · ')}</p></Link></li>)}</ol> : <p role="status">{hi ? 'अभी कोई यात्रा बुकिंग नहीं है।' : 'There are no travel bookings to show yet.'}</p>}
    {!id && cursor ? <button className={button} onClick={() => void load(cursor).catch(() => setError(hi ? 'और बुकिंग लोड नहीं हुई।' : 'Could not load more bookings.'))}>{hi ? 'और दिखाएँ' : 'Load more'}</button> : null}
    {error ? <p role="alert" className="rounded-lg bg-white p-4 text-maroon-600">{error}</p> : null}
  </div>;
}
