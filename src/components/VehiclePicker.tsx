'use client';

import { useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { PriceTagView, type PriceLabels } from '@/components/ui/PriceTagView';
import { bookPackageLink } from '@/lib/book';
import { brand } from '@/lib/site';
import type { Locale } from '@/i18n';

/**
 * Choose a car to compare the package's rates. A bookable tour's Book opens its booking with
 * that car (lib/book.ts); any other tour's is an enquiry.
 */
export function VehiclePicker({
  tour,
  prices,
  locale,
  labels,
  priceLabels,
}: {
  tour: { slug: string; name: string; days: number; nights: number; isSample?: boolean; bookable?: boolean; taxNote?: string };
  prices: Array<{ vehicle: string; rupees: number }>;
  locale: Locale;
  priceLabels: PriceLabels;
  labels: { car: string; book: string; call: string };
}) {
  const sorted = [...prices].sort((a, b) => a.rupees - b.rupees);
  const [car, setCar] = useState(sorted[0]?.vehicle ?? '');
  const chosen = sorted.find((p) => p.vehicle === car) ?? sorted[0];
  return (
    <div className="flex flex-col gap-4">
      {sorted.length ? <div role="group" aria-label={labels.car} className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-small font-semibold text-muted">{labels.car}</span>
        {sorted.map((p) => (
          <Chip key={p.vehicle} pressed={car === p.vehicle} onChange={() => setCar(p.vehicle)}>
            {p.vehicle}
          </Chip>
        ))}
      </div> : null}
      <PriceTagView rupees={chosen?.rupees} vehicle={chosen?.vehicle} sample={tour.isSample && !tour.bookable} gst={tour.isSample || tour.bookable} labels={priceLabels} />
      {tour.taxNote ? <p>{tour.taxNote}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="primary" size="lg" href={bookPackageLink(tour, chosen?.vehicle ?? '', locale)}>
          {labels.book}
        </Button>
        <Button variant="call" size="lg" href={brand.phoneHref}>
          {labels.call}
        </Button>
      </div>
    </div>
  );
}
