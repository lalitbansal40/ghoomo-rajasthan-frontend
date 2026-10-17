import Image from 'next/image';
import type { LocalTour } from '@/content/packages';
import type { Locale } from '@/i18n';
export function ManagedGallery({ tour, locale }: { tour: LocalTour; locale: Locale }) {
  if (!tour.media.length) return null;
  return <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-2">
    {tour.media.map((m) => <figure key={m.id}><Image unoptimized src={m.variants.cover} alt={m.alt[locale]} width={1280} height={720} className="h-auto w-full rounded-2xl" /><figcaption className="text-small text-muted">{m.credit} · {m.licence} · {m.changes}</figcaption></figure>)}
  </section>;
}
