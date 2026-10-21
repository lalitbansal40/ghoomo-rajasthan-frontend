import { ContactButtons } from '@/components/ContactButtons';
import { dict, type Locale } from '@/i18n';
import { safe } from '@/lib/api';
import type { TripType } from '@/lib/booking/trip';
import { TripCard, type LocalPackage } from './TripCard';

/**
 * The booking widget, ready to place on any page (server side): the local package and the
 * cities already filled in come with the page; the full city list is fetched by the card when
 * somebody uses it (/api/cities). If the backend could not be reached at build, the card is the
 * call / WhatsApp buttons instead.
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
  // One local package everywhere (backend /fare/local ignores the city today), so ONE cached read
  // for every page — asking per pickup city sent 100+ requests in a build and hit the API's limit.
  const [cities, local] = await Promise.all([safe.cities(), safe.local('JAIPUR')]);
  const cheapest = local?.packages.length
    ? local.packages.reduce((a, b) => (b.baseFareRupees < a.baseFareRupees ? b : a))
    : null;
  const localPackage: LocalPackage = cheapest ? { hours: cheapest.includedHours, km: cheapest.includedKm } : null;
  const { localPackage: localFn, ...words } = dict(locale).widget;
  return (
    <div id="book" className={`scroll-mt-24 ${className}`}>
      {cities?.length ? (
        <TripCard
          locale={locale}
          t={words}
          localLine={localPackage ? localFn(localPackage.hours, localPackage.km) : words.localPackageDefault}
          // Only the cities already filled in travel with the page (6,000+ would be ~700 KB).
          chosen={cities.filter((c) => c.name === defaultPickup || c.name === defaultDrop).map((c) => ({ ...c, lat: null, lng: null }))}
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
