'use client';

import { useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { whatsappLink } from '@/lib/site';

/**
 * Choose the car for a road, and "Book" carries it into the WhatsApp message (Phase 4: into the
 * booking form). The fares themselves are rendered on the server, above; this only picks one.
 */
export function RouteBook({
  cars,
  messages,
  labels,
}: {
  cars: Array<{ key: string; label: string }>;
  /** The message for each car, already written in the page's language (lib/book.ts). */
  messages: Record<string, string>;
  labels: { choose: string; book: string };
}) {
  const [car, setCar] = useState(cars[0]?.key);
  if (!cars.length) return null;
  return (
    <div className="flex flex-col gap-3">
      <div role="group" aria-label={labels.choose} className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-small font-semibold text-muted">{labels.choose}</span>
        {cars.map((c) => (
          <Chip key={c.key} pressed={car === c.key} onChange={() => setCar(c.key)}>
            {c.label}
          </Chip>
        ))}
      </div>
      <Button variant="whatsapp" size="lg" href={messages[car] ?? whatsappLink()}>
        {labels.book}
      </Button>
    </div>
  );
}
