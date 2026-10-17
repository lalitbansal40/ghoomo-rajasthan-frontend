'use client';

import { useEffect, useMemo, useState } from 'react';
import { ApiError, getPublic, postGhoomo, type City, type Vehicle } from '@/lib/api';
import { indianMobile } from '@/lib/enquiry';
import { dict, type Locale } from '@/i18n';
import { cityName } from '@/content/cities';
import { CityPicker } from '@/components/CityPicker';

type Trip = 'one_way' | 'round_trip';
type Quote = {
  quoteId: string; expiresAt: string; fareRupees: number; tollRupees: number;
  extras: Array<{ label: string; rupees: number }>; totalRupees: number;
  advanceRupees: number; gstPercent: number; gstRupees: number; totalWithGstRupees: number;
};
type Created = { booking: { _id: string }; payment: { paymentUrl: string }; guestToken: string };

function indiaIso(day: string, time: string) { return new Date(`${day}T${time}:00+05:30`).toISOString(); }
function indiaToday() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date()); }
function money(value: number, locale: Locale) { return `₹${Math.round(value).toLocaleString(locale === 'hi' ? 'hi-IN' : 'en-IN')}`; }
function localizedVehicle(key: string, label: string, locale: Locale) {
  if (locale === 'en') return label;
  const words = dict(locale).booking;
  const translation: Record<string, string> = { hatchback: words.hatchback, dzire: words.dzire, ertiga: words.ertiga, crysta: words.crysta, tt_12: words.tt12, tt_14: words.tt14, tt_16: words.tt16, urbania: words.urbania };
  return translation[key] ?? label;
}

export function BookingForm({ locale, from = '', to = '', car = '' }: { locale: Locale; from?: string; to?: string; car?: string }) {
  const t = dict(locale).booking;
  const [cities, setCities] = useState<City[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trip, setTrip] = useState<Trip>('one_way');
  const [pickup, setPickup] = useState(from);
  const [drop, setDrop] = useState(to);
  const [vehicle, setVehicle] = useState(car);
  const [pax, setPax] = useState('1');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('18:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const ctl = new AbortController();
    Promise.all([
      getPublic<{ cityList: City[] }>('/cities', ctl.signal),
      getPublic<{ intercity: Vehicle[]; roundTripOnly: Vehicle[] }>('/vehicles', ctl.signal),
    ]).then(([c, v]) => {
      setCities(c.cityList.filter(city => city.lat !== null && city.lng !== null));
      setVehicles([...v.intercity, ...v.roundTripOnly.map(x => ({ ...x, tripTypes: ['round_trip' as const] }))]);
    }).catch(() => setError(t.error));
    return () => ctl.abort();
  }, [t.error]);

  const allowedVehicles = useMemo(() => vehicles.filter(v => v.tripTypes.includes(trip)), [vehicles, trip]);
  const selectedVehicle = allowedVehicles.find(v => v.key === vehicle);
  const city = (key: string) => cities.find(c => c.name === key);
  const enquiryHref = `/enquiry?type=cab&product=${encodeURIComponent(`${pickup || 'custom'}-to-${drop || 'custom'}`)}`;
  const dateMin = indiaToday();

  async function getQuote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setDisabled(false);
    if (!date || !city(pickup) || !city(drop) || pickup === drop || !selectedVehicle || Number(pax) < 1 || Number(pax) > (selectedVehicle.seats ?? 4)) return setError(t.missing);
    if (new Date(indiaIso(date, time)).getTime() < Date.now() + 2 * 60 * 60 * 1000 - 60_000) return setError(t.missing);
    if (trip === 'round_trip' && (!returnDate || returnDate < date || (returnDate === date && returnTime <= time))) return setError(t.missing);
    setBusy(true);
    try {
      const result = await postGhoomo<Quote>('/booking/quote', {
        tripType: trip, vehicleType: vehicle, pickupCity: pickup, dropCity: drop,
        pickupAt: indiaIso(date, time), ...(trip === 'round_trip' ? { returnAt: indiaIso(returnDate, returnTime) } : {}),
      });
      setQuote(result);
    } catch { setError(t.error); }
    finally { setBusy(false); }
  }

  async function checkout() {
    if (!quote || busy) return;
    setError(''); setBusy(true);
    const p = city(pickup); const d = city(drop);
    if (!p || !d || p.lat === null || p.lng === null || d.lat === null || d.lng === null) { setError(t.cityError); setBusy(false); return; }
    const normalizedPhone = indianMobile(phone);
    if (!name.trim() || !normalizedPhone || !policyAccepted) { setError(t.missing); setBusy(false); return; }
    if (Number(pax) > (selectedVehicle?.seats ?? 4)) { setError(t.passengerError); setBusy(false); return; }
    try {
      const result = await postGhoomo<Created>('/bookings', {
        client: 'web', tripType: trip, vehicleType: vehicle, passengers: Number(pax),
        pickupCity: pickup, dropCity: drop, scheduledAt: indiaIso(date, time),
        ...(trip === 'round_trip' ? { returnAt: indiaIso(returnDate, returnTime) } : {}),
        quoteId: quote.quoteId, policyAccepted: true, pickup: { address: address.trim() || city(pickup)?.label, lat: p.lat, lng: p.lng },
        drop: { address: city(drop)?.label, lat: d.lat, lng: d.lng }, phone: normalizedPhone, name: name.trim(),
      });
      if (!result.payment.paymentUrl || !/^https:\/\//i.test(result.payment.paymentUrl)) throw new Error('Payment URL unavailable');
      window.location.assign(result.payment.paymentUrl);
    } catch (err) {
      const bookingIsDisabled = err instanceof ApiError && err.code === 'BOOKING_DISABLED';
      if (bookingIsDisabled) setDisabled(true);
      else if (err instanceof ApiError && err.code === 'QUOTE_EXPIRED') setQuote(null);
      setError(bookingIsDisabled ? '' : t.error);
    } finally { setBusy(false); }
  }

  const field = 'min-h-12 w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal';
  const label = 'flex flex-col gap-2 text-sm font-semibold';
  return <div className="space-y-6">
    <div><h1 className="text-h1 text-royal-600">{t.title}</h1><p className="mt-3 text-ink/80">{t.intro}</p></div>
    <form onSubmit={getQuote} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>{t.trip}<select className={field} value={trip} onChange={e => { const next = e.target.value as Trip; setTrip(next); setQuote(null); const nextVehicles = vehicles.filter(v => v.tripTypes.includes(next)); if (!nextVehicles.some(v => v.key === vehicle) && nextVehicles[0]) setVehicle(nextVehicles[0].key); }}><option value="one_way">{t.one}</option><option value="round_trip">{t.round}</option></select></label>
        <CityPicker label={t.from} placeholder={t.chooseCity} cities={cities} value={pickup} cityLabel={city => cityName(city.name, locale)} onChange={city => { setPickup(city); setQuote(null); }} />
        <CityPicker label={t.to} placeholder={t.chooseCity} cities={cities} value={drop} cityLabel={city => cityName(city.name, locale)} onChange={city => { setDrop(city); setQuote(null); }} />
        <label className={label}>{t.car}<select className={field} required value={vehicle} onChange={e => { setVehicle(e.target.value); setQuote(null); }}>{allowedVehicles.map(v => <option key={v.key} value={v.key}>{localizedVehicle(v.key, v.label, locale)}{v.seats ? ` · ${v.seats} ${t.seats}` : ''}</option>)}</select></label>
        <label className={label}>{t.passengers}<input className={field} type="number" min="1" max={selectedVehicle?.seats ?? 4} required value={pax} onChange={e => setPax(e.target.value)} /></label>
        <label className={label}>{t.date}<input className={field} type="date" min={dateMin} required value={date} onChange={e => { setDate(e.target.value); setQuote(null); }} /></label>
        <label className={label}>{t.time}<input className={field} type="time" required value={time} onChange={e => { setTime(e.target.value); setQuote(null); }} /></label>
        {trip === 'round_trip' ? <>
          <label className={label}>{t.returnDate}<input className={field} type="date" min={date || dateMin} required value={returnDate} onChange={e => { setReturnDate(e.target.value); setQuote(null); }} /></label>
          <label className={label}>{t.returnTime}<input className={field} type="time" required value={returnTime} onChange={e => { setReturnTime(e.target.value); setQuote(null); }} /></label>
        </> : null}
      </div>
      <button className="min-h-12 rounded-lg bg-royal px-6 py-3 font-semibold text-white disabled:opacity-60" disabled={busy}>{busy ? t.loading : t.quote}</button>
    </form>
    {quote ? <section aria-labelledby="fare-review" className="space-y-5 rounded-xl border border-royal/20 bg-white p-5 shadow-card">
      <h2 id="fare-review" className="text-h3 text-royal-700">{t.review}</h2>
      <dl className="space-y-2 text-sm"><div className="flex justify-between gap-4"><dt>{t.fare}</dt><dd>{money(quote.fareRupees, locale)}</dd></div><div className="flex justify-between gap-4"><dt>{t.toll}</dt><dd>{money(quote.totalRupees - quote.fareRupees, locale)}</dd></div><div className="flex justify-between gap-4"><dt>{t.gst} ({quote.gstPercent}%)</dt><dd>{money(quote.gstRupees, locale)}</dd></div><div className="flex justify-between gap-4 border-t border-ink/15 pt-2 font-bold"><dt>{t.total}</dt><dd>{money(quote.totalWithGstRupees, locale)}</dd></div><div className="flex justify-between gap-4 font-semibold"><dt>{t.advance}</dt><dd>{money(quote.advanceRupees, locale)}</dd></div><div className="flex justify-between gap-4"><dt>{t.balance}</dt><dd>{money(quote.totalWithGstRupees - quote.advanceRupees, locale)}</dd></div></dl>
      <p className="text-sm text-muted">{t.expires}: {new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(quote.expiresAt))} IST</p>
      <div className="grid gap-4 sm:grid-cols-2"><label className={label}>{t.name}<input className={field} autoComplete="name" maxLength={60} required value={name} onChange={e => setName(e.target.value)} /></label><label className={label}>{t.phone}<input className={field} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={16} required value={phone} onChange={e => setPhone(e.target.value)} /></label><label className={`${label} sm:col-span-2`}>{t.address}<input className={field} autoComplete="street-address" maxLength={200} value={address} onChange={e => setAddress(e.target.value)} /></label></div>
      <p className="text-sm">{t.policy} <a className="text-royal underline" href={locale === 'hi' ? '/hi/terms' : '/terms'}>{t.terms}</a> · <a className="text-royal underline" href={locale === 'hi' ? '/hi/refund' : '/refund'}>{t.refund}</a>.</p>
      <label className="flex items-start gap-3 text-sm leading-6"><input className="mt-1 size-5 shrink-0 accent-royal" type="checkbox" checked={policyAccepted} onChange={e => setPolicyAccepted(e.target.checked)} /><span>{t.acceptPolicy}</span></label>
      <button onClick={checkout} disabled={busy} className="min-h-12 w-full rounded-lg bg-maroon-600 px-5 py-3 font-semibold text-white disabled:opacity-60 sm:w-auto">{busy ? t.loading : t.pay}</button>
      <p className="text-sm text-muted">{t.support}</p>
    </section> : null}
    {disabled ? <p role="status" className="rounded-lg border border-maroon-600/30 bg-maroon-50 p-4">{t.disabled} <a className="ml-1 font-semibold text-royal underline" href={enquiryHref}>{t.inquire}</a></p> : null}
    {error ? <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}
  </div>;
}
