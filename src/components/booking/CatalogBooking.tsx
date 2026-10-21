'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ApiError, postGhoomo } from '@/lib/api';
import { dict, localePath, type Locale } from '@/i18n';
import { indianMobile } from '@/lib/enquiry';
import { indiaNow } from '@/lib/booking/trip';
import { payPlan, type PayChoice } from '@/lib/booking/pay';
import { brand } from '@/lib/site';

type Per = 'person' | 'jeep' | 'personNight';
export type PackageChoice = { kind: 'package'; slug: string; cars: Array<{ key: string; label: string; rupees: number; seats: number }> };
export type SafariChoice = { kind: 'safari'; spot: string; offers: Array<{ key: string; name: string; rupees: number; per: Per }> };
type Quote = {
  title: string; lines: Array<{ label: string; rupees: number }>; fareRupees: number; gstPercent: number;
  gstRupees: number; totalRupees: number; minAdvanceRupees: number;
};
type Created = { booking: { _id: string }; payment: { paymentUrl?: string }; guestToken?: string };

const money = (n: number, locale: Locale) => `₹${Math.round(n).toLocaleString(locale === 'hi' ? 'hi-IN' : 'en-IN')}`;

/**
 * Booking a tour package or a desert safari (owner, 20 Oct 2026 — Phase 2 decisions 4 and 5):
 * the choice, the server's price for it, then the same details and payment choice as a cab.
 * The browser never sends a price — only what was chosen (backend ghoomoCatalogBooking).
 */
export function CatalogBooking({ locale, choice, initial }: { locale: Locale; choice: PackageChoice | SafariChoice; initial?: string }) {
  const t = dict(locale).tourBook;
  const f = dict(locale).flow;
  const [today] = useState(() => indiaNow().date);
  const [vehicle, setVehicle] = useState(choice.kind === 'package' ? (choice.cars.some((c) => c.key === initial) ? initial! : choice.cars[0]?.key) : '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState(choice.kind === 'package' ? '08:00' : '16:00');
  const [pax, setPax] = useState(2);
  const [qty, setQty] = useState<Record<string, number>>(() => (choice.kind === 'safari' && initial && choice.offers.some((o) => o.key === initial) ? { [initial]: 1 } : {}));
  const [nights, setNights] = useState<Record<string, number>>({});
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneLocked, setPhoneLocked] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [payChoice, setPayChoice] = useState<PayChoice>('min');
  const [custom, setCustom] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [reviewOk, setReviewOk] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const asked = useRef('');

  const words = (code: string) => (t.errors as Record<string, string>)[code] ?? (f.errors as Record<string, string>)[code] ?? f.errors.generic;

  // What was chosen, as the backend takes it — null until it is a whole choice.
  const selection = useMemo(() => {
    if (!date || pax < 1) return null;
    if (choice.kind === 'package') return vehicle ? { slug: choice.slug, vehicle, startDate: date, pickupTime: time, pax } : null;
    const items = choice.offers.filter((o) => (qty[o.key] ?? 0) > 0).map((o) => ({
      offer: o.key, qty: qty[o.key], ...(o.per === 'personNight' ? { nights: nights[o.key] ?? 1 } : {}),
    }));
    return items.length ? { spot: choice.spot, date, time, pax, items } : null;
  }, [choice, vehicle, date, time, pax, qty, nights]);

  // The price follows the choice — asked once the choice settles, never sent back.
  useEffect(() => {
    if (!selection) return;
    const key = JSON.stringify(selection);
    const timer = window.setTimeout(async () => {
      if (asked.current === key) return;
      asked.current = key;
      setQuoting(true);
      try {
        setQuote(await postGhoomo<Quote>(choice.kind === 'package' ? '/package/quote' : '/safari/quote', selection));
        setError('');
      } catch (e) {
        setQuote(null);
        setError(words(e instanceof ApiError ? e.code : 'network'));
      } finally { setQuoting(false); }
    }, 350);
    return () => window.clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `words` is stable per locale
  }, [selection, choice.kind]);

  useEffect(() => {
    let live = true;
    fetch('/api/auth/session', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((b) => {
      const user = b?.data?.user as { phone?: string; name?: string } | undefined;
      const mobile = user?.phone ? indianMobile(user.phone) : null;
      if (!live || !mobile) return;
      setPhone(mobile); setPhoneLocked(true);
      if (user?.name) setName((n) => n || user.name!);
    }).catch(() => {});
    return () => { live = false; };
  }, []);

  // The server's amounts, in this page's language: its line labels are English (for the payment
  // page and the desk); line i is item i of the choice, in the order sent.
  const lineWords = (i: number): string => {
    if (choice.kind === 'package') return `${t.car}: ${choice.cars.find((c) => c.key === vehicle)?.label ?? ''}`;
    const item = selection && 'items' in selection ? selection.items?.[i] : undefined;
    const offer = item ? choice.offers.find((o) => o.key === item.offer) : undefined;
    if (!item || !offer) return quote?.lines[i]?.label ?? '';
    const count = offer.per === 'jeep' ? t.jeeps(item.qty) : t.people(item.qty);
    return `${offer.name} · ${count}${'nights' in item && item.nights ? ` × ${item.nights} ${t.nights}` : ''}`;
  };

  const money3 = quote ? { totalRupees: quote.fareRupees, minAdvanceRupees: quote.minAdvanceRupees, gstRupees: quote.gstRupees } : null;
  const plan = money3 ? payPlan(money3, payChoice, Number(custom)) : null;
  const seats = choice.kind === 'package' ? choice.cars.find((c) => c.key === vehicle)?.seats ?? 4 : 50;

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (paying) return;
    if (!selection) return setError(choice.kind === 'safari' ? t.chooseSomething : f.errors.generic);
    const mobile = indianMobile(phone);
    if (!mobile) return setError(f.errors.phone);
    if (pax > seats) return setError(f.errors.seats);
    if (!quote || !plan) return;
    if (!plan.ok) return setError(f.errors.amount);
    if (!accepted) return setError(f.errors.accept);
    setError(''); setPaying(true);
    try {
      const created = await postGhoomo<Created>(choice.kind === 'package' ? '/bookings/package' : '/bookings/safari', {
        ...selection, phone: mobile, ...(name.trim() ? { name: name.trim() } : {}),
        ...(address.trim() ? { pickupAddress: address.trim() } : {}), policyAccepted: true, ...(reviewOk ? { reviewConsent: true } : {}), ...plan.body,
      });
      const url = created.payment.paymentUrl;
      if (!url || !(/^https:\/\//i.test(url) || url.startsWith('http://localhost:'))) throw new ApiError('generic', 'No payment link');
      if (created.guestToken) {
        try { window.sessionStorage.setItem(`ghoomo-booking:${created.booking._id}`, created.guestToken); } catch { /* fine */ }
      }
      window.location.assign(url);
    } catch (err) {
      setError(words(err instanceof ApiError ? err.code : 'network'));
      setPaying(false);
    }
  }

  const field = 'min-h-12 w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal';
  const fieldLabel = 'flex flex-col gap-1.5 text-sm font-semibold';
  const stepper = (value: number, set: (n: number) => void, min: number, max: number, label: string) => (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <button type="button" onClick={() => set(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${t.less} — ${label}`} className="grid size-11 place-items-center rounded-full border border-ink/20 text-lg font-bold disabled:opacity-40">−</button>
      <span className="min-w-8 text-center font-semibold" aria-live="polite">{value}</span>
      <button type="button" onClick={() => set(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${t.more} — ${label}`} className="grid size-11 place-items-center rounded-full border border-ink/20 text-lg font-bold disabled:opacity-40">+</button>
    </div>
  );
  const perWords: Record<Per, string> = { person: t.perPerson, jeep: t.perJeep, personNight: t.perPersonNight };

  return (
    <form onSubmit={pay} noValidate className="space-y-6">
      {choice.kind === 'package' ? (
        <fieldset className="space-y-2">
          <legend className="mb-2 font-semibold">{t.car}</legend>
          {choice.cars.map((c) => (
            <label key={c.key} className={`flex min-h-12 items-center gap-3 rounded-xl border p-3 ${vehicle === c.key ? 'border-royal-600 bg-royal-50' : 'border-ink/15 bg-white'}`}>
              <input type="radio" name="car" className="size-5 accent-royal" checked={vehicle === c.key} onChange={() => setVehicle(c.key)} />
              <span className="flex-1 font-semibold">{c.label} <span className="font-normal text-muted">· {f.seatsUpTo(c.seats)}</span></span>
              <span className="font-bold text-royal-700">{money(c.rupees, locale)}</span>
            </label>
          ))}
        </fieldset>
      ) : (
        <fieldset className="space-y-3">
          <legend className="mb-2 font-semibold">{t.rides}</legend>
          {choice.offers.map((o) => (
            <div key={o.key} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/15 bg-white p-3">
              <div className="min-w-0">
                <p className="font-semibold">{o.name}</p>
                <p className="text-sm text-muted">{money(o.rupees, locale)} · {perWords[o.per]}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {stepper(qty[o.key] ?? 0, (n) => setQty((q) => ({ ...q, [o.key]: n })), 0, Math.max(1, pax), o.name)}
                {o.per === 'personNight' && (qty[o.key] ?? 0) > 0 ? (
                  <span className="flex items-center gap-2 text-sm">{t.nights}{stepper(nights[o.key] ?? 1, (n) => setNights((m) => ({ ...m, [o.key]: n })), 1, 7, `${o.name} — ${t.nights}`)}</span>
                ) : null}
              </div>
            </div>
          ))}
        </fieldset>
      )}

      <div className="grid grid-cols-2 gap-3">
        <label className={fieldLabel}>{choice.kind === 'package' ? t.startDate : t.date}<input className={field} type="date" min={today} required value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <label className={fieldLabel}>{choice.kind === 'package' ? t.pickupTime : t.time}<input className={field} type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
        <div className={fieldLabel}>{t.travellers}{stepper(pax, setPax, 1, seats, t.travellers)}</div>
      </div>

      <section aria-live="polite" className="rounded-xl border border-ink/10 bg-white p-4 shadow-card">
        <h2 className="font-semibold">{t.priceFor}</h2>
        {quote ? (
          <dl className="mt-2 space-y-1.5 text-sm">
            {quote.lines.map((l, i) => <div key={l.label} className="flex justify-between gap-4"><dt>{lineWords(i)}</dt><dd>{money(l.rupees, locale)}</dd></div>)}
            <div className="flex justify-between gap-4"><dt>{f.gst(quote.gstPercent)}</dt><dd>{money(quote.gstRupees, locale)}</dd></div>
            <div className="flex justify-between gap-4 border-t border-ink/10 pt-1.5 font-bold"><dt>{f.total}</dt><dd>{money(quote.totalRupees, locale)}</dd></div>
          </dl>
        ) : <p className="mt-2 text-sm text-muted">{quoting ? t.quoting : choice.kind === 'safari' && !selection ? t.chooseSomething : ''}</p>}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={fieldLabel}>{f.phone}
          <input className={field} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} required value={phone} readOnly={phoneLocked} onChange={(e) => setPhone(e.target.value)} />
          <span className="font-normal text-muted">{phoneLocked ? f.signedInAs(phone) : f.phoneHint}</span>
        </label>
        <label className={fieldLabel}>{f.name}<input className={field} autoComplete="name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label className={`${fieldLabel} sm:col-span-2`}>{t.pickupAddress}<input className={field} autoComplete="street-address" maxLength={200} placeholder={f.addressHint} value={address} onChange={(e) => setAddress(e.target.value)} /></label>
      </div>

      {quote ? (
        <fieldset className="space-y-3 rounded-xl border border-ink/10 bg-white p-4">
          <legend className="px-1 font-semibold">{f.payTitle}</legend>
          {([['min', f.payMin, quote.minAdvanceRupees], ['full', f.payFull, quote.fareRupees], ['custom', f.payCustom, null]] as const).map(([key, label, amount]) => (
            <label key={key} className="flex min-h-11 items-center gap-3">
              <input type="radio" name="pay" className="size-5 accent-royal" checked={payChoice === key} onChange={() => setPayChoice(key)} />
              <span className="flex-1">{label}</span>
              {amount !== null ? <span className="font-semibold">{money(amount, locale)}</span> : null}
            </label>
          ))}
          {payChoice === 'custom' ? (
            <label className={fieldLabel}>{f.amount}
              <input className={field} type="number" inputMode="numeric" min={quote.minAdvanceRupees} max={quote.fareRupees} value={custom} onChange={(e) => setCustom(e.target.value)} />
              <span className="font-normal text-muted">{f.amountRange(money(quote.minAdvanceRupees, locale), money(quote.fareRupees, locale))}</span>
            </label>
          ) : null}
          {plan?.ok ? (
            <dl className="space-y-1 border-t border-ink/10 pt-3 text-sm">
              <div className="flex justify-between gap-4 font-bold"><dt>{f.payNow}</dt><dd>{money(plan.payNowRupees, locale)}</dd></div>
              <div className="flex justify-between gap-4"><dt>{f.payLater}</dt><dd>{money(plan.laterRupees, locale)}</dd></div>
              <dd className="text-muted">{f.gstNow}</dd>
            </dl>
          ) : null}
        </fieldset>
      ) : null}

      <p className="text-sm">{f.policyRead} <a className="text-royal-600 underline" href={localePath('/terms', locale)}>{f.terms}</a> · <a className="text-royal-600 underline" href={localePath('/refund', locale)}>{f.refund}</a>.</p>
      <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" className="mt-1 size-5 shrink-0 accent-royal" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} /><span>{f.accept}</span></label>
      <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" className="mt-1 size-5 shrink-0 accent-royal" checked={reviewOk} onChange={(e) => setReviewOk(e.target.checked)} /><span>{f.reviewOk}</span></label>
      {error ? <p role="alert" className="rounded-lg bg-maroon-50 p-3 text-sm text-maroon-700">{error} <a className="ml-1 font-semibold underline" href={brand.phoneHref}>{brand.phone}</a></p> : null}
      <button type="submit" disabled={!quote || paying} className="min-h-12 w-full rounded-full bg-maroon-600 px-6 font-semibold text-white shadow-card hover:bg-maroon-700 disabled:opacity-60">
        {paying ? f.paying : f.pay(plan?.ok ? money(plan.payNowRupees, locale) : '')}
      </button>
    </form>
  );
}
