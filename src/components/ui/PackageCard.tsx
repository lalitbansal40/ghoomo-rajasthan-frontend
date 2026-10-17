import Image from 'next/image';
import Link from 'next/link';
import { dict, type Locale } from '@/i18n';
import { tourPhoto } from '@/lib/tour-photo';
import { cheapest, type LocalTour } from '@/content/packages';
import { Badge } from './Badge';
import { Icon } from './Icon';
import { PriceTag } from './PriceTag';

/**
 * A tour on a list: the photo, the name, days and nights, the road (long routes cut to three
 * places and "+N more"), three highlights, the lowest price. The whole card is ONE link (no
 * link inside a link); the "See the tour" line is part of it, not a second link.
 *
 * The tour comes already in the page's language (pkgIn).
 */
export function PackageCard({
  tour,
  href,
  locale,
  preload = false,
}: {
  /** The tour in the page's language (content/packages pkgIn). */
  tour: LocalTour;
  href: string;
  locale: Locale;
  /** The LCP image — Next 16 `preload` (replaces the deprecated `priority`). */
  preload?: boolean;
}) {
  const t = dict(locale);
  const p = tourPhoto(tour, locale);
  const low = cheapest(tour);
  const road = tour.route.length > 4 ? [...tour.route.slice(0, 3), t.pkg.more(tour.route.length - 3)] : tour.route;
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] bg-white shadow-card ring-1 ring-black/5 transition-[box-shadow,transform] duration-[var(--dur)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:shadow-raised"
    >
      <div className="relative aspect-[4/3] bg-sand-100">
        {p ? (
          <Image
            src={p.card}
            unoptimized={tour.media.length > 0}
            alt={p.alt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            preload={preload}
            className="object-cover"
          />
        ) : null}
        <Badge tone="days" className="absolute left-3 top-3">
          {t.pkg.daysNightsShort(tour.days, tour.nights)}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-h3 text-royal-700">{tour.name}</h3>
        <p className="text-small flex flex-wrap items-center gap-x-1 text-muted">
          <Icon name="mapPin" size={16} className="text-maroon-600" />
          {road.join(' → ')}
        </p>
        <ul className="text-small flex flex-col gap-1">
          {tour.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex gap-2">
              <Icon name="check" size={16} className="mt-0.5 text-success" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <PriceTag rupees={low?.rupees} vehicle={low?.vehicle} sample={tour.isSample} gst={tour.isSample} locale={locale} />
          {tour.taxNote ? <p className="text-small text-muted">{tour.taxNote}</p> : null}
          <span className="inline-flex items-center gap-1 font-semibold text-royal-600 group-hover:underline">
            {t.cta.viewPackage}
            <Icon name="arrow" size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}
