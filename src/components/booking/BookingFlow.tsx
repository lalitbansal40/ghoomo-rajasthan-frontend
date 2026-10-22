'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, postGhoomo } from '@/lib/api';
import type { City } from '@/lib/api';
import { dict, localePath, type Locale } from '@/i18n';
import { indianMobile } from '@/lib/enquiry';
import { indiaIso, tripToQuery, type Trip } from '@/lib/booking/trip';
import { payPlan, type PayChoice } from '@/lib/booking/pay';
import type { VehicleOffer } from '@/lib/booking/offers';
import { brand } from '@/lib/site';

type Quote = {
  quoteId: string; expiresAt: string; vehicleType: string; fareRupees: number; tollRupees?: number;
  extras: Array<{ label: string; rupees: number }>; totalRupees: number; minAdvanceRupees: number;
  gstPercent: number; gstRupees: number; totalWithGstRupees: number; days?: number;
};
type Created = { booking: { _id: string }; payment: { paymentUrl?: string }; guestToken?: string };
export type Places = { pickup: City; drop?: City; stops: City[] };

const money = (n: number, locale: Locale) => `₹${Math.round(n).toLocaleString(locale === 'hi' ? 'hi-IN' : 'en-IN')}`;
const errorCode = (e: unknown) => (e instanceof ApiError ? e.code : 'network');

/**
 * Choose a car, then the details and the payment — hellomycabs.com's /booking and
 * /booking/details in one page (owner, 20 Oct 2026). The chosen car is in the URL (`car`), so
 * back returns to the cars and a refresh asks for a fresh price — never losing what was typed.
 */
export function BookingFlow({
  locale, trip, offers, cheapest, gstPercent, places, car, cityLabel,
}: {
  locale: Locale; trip: Trip; offers: VehicleOffer[]; cheapest: string | null; gstPercent: number;
  places: Places; car?: string; cityLabel: Record<string, string>;
}) {
  const t = dict(locale).flow;
  const router = useRouter();
  const offer = offers.find((o) => o.key === car);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneLocked, setPhoneLocked] = useState(false);
  const [name, setName] = useState('');
  const [pax, setPax] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [choice, setChoice] = useState<PayChoice>('min');
  const [custom, setCustom] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [reviewOk, setReviewOk] = useState(false);
  const [paying, setPaying] = useState(false);
  const [left, setLeft] = useState<number | null>(null);
  const leadSent = useRef('');

  const ask = useCallback(async (vehicleType: string) => {
    setQuoting(vehicleType); setError('');
    try {
      const q = await postGhoomo<Quote>('/booking/quote', {
        tripType: trip.tripType, vehicleType,
        ...(trip.tripType === 'local' ? { hours: trip.hours } : { pickupCity: trip.pickup, dropCity: trip.drop }),
        ...(trip.tripType === 'one_way' && trip.stops.length ? { stops: trip.stops } : {}),
        pickupAt: indiaIso(trip.when),
        ...(trip.tripType === 'round_trip' && trip.returnWhen ? { returnAt: indiaIso(trip.returnWhen) } : {}),
      });
      setQuote(q);
      return q;
    } catch (e) {
      const code = errorCode(e);
      setError((t.errors as Record<string, string>)[code] ?? t.errors.generic);
      return null;
    } finally { setQuoting(null); }
  }, [trip, t.errors]);

  // A car in the URL with no price in hand (a refresh, a shared link): ask for a fresh one.
  const haveQuote = quote?.vehicleType === car;
  useEffect(() => {
    if (!car || !offer || haveQuote) return;
    const id = window.setTimeout(() => void ask(car), 0);
    return () => window.clearTimeout(id);
  }, [car, offer, haveQuote, ask]);

  // The price holds for as long as the backend says; the page shows it running out.
  useEffect(() => {
    if (!quote) return;
    const tick = () => setLeft(Math.max(0, Date.parse(quote.expiresAt) - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [quote]);

  // Signed in on Ghoomo Rajasthan: the number and name are the account's.
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

  // A whole number typed for this price, not yet booked: the desk can call (stage phone_typed).
  useEffect(() => {
    const mobile = indianMobile(phone);
    if (!mobile || !quote || phoneLocked) return;
    const key = `${mobile}:${quote.quoteId}`;
    if (leadSent.current === key) return;
    const timer = window.setTimeout(() => {
      leadSent.current = key;
      void postGhoomo('/booking/lead', {
        phone: mobile, stage: 'phone_typed', quoteId: quote.quoteId, tripType: trip.tripType, pickup: trip.pickup,
        ...(trip.drop ? { drop: trip.drop } : {}), when: trip.when, ...(trip.returnWhen ? { returnWhen: trip.returnWhen } : {}),
        ...(trip.hours ? { hours: trip.hours } : {}), ...(trip.stops.length ? { stops: trip.stops } : {}),
        vehicleType: car, fareRupees: quote.totalRupees, ...(name.trim() ? { name: name.trim() } : {}), pagePath: '/booking',
      }).catch(() => {});
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [phone, quote, trip, car, name, phoneLocked]);

  const base = `${localePath('/booking', locale)}?${tripToQuery(trip)}`;
  function choose(key: string) {
    setQuote(null);
    router.push(`${base}&car=${encodeURIComponent(key)}`);
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!quote || !offer || paying) return;
    const mobile = indianMobile(phone);
    const people = Number(pax);
    if (!mobile) return setError(t.errors.phone);
    if (!Number.isInteger(people) || people < 1) return setError(t.errors.travellers);
    if (offer.seats && people > offer.seats) return setError(t.errors.seats);
    const plan = payPlan(quote, choice, Number(custom));
    if (!plan.ok) return setError(t.errors.amount);
    if (!accepted) return setError(t.errors.accept);
    if (left === 0) { await ask(offer.key); return setError(t.errors.QUOTE_EXPIRED); }
    setError(''); setPaying(true);
    const p = places.pickup;
    const d = places.drop ?? places.pickup;
    try {
      const created = await postGhoomo<Created>('/bookings', {
        client: 'web', paymentMethod: 'online', tripType: trip.tripType, vehicleType: offer.key, passengers: people,
        quoteId: quote.quoteId, policyAccepted: true, ...(reviewOk ? { reviewConsent: true } : {}), pickupCity: trip.pickup,
        ...(trip.tripType !== 'local' ? { dropCity: trip.drop } : {}),
        ...(trip.tripType === 'one_way' && trip.stops.length ? { stops: trip.stops } : {}),
        ...(trip.tripType === 'local' ? { hours: trip.hours } : {}),
        scheduledAt: indiaIso(trip.when),
        ...(trip.tripType === 'round_trip' && trip.returnWhen ? { returnAt: indiaIso(trip.returnWhen) } : {}),
        pickup: { lat: p.lat, lng: p.lng, address: pickupAddress.trim() || p.label },
        drop: { lat: d.lat, lng: d.lng, address: (trip.tripType === 'local' ? pickupAddress.trim() : dropAddress.trim()) || d.label },
        phone: mobile, ...(name.trim() ? { name: name.trim() } : {}), ...plan.body,
      });
      const url = created.payment.paymentUrl;
      if (!url || !(/^https:\/\//i.test(url) || url.startsWith("http://localhost:"))) throw new ApiError('generic', 'No payment link');
      if (created.guestToken) {
        try { window.sessionStorage.setItem(`ghoomo-booking:${created.booking._id}`, created.guestToken); } catch { /* fine */ }
      }
      window.location.assign(url);
    } catch (err) {
      const code = errorCode(err);
      if (code === 'QUOTE_EXPIRED' || code === 'QUOTE_MISMATCH') await ask(offer.key);
      setError((t.errors as Record<string, string>)[code] ?? t.errors.generic);
      setPaying(false);
    }
  }

  const routeWords = trip.tripType === 'local'
    ? `${cityLabel[trip.pickup]} · ${t.local}`
    : `${cityLabel[trip.pickup]} → ${[...trip.stops.map((s) => cityLabel[s]), cityLabel[trip.drop!]].join(' → ')}${trip.tripType === 'round_trip' ? ` → ${cityLabel[trip.pickup]}` : ''}`;
  const whenWords = (when: string) => new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(indiaIso(when)));
  const field = 'min-h-12 w-full rounded-lg border border-control bg-surface px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link';
  const fieldLabel = 'flex flex-col gap-1.5 text-sm font-semibold';
  const summary = (
    <div className="rounded-xl border border-edge bg-soft p-4 text-sm">
      <p className="font-semibold text-heading">{routeWords}</p>
      <p className="mt-1 text-content/80">{t.when}: {whenWords(trip.when)} IST{trip.returnWhen ? ` · ${t.returnBy}: ${whenWords(trip.returnWhen)} IST` : ''}</p>
      <a href={`${localePath('/', locale)}#book`} className="mt-2 inline-flex min-h-11 items-center font-semibold text-link underline">{t.change}</a>
    </div>
  );

  if (!car || !offer) {
    return (
      <div className="space-y-5">
        <h1 className="text-h1 text-link">{t.title}</h1>
        {summary}
        {error ? <p role="alert" className="rounded-lg bg-error-surface p-3 text-sm text-accent-strong">{error}</p> : null}
        <ul className="space-y-3">
          {offers.map((o) => {
            const terms = [
              o.seats ? t.seatsUpTo(o.seats) : null,
              o.terms.days ? t.days(o.terms.days) : null,
              o.terms.includedHours && o.terms.includedKm ? t.hoursKm(o.terms.includedHours, o.terms.includedKm) : o.terms.includedKm ? t.includesKm(o.terms.includedKm) : null,
              o.terms.extraPerKm ? t.afterKm(o.terms.extraPerKm) : null,
              o.terms.extraPerHour ? t.perHour(o.terms.extraPerHour) : null,
              o.terms.nightCharge ? t.night(o.terms.nightCharge) : null,
              o.terms.tollIncluded ? t.tollIncluded : null,
            ].filter(Boolean);
            return (
              <li key={o.key} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line/10 bg-surface p-4 shadow-card">
                <div className="min-w-0">
                  <p className="font-semibold text-content">{o.label}{o.key === cheapest ? <span className="ml-2 rounded-full bg-warning-surface px-2 py-0.5 text-xs font-bold text-gold-text">{t.cheapest}</span> : null}</p>
                  <p className="mt-1 text-sm text-subtle">{terms.join(' · ')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-right"><span className="block text-lg font-bold text-heading">{money(o.rupees, locale)}</span><span className="text-xs text-subtle">{t.plusGst(gstPercent)}</span></p>
                  <button type="button" onClick={() => choose(o.key)} disabled={quoting !== null} className="min-h-12 rounded-full bg-action px-5 font-semibold text-white hover:bg-action-hover disabled:opacity-60">{quoting === o.key ? t.choosing : t.choose}</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const plan = quote ? payPlan(quote, choice, Number(custom)) : null;
  const mmss = left === null ? '' : `${Math.floor(left / 60000)}:${String(Math.floor((left % 60000) / 1000)).padStart(2, '0')}`;
  return (
    <form onSubmit={pay} noValidate className="space-y-6">
      <h1 className="text-h1 text-link">{t.details}</h1>
      {summary}
      <section aria-labelledby="price" className="rounded-xl border border-line/10 bg-surface p-4 shadow-card">
        <h2 id="price" className="sr-only">{t.total}</h2>
        <p className="font-semibold">{t.car}: {offer.label}</p>
        {quote ? (
          <>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between gap-4"><dt>{t.fare}</dt><dd>{money(quote.fareRupees, locale)}</dd></div>
              {quote.extras.map((x) => <div key={x.label} className="flex justify-between gap-4"><dt>{x.label}</dt><dd>{money(x.rupees, locale)}</dd></div>)}
              <div className="flex justify-between gap-4"><dt>{t.gst(quote.gstPercent)}</dt><dd>{money(quote.gstRupees, locale)}</dd></div>
              <div className="flex justify-between gap-4 border-t border-line/10 pt-1.5 font-bold"><dt>{t.total}</dt><dd>{money(quote.totalWithGstRupees, locale)}</dd></div>
            </dl>
            <p className={`mt-3 text-sm ${left === 0 ? 'font-semibold text-accent-strong' : 'text-subtle'}`} aria-live="polite">
              {left === 0 ? t.expired : t.validFor(mmss)}
              {left === 0 ? <button type="button" onClick={() => void ask(offer.key)} className="ml-2 font-semibold text-link underline">{t.refresh}</button> : null}
            </p>
          </>
        ) : <p className="mt-3 text-sm text-subtle" aria-live="polite">{quoting ? t.choosing : null}</p>}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={fieldLabel}>{t.phone}
          <input className={field} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} required value={phone} readOnly={phoneLocked} onChange={(e) => setPhone(e.target.value)} />
          <span className="font-normal text-subtle">{phoneLocked ? t.signedInAs(phone) : t.phoneHint}</span>
        </label>
        <label className={fieldLabel}>{t.name}<input className={field} autoComplete="name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label className={fieldLabel}>{t.travellers}<input className={field} type="number" inputMode="numeric" min={1} max={offer.seats ?? 50} required value={pax} onChange={(e) => setPax(e.target.value)} />{offer.seats ? <span className="font-normal text-subtle">{t.seatsUpTo(offer.seats)}</span> : null}</label>
        <label className={fieldLabel}>{t.pickupAddress}<input className={field} autoComplete="street-address" maxLength={200} placeholder={t.addressHint} value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} /></label>
        {trip.tripType !== 'local' ? <label className={fieldLabel}>{t.dropAddress}<input className={field} maxLength={200} placeholder={t.addressHint} value={dropAddress} onChange={(e) => setDropAddress(e.target.value)} /></label> : null}
      </div>

      {quote ? (
        <fieldset className="space-y-3 rounded-xl border border-line/10 bg-surface p-4">
          <legend className="px-1 font-semibold">{t.payTitle}</legend>
          {([['min', t.payMin, quote.minAdvanceRupees], ['full', t.payFull, quote.totalRupees], ['custom', t.payCustom, null]] as const).map(([key, words, amount]) => (
            <label key={key} className="flex min-h-11 items-center gap-3">
              <input type="radio" name="pay" className="size-5 accent-link" checked={choice === key} onChange={() => setChoice(key)} />
              <span className="flex-1">{words}</span>
              {amount !== null ? <span className="font-semibold">{money(amount, locale)}</span> : null}
            </label>
          ))}
          {choice === 'custom' ? (
            <label className={fieldLabel}>{t.amount}
              <input className={field} type="number" inputMode="numeric" min={quote.minAdvanceRupees} max={quote.totalRupees} value={custom} onChange={(e) => setCustom(e.target.value)} />
              <span className="font-normal text-subtle">{t.amountRange(money(quote.minAdvanceRupees, locale), money(quote.totalRupees, locale))}</span>
            </label>
          ) : null}
          {plan?.ok ? (
            <dl className="space-y-1 border-t border-line/10 pt-3 text-sm">
              <div className="flex justify-between gap-4 font-bold"><dt>{t.payNow}</dt><dd>{money(plan.payNowRupees, locale)}</dd></div>
              <div className="flex justify-between gap-4"><dt>{t.payLater}</dt><dd>{money(plan.laterRupees, locale)}</dd></div>
              <dd className="text-subtle">{t.gstNow}</dd>
            </dl>
          ) : null}
        </fieldset>
      ) : null}

      <p className="text-sm">{t.policyRead} <a className="text-link underline" href={localePath('/terms', locale)}>{t.terms}</a> · <a className="text-link underline" href={localePath('/refund', locale)}>{t.refund}</a>.</p>
      <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" className="mt-1 size-5 shrink-0 accent-link" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} /><span>{t.accept}</span></label>
      <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" className="mt-1 size-5 shrink-0 accent-link" checked={reviewOk} onChange={(e) => setReviewOk(e.target.checked)} /><span>{t.reviewOk}</span></label>
      {error ? <p role="alert" className="rounded-lg bg-error-surface p-3 text-sm text-accent-strong">{error} <a className="ml-1 font-semibold underline" href={brand.phoneHref}>{brand.phone}</a></p> : null}
      <button type="submit" disabled={!quote || paying} className="min-h-12 w-full rounded-full bg-action px-6 font-semibold text-white shadow-card hover:bg-action-hover disabled:opacity-60">
        {paying ? t.paying : t.pay(plan?.ok ? money(plan.payNowRupees, locale) : '')}
      </button>
    </form>
  );
}
