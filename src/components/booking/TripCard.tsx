'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState, useTransition } from 'react';
import type { City } from '@/lib/api';
import { CityPicker } from '@/components/CityPicker';
import { Icon } from '@/components/ui/Icon';
import { cityName } from '@/content/cities';
import type { Dictionary } from '@/i18n/en';
import { localePath, type Locale } from '@/i18n/path';
import { cityFromRow, pickerCities, type CityRow } from '@/lib/booking/cities';
import { LOCAL_HOURS, MAX_STOPS, indiaNow, tripProblem, tripToQuery, type Trip, type TripType } from '@/lib/booking/trip';

export type LocalPackage = { hours: number; km: number } | null;

/**
 * The one place a cab trip is described — home, the cab hub, every route and every
 * destination page (hellomycabs.com's BookingWidget, in Ghoomo's colours). It does not hold
 * the booking: it puts the trip in the URL and hands off to /booking.
 */
export function TripCard({
  locale,
  t,
  localLine,
  chosen,
  localPackage,
  defaultTrip = 'one_way',
  defaultPickup = '',
  defaultDrop = '',
  defaultVehicle,
}: {
  locale: Locale;
  /**
   * The widget's words, from the server — the dictionaries never travel to the browser (and a
   * function cannot cross to it: the local-package line comes already written, `localLine`).
   */
  t: Omit<Dictionary['widget'], 'localPackage'>;
  localLine: string;
  /** The cities already filled in (a road's two ends) — the rest load when the card is used. */
  chosen: City[];
  localPackage: LocalPackage;
  defaultTrip?: TripType;
  defaultPickup?: string;
  defaultDrop?: string;
  defaultVehicle?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tripType, setTripType] = useState<TripType>(defaultTrip);
  const [pickup, setPickup] = useState(defaultPickup);
  const [drop, setDrop] = useState(defaultDrop);
  // Each stop keeps its own id, so removing the middle one does not hand its text to the next.
  const [stops, setStops] = useState<{ id: number; city: string }[]>([]);
  const [nextId, setNextId] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('19:00');
  const [error, setError] = useState('');
  const [today] = useState(() => indiaNow().date);
  const label = (c: City) => cityName(c.name, locale);
  // 6,000+ cities: fetched once somebody starts on the card, never carried in the page's HTML.
  const [loaded, setLoaded] = useState<City[] | null>(null);
  const asked = useRef(false);
  const loadCities = useCallback(() => {
    if (asked.current) return;
    asked.current = true;
    fetch('/api/cities').then((r) => r.json()).then((b) => {
      if (b?.ok && Array.isArray(b.data)) setLoaded((b.data as CityRow[]).map(cityFromRow));
      else asked.current = false;
    }).catch(() => { asked.current = false; });
  }, []);
  const cities = pickerCities(loaded, chosen);

  const tabs: [TripType, string, string][] = [
    ['one_way', t.oneWay, t.oneWayHint],
    ['round_trip', t.roundTrip, t.roundTripHint],
    ['local', t.local, t.localHint],
  ];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trip: Trip = {
      tripType,
      pickup,
      ...(tripType !== 'local' ? { drop } : {}),
      stops: tripType === 'one_way' ? stops.map((s) => s.city) : [],
      when: date && time ? `${date}T${time}` : '',
      ...(tripType === 'round_trip' && returnDate ? { returnWhen: `${returnDate}T${returnTime}` } : {}),
      ...(tripType === 'local' ? { hours: localPackage?.hours ?? LOCAL_HOURS } : {}),
      ...(defaultVehicle && tripType !== 'local' ? { vehicle: defaultVehicle } : {}),
    };
    const problem = tripProblem(trip);
    if (problem) return setError(t.errors[problem]);
    setError('');
    startTransition(() => router.push(`${localePath('/booking', locale)}?${tripToQuery(trip)}`));
  }

  const field = 'min-h-12 w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal';
  const fieldLabel = 'flex flex-col gap-1.5 text-sm font-semibold';
  return (
    <form onSubmit={submit} onFocusCapture={loadCities} onPointerDownCapture={loadCities} noValidate aria-labelledby="book-heading" className="rounded-2xl border border-gold-300 bg-white/95 p-5 text-left shadow-raised sm:p-6">
      <h2 id="book-heading" className="sr-only">{t.heading}</h2>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-700">{t.yourTrip}</p>
      <div role="group" aria-label={t.tripType} className="mt-3 grid grid-cols-3 gap-1 rounded-xl border border-sand-200 bg-sand-50 p-1">
        {tabs.map(([key, name, hint]) => (
          <button
            key={key}
            type="button"
            aria-pressed={tripType === key}
            onClick={() => { setTripType(key); setError(''); }}
            className={`flex min-h-12 flex-col items-center justify-center rounded-lg px-1 py-1.5 leading-tight transition-colors ${tripType === key ? 'bg-royal-600 text-white shadow-card' : 'text-ink/80 hover:bg-white'}`}
          >
            <span className="text-sm font-bold">{name}</span>
            <span className={`text-[0.6875rem] ${tripType === key ? 'text-white/85' : 'text-muted'}`}>{hint}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <CityPicker label={t.from} placeholder={t.chooseCity} cities={cities} value={pickup} cityLabel={label} onChange={setPickup} />
        {tripType !== 'local' ? (
          <>
            <button type="button" onClick={() => { setPickup(drop); setDrop(pickup); }} aria-label={t.swap} className="mx-auto grid size-11 place-items-center rounded-full border border-royal-200 text-royal-600 hover:bg-royal-50 sm:mb-0.5">
              <Icon name="arrow" size={18} className="rotate-90 sm:rotate-0" />
            </button>
            <CityPicker label={t.to} placeholder={t.chooseCity} cities={cities} value={drop} cityLabel={label} onChange={setDrop} />
          </>
        ) : null}
      </div>

      {tripType === 'one_way' ? (
        <div className="mt-3 space-y-3">
          {stops.map((s, i) => (
            <div key={s.id} className="flex items-end gap-2">
              <div className="flex-1">
                <CityPicker label={`${t.stop} ${i + 1}`} placeholder={t.chooseCity} cities={cities} value={s.city} cityLabel={label} onChange={(city) => setStops((all) => all.map((x) => (x.id === s.id ? { ...x, city } : x)))} />
              </div>
              <button type="button" onClick={() => setStops((all) => all.filter((x) => x.id !== s.id))} aria-label={`${t.removeStop} (${i + 1})`} className="mb-0.5 grid size-12 place-items-center rounded-lg border border-ink/15 text-muted hover:bg-sand-100 hover:text-ink">
                <Icon name="minus" size={18} />
              </button>
            </div>
          ))}
          {stops.length < MAX_STOPS ? (
            <button type="button" onClick={() => { setStops((all) => [...all, { id: nextId, city: '' }]); setNextId((n) => n + 1); }} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-royal-600 hover:text-royal-700">
              <Icon name="plus" size={16} />{t.addStop}
            </button>
          ) : null}
        </div>
      ) : null}

      {tripType === 'local' ? (
        <p className="mt-3 rounded-lg bg-sand-50 px-3 py-2 text-sm text-ink/80">
          {localLine}
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className={fieldLabel}>{t.date}<input className={field} type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <label className={fieldLabel}>{t.time}<input className={field} type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
        {tripType === 'round_trip' ? (
          <>
            <label className={fieldLabel}>{t.returnDate}<input className={field} type="date" min={date || today} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} /></label>
            <label className={fieldLabel}>{t.returnTime}<input className={field} type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} /></label>
          </>
        ) : null}
      </div>

      {error ? <p role="alert" className="mt-4 rounded-lg bg-maroon-50 px-3 py-2 text-sm text-maroon-700">{error}</p> : null}
      <button type="submit" disabled={pending} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-maroon-600 px-6 font-semibold text-white shadow-card hover:bg-maroon-700 disabled:opacity-60">
        {pending ? t.loading : t.submit}<Icon name="arrow" size={18} />
      </button>
    </form>
  );
}
