'use client';

import { useCallback, useEffect, useState } from 'react';
import { dict, type Locale } from '@/i18n';
import { cityName } from '@/content/cities';
import { indianMobile } from '@/lib/enquiry';

type Row = {
  _id: string; bookingNo?: number; status: string; vehicleType: string; passengers?: number;
  pickupCity?: string; dropCity?: string; scheduledAt?: string; fareEstimate: number;
  gstAmount: number; totalPayable?: number; bookingAmount: number; paid: boolean;
  amountPaid: number; gstPaid: number; createdAt: string;
};
type Detail = { booking: Row; paid: boolean; amountPaid: number; gstPaid: number };

export function MyBookings({ locale }: { locale: Locale }) {
  const t = dict(locale).myBookings;
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [requested, setRequested] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadBookings = useCallback(async () => {
    const response = await fetch('/api/ghoomo/bookings', { cache: 'no-store' });
    const body = await response.json().catch(() => null);
    if (response.status === 401) { setAuthenticated(false); return false; }
    if (!response.ok || !body?.ok) throw new Error('Bookings unavailable');
    setRows(body.data.bookings as Row[]);
    setAuthenticated(true);
    return true;
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/ghoomo/bookings', { cache: 'no-store' }).then(async response => {
      const body = await response.json().catch(() => null);
      if (!active) return;
      if (response.status === 401) { setAuthenticated(false); return; }
      if (!response.ok || !body?.ok) throw new Error('Bookings unavailable');
      setRows(body.data.bookings as Row[]); setAuthenticated(true);
    }).catch(() => { if (active) setError(t.loadError); });
    return () => { active = false; };
  }, [t.loadError]);

  async function sendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    const mobile = indianMobile(phone);
    if (!mobile) return setError(t.invalidPhone);
    if (!name.trim()) return setError(t.noName);
    setBusy(true);
    try {
      const response = await fetch('/api/auth/otp', { method: 'POST', cache: 'no-store', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone: mobile }) });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) throw new Error('OTP unavailable');
      setPhone(mobile); setRequested(true);
    } catch { setError(t.loadError); }
    finally { setBusy(false); }
  }

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    const mobile = indianMobile(phone);
    if (!mobile) return setError(t.invalidPhone);
    if (!/^\d{4,8}$/.test(code)) return setError(t.invalidCode);
    setBusy(true);
    try {
      const response = await fetch('/api/auth/session', { method: 'POST', cache: 'no-store', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone: mobile, code, name: name.trim() }) });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) throw new Error(body?.error?.code ?? 'OTP_INVALID');
      setAuthenticated(true); setRequested(false); setCode('');
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error && err.message === 'NAME_REQUIRED' ? t.noName : t.invalidCode);
    } finally { setBusy(false); }
  }

  async function openBooking(id: string) {
    setBusy(true); setError('');
    try {
      const response = await fetch(`/api/ghoomo/bookings/${encodeURIComponent(id)}/reconcile`, { method: 'POST', cache: 'no-store' });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) throw new Error('Booking unavailable');
      setDetail(body.data as Detail);
    } catch { setError(t.loadError); }
    finally { setBusy(false); }
  }

  async function retryPayment(id: string) {
    setBusy(true); setError('');
    try {
      const response = await fetch(`/api/ghoomo/bookings/${encodeURIComponent(id)}/pay-link`, { method: 'POST', cache: 'no-store' });
      const body = await response.json().catch(() => null);
      const url = body?.data?.paymentUrl;
      if (!response.ok || !body?.ok || typeof url !== 'string' || !/^https:\/\//i.test(url)) throw new Error('Retry unavailable');
      window.location.assign(url);
    } catch { setError(t.loadError); setBusy(false); }
  }

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' }).catch(() => undefined);
    setAuthenticated(false); setRows([]); setDetail(null); setRequested(false); setPhone(''); setName(''); setCode(''); setError('');
  }

  const money = (paise: number) => `₹${Math.round(paise / 100).toLocaleString(locale === 'hi' ? 'hi-IN' : 'en-IN')}`;
  const status = (s: string) => ({ PAYMENT_PENDING: t.pending, PAYMENT_FAILED: t.failed, CONFIRMED: t.confirmed, DRIVER_ASSIGNED: t.assigned, ONGOING: t.ongoing, COMPLETED: t.completed, CANCELLED: t.cancelled, EXPIRED: t.expired } as Record<string, string>)[s] ?? s;
  const vehicleNames: Record<string, string> = { hatchback: t.car, dzire: locale === 'hi' ? dict(locale).booking.dzire : 'Dzire', ertiga: dict(locale).booking.ertiga, crysta: dict(locale).booking.crysta, tt_12: dict(locale).booking.tt12, tt_14: dict(locale).booking.tt14, tt_16: dict(locale).booking.tt16, urbania: dict(locale).booking.urbania };
  const field = 'min-h-12 w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal';
  const label = 'flex flex-col gap-2 text-sm font-semibold';

  return <div className="mx-auto w-full max-w-3xl space-y-6">
    <div><h1 className="text-h1 text-royal-600">{t.title}</h1><p className="mt-3 text-ink/80">{t.intro}</p></div>
    {!authenticated ? <section className="rounded-xl border border-royal/20 bg-white p-5 shadow-card sm:p-7">
      {!requested ? <form onSubmit={sendCode} className="space-y-4"><label className={label}>{t.name}<input className={field} autoComplete="name" maxLength={60} required value={name} onChange={e => setName(e.target.value)} /></label><label className={label}>{t.phone}<input className={field} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={16} required value={phone} onChange={e => setPhone(e.target.value)} /></label><button className="min-h-12 rounded-lg bg-royal px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={busy}>{busy ? t.sending : t.requestCode}</button></form> : <form onSubmit={verify} className="space-y-4"><p role="status" className="text-sm text-forest">{t.sent}</p><label className={label}>{t.code}<input className={field} type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={8} required value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} /></label><button className="min-h-12 rounded-lg bg-royal px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={busy}>{busy ? t.sending : t.verify}</button></form>}
    </section> : <>
      <div className="flex justify-end"><button className="min-h-11 rounded-lg border border-royal px-4 font-semibold text-royal" onClick={signOut}>{t.signOut}</button></div>
      {detail ? <section className="rounded-xl border border-royal/20 bg-white p-5 shadow-card"><button className="text-sm text-royal underline" onClick={() => setDetail(null)}>← {t.title}</button><h2 className="mt-4 text-h3 text-royal-700">{t.details} · {detail.booking.bookingNo ?? detail.booking._id.slice(-6).toUpperCase()}</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt>{t.route}</dt><dd>{cityName(detail.booking.pickupCity ?? '', locale)} → {cityName(detail.booking.dropCity ?? '', locale)}</dd></div><div className="flex justify-between gap-4"><dt>{t.car}</dt><dd>{vehicleNames[detail.booking.vehicleType] ?? detail.booking.vehicleType}</dd></div>{detail.booking.passengers ? <div className="flex justify-between gap-4"><dt>{t.people}</dt><dd>{detail.booking.passengers}</dd></div> : null}<div className="flex justify-between gap-4"><dt>{t.status}</dt><dd>{status(detail.booking.status)}</dd></div><div className="flex justify-between gap-4"><dt>{t.total}</dt><dd>{money(detail.booking.totalPayable ?? detail.booking.fareEstimate + detail.booking.gstAmount)}</dd></div><div className="flex justify-between gap-4"><dt>{t.paid}</dt><dd>{money(detail.amountPaid)}</dd></div><div className="flex justify-between gap-4"><dt>{t.gstPaid}</dt><dd>{money(detail.gstPaid)}</dd></div><div className="flex justify-between gap-4"><dt>{t.balance}</dt><dd>{money(Math.max(0, (detail.booking.totalPayable ?? detail.booking.fareEstimate + detail.booking.gstAmount) - detail.amountPaid))}</dd></div></dl>{!detail.paid && ['PAYMENT_PENDING', 'PAYMENT_FAILED'].includes(detail.booking.status) ? <button className="mt-5 min-h-12 rounded-lg bg-maroon-600 px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={busy} onClick={() => retryPayment(detail.booking._id)}>{t.retry}</button> : null}</section> : rows.length ? <ol className="space-y-3">{rows.map(row => <li key={row._id}><button className="w-full rounded-xl border border-royal/20 bg-white p-5 text-left shadow-card hover:border-royal/50" onClick={() => openBooking(row._id)} disabled={busy}><span className="flex flex-wrap items-center justify-between gap-2 font-semibold"><span>{row.pickupCity && row.dropCity ? `${cityName(row.pickupCity, locale)} → ${cityName(row.dropCity, locale)}` : t.title}</span><span className="text-sm text-royal">{status(row.status)}</span></span><span className="mt-2 block text-sm text-muted">{row.scheduledAt ? new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(row.scheduledAt)) : ''} · {vehicleNames[row.vehicleType] ?? row.vehicleType} · {money(row.totalPayable ?? row.fareEstimate + row.gstAmount)}</span></button></li>)}</ol> : <p className="rounded-xl border border-royal/20 bg-white p-5">{t.empty}</p>}
    </>}
    {error ? <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}
  </div>;
}
