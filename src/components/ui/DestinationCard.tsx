import Image from 'next/image';
import Link from 'next/link';
import { dict, type Locale } from '@/i18n';
import { photo } from '@/content/photos';
import { FortSun } from '@/components/motifs/FortSun';
import { Jaali } from '@/components/motifs/Jaali';

/**
 * A place to visit: its photo, its name, one line, and how many tours go there (or another
 * short fact, `meta`). One link. A place without a licensed photo gets the fort and the sun
 * on royal blue — never a broken image.
 */
export function DestinationCard({
  name,
  line,
  photoKey,
  tours,
  meta,
  href,
  locale,
}: {
  name: string;
  line: string;
  photoKey?: string;
  tours?: number;
  meta?: string;
  href: string;
  locale: Locale;
}) {
  const t = dict(locale);
  const p = photoKey ? photo(photoKey) : null;
  return (
    <Link
      href={href}
      className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] shadow-card ${p ? 'bg-sand-200' : 'bg-royal-700'}`}
    >
      {p ? (
        <Image
          src={p.card}
          alt={p.alt}
          fill
          sizes="(min-width: 1024px) 280px, 50vw"
          className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]"
        />
      ) : (
        <>
          <Jaali opacity={0.12} className="invert" />
          <FortSun tone="silhouette" className="absolute left-1/2 top-[14%] w-3/5 -translate-x-1/2 text-gold-500" />
        </>
      )}
      {/* A dark fade under the words, so white text reads on any photo. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative p-4 text-white">
        <h3 className="text-h2 drop-shadow">{name}</h3>
        <p className="text-small mt-1 text-white/90">{line}</p>
        {tours !== undefined || meta ? (
          <p className="text-small mt-2 font-semibold text-sun-400">
            {[tours !== undefined ? t.pkg.packagesCount(tours) : null, meta].filter(Boolean).join(' · ')}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
