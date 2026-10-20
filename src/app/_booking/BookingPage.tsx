import { BookingFlow } from '@/components/booking/BookingFlow';
import { BookingWidget } from '@/components/booking/BookingWidget';
import { ContactButtons } from '@/components/ContactButtons';
import { Footer, Header } from '@/components/ui';
import { cityName } from '@/content/cities';
import { dict, localePath, type Locale } from '@/i18n';
import { safe, type LocalFares, type OnewayFare, type RoundtripFare } from '@/lib/api';
import { env } from '@/lib/env';
import { arrange, offersFromLocal, offersFromOneway, offersFromRoundtrip, type VehicleOffer } from '@/lib/booking/offers';
import { indiaIso, isTripType, tripFromQuery, tripProblem, tripToQuery } from '@/lib/booking/trip';

type Search = Record<string, string | string[] | undefined>;

/** A funnel read: this visitor's trip, never cached. */
async function fresh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/public${path}`, { cache: 'no-store', headers: { accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
    const body = await res.json().catch(() => null);
    return res.ok && body?.ok ? (body.data as T) : null;
  } catch {
    return null;
  }
}

/**
 * /booking — the cars for the trip in the URL, then the details and the payment (BookingFlow).
 * Without a trip it is the booking widget. Private: never indexed, never cached.
 */
export async function BookingPage({ locale, searchParams }: { locale: Locale; searchParams: Search }) {
  const t = dict(locale).flow;
  const trip = tripFromQuery(searchParams);
  const car = typeof searchParams.car === 'string' && /^[a-z0-9_]{2,30}$/.test(searchParams.car) ? searchParams.car : undefined;
  const shell = (children: React.ReactNode) => (
    <div className="flex min-h-dvh flex-col">
      <Header locale={locale} path="/booking" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-10">{children}</main>
      <Footer locale={locale} />
    </div>
  );
  const dead = (words: string, extra?: React.ReactNode) => shell(
    <div className="space-y-5 rounded-2xl border border-gold-300 bg-white p-6 text-center shadow-card">
      <p className="text-ink/80">{words}</p>
      {extra}
      <ContactButtons locale={locale} />
    </div>,
  );

  if (!trip) {
    // No trip yet: the widget, opened on the tab and city a link asked for (`?trip=local&pickup=`).
    const tab = isTripType(searchParams.trip) ? searchParams.trip : undefined;
    const from = typeof searchParams.pickup === 'string' && /^[A-Z][A-Z_]{1,39}$/.test(searchParams.pickup) ? searchParams.pickup : undefined;
    return shell(<><h1 className="mb-5 text-h1 text-royal-600">{dict(locale).widget.heading}</h1><BookingWidget locale={locale} defaultTrip={tab} defaultPickup={from} /></>);
  }

  const capabilities = await fresh<{ booking: boolean }>('/ghoomo/booking/capabilities');
  if (capabilities && !capabilities.booking) return dead(dict(locale).flow.errors.BOOKING_DISABLED);

  if (tripProblem(trip) === 'held') {
    return dead(t.held, <a href={`${localePath('/booking', locale)}?trip=local&pickup=${trip.pickup}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-royal-600 px-6 font-semibold text-white">{t.bookLocal}</a>);
  }

  const q = (o: Record<string, string>) => new URLSearchParams(o).toString();
  const [cities, vehicles, fare] = await Promise.all([
    safe.cities(),
    safe.vehicles(),
    trip.tripType === 'one_way'
      ? fresh<OnewayFare>(`/fare/oneway?${q({ pickup: trip.pickup, drop: trip.drop!, ...(trip.stops.length ? { stops: trip.stops.join(',') } : {}) })}`)
      : trip.tripType === 'round_trip'
        ? fresh<RoundtripFare>(`/fare/roundtrip?${q({ pickup: trip.pickup, drop: trip.drop!, pickupAt: indiaIso(trip.when), ...(trip.returnWhen ? { returnAt: indiaIso(trip.returnWhen) } : {}) })}`)
        : fresh<LocalFares>(`/fare/local?${q({ city: trip.pickup })}`),
  ]);
  const byKey = new Map((cities ?? []).map((c) => [c.name, c]));
  const pickup = byKey.get(trip.pickup);
  const drop = trip.drop ? byKey.get(trip.drop) : undefined;
  const stops = trip.stops.map((s) => byKey.get(s));
  if (!fare || !pickup || (trip.tripType !== 'local' && !drop) || stops.some((s) => !s)) return dead(t.noFare);

  const seats = Object.fromEntries([...(vehicles?.intercity ?? []), ...(vehicles?.roundTripOnly ?? [])].map((v) => [v.key, v.seats]));
  const all: VehicleOffer[] = trip.tripType === 'one_way'
    ? offersFromOneway(fare as OnewayFare, seats)
    : trip.tripType === 'round_trip' ? offersFromRoundtrip(fare as RoundtripFare, seats) : offersFromLocal(fare as LocalFares, seats);
  if (!all.length) return dead(t.noCars);
  const { offers, cheapest } = arrange(all, trip.vehicle);
  const gstPercent = (fare as { gstPercent?: number }).gstPercent ?? 0;
  const cityLabel = Object.fromEntries([trip.pickup, ...(trip.drop ? [trip.drop] : []), ...trip.stops].map((k) => [k, cityName(k, locale)]));

  return shell(
    <BookingFlow
      key={tripToQuery(trip)}
      locale={locale}
      trip={trip}
      offers={offers}
      cheapest={cheapest}
      gstPercent={gstPercent}
      places={{ pickup, drop, stops: stops.filter((s) => s !== undefined) }}
      car={car}
      cityLabel={cityLabel}
    />,
  );
}
