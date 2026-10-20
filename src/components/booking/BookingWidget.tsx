import { ContactButtons } from '@/components/ContactButtons';
import { dict, type Locale } from '@/i18n';
import { safe } from '@/lib/api';
import type { TripType } from '@/lib/booking/trip';
import { TripCard, type LocalPackage } from './TripCard';

/**
 * The booking widget, ready to place on any page (server side): the cities and the local
 * package come with the page — read once a day, never asked for again by the browser. If the
 * backend could not be reached at build, the card is the call / WhatsApp buttons instead.
 */
export async function BookingWidget({
  locale,
  defaultTrip,
  defaultPickup,
  defaultDrop,
  defaultVehicle,
  className = '',
}: {
  locale: Locale;
  defaultTrip?: TripType;
  defaultPickup?: string;
  defaultDrop?: string;
  defaultVehicle?: string;
  className?: string;
}) {
  const [cities, local] = await Promise.all([safe.cities(), safe.local(defaultPickup ?? 'JAIPUR')]);
  const cheapest = local?.packages.length
    ? local.packages.reduce((a, b) => (b.baseFareRupees < a.baseFareRupees ? b : a))
    : null;
  const localPackage: LocalPackage = cheapest ? { hours: cheapest.includedHours, km: cheapest.includedKm } : null;
  return (
    <div id="book" className={`scroll-mt-24 ${className}`}>
      {cities?.length ? (
        <TripCard
          locale={locale}
          cities={cities}
          localPackage={localPackage}
          defaultTrip={defaultTrip}
          defaultPickup={defaultPickup}
          defaultDrop={defaultDrop}
          defaultVehicle={defaultVehicle}
        />
      ) : (
        <div className="rounded-2xl border border-gold-300 bg-white/95 p-5 text-center shadow-raised">
          <p className="mb-4 text-ink/80">{dict(locale).widget.unavailable}</p>
          <ContactButtons locale={locale} />
        </div>
      )}
    </div>
  );
}
