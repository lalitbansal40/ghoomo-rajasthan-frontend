import Image from 'next/image';
import Link from 'next/link';
import { dict, type Locale } from '@/i18n';
import { photo } from '@/content/photos';
import type { TourPackage } from '@/content/packages';
import { Badge } from './Badge';
import { Icon } from './Icon';
import { PriceTag } from './PriceTag';

/**
 * A tour on a list: the photo, the name, days and nights, the road (long routes cut to three
 * places and "+N more"), three highlights, the lowest price. The whole card is ONE link (no
 * link inside a link); the "See the tour" line is part of it, not a second link.
 *
 * Package text is English until the Hindi package content is written (Phase 3) — the labels
 * around it follow `locale`.
 */
export function PackageCard({
  pkg,
  href,
  locale,
  priority = false,
}: {
  pkg: TourPackage;
  href: string;
  locale: Locale;
  priority?: boolean;
}) {
  const t = dict(locale);
  const p = photo(pkg.photo);
  const cheapest = [...pkg.fromRupees].sort((a, b) => a.rupees - b.rupees)[0];
  const road = pkg.route.length > 4 ? [...pkg.route.slice(0, 3), t.pkg.more(pkg.route.length - 3)] : pkg.route;
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] bg-white shadow-card ring-1 ring-black/5 transition-[box-shadow,transform] duration-[var(--dur)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:shadow-raised"
    >
      <div className="relative aspect-[4/3] bg-sand-100">
        {p ? (
          <Image
            src={p.card}
            alt={p.alt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover"
          />
        ) : null}
        <Badge tone="days" className="absolute left-3 top-3">
          {t.pkg.daysNightsShort(pkg.days, pkg.nights)}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-h3 text-royal-700">{pkg.name}</h3>
        <p className="text-small flex flex-wrap items-center gap-x-1 text-muted">
          <Icon name="mapPin" size={16} className="text-maroon-600" />
          {road.join(' → ')}
        </p>
        <ul className="text-small flex flex-col gap-1">
          {pkg.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex gap-2">
              <Icon name="check" size={16} className="mt-0.5 text-success" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <PriceTag rupees={cheapest.rupees} vehicle={cheapest.vehicle} locale={locale} />
          <span className="inline-flex items-center gap-1 font-semibold text-royal-600 group-hover:underline">
            {t.cta.viewPackage}
            <Icon name="arrow" size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}
