import Image from 'next/image';
import Link from 'next/link';
import { dict, type Locale } from '@/i18n';
import { photo } from '@/content/photos';

/** A city to visit: its photo, its name, one line, and how many tours go there. One link. */
export function DestinationCard({
  name,
  line,
  photoKey,
  tours,
  href,
  locale,
}: {
  name: string;
  line: string;
  photoKey: string;
  tours?: number;
  href: string;
  locale: Locale;
}) {
  const t = dict(locale);
  const p = photo(photoKey);
  return (
    <Link
      href={href}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] bg-sand-200 shadow-card"
    >
      {p ? (
        <Image
          src={p.card}
          alt={p.alt}
          fill
          sizes="(min-width: 1024px) 280px, 50vw"
          className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]"
        />
      ) : null}
      {/* A dark fade under the words, so white text reads on any photo. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative p-4 text-white">
        <h3 className="text-h2 drop-shadow">{name}</h3>
        <p className="text-small mt-1 text-white/90">{line}</p>
        {tours !== undefined ? <p className="text-small mt-2 font-semibold text-sun-400">{t.pkg.packagesCount(tours)}</p> : null}
      </div>
    </Link>
  );
}
