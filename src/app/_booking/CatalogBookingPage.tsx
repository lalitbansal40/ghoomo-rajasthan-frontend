import { notFound } from 'next/navigation';
import { CatalogBooking } from '@/components/booking/CatalogBooking';
import { Breadcrumbs, Footer, Header, IncludesList } from '@/components/ui';
import { PACKAGES, pkgIn } from '@/content/packages';
import { SAFARI, SAFARI_BOOKABLE } from '@/content/safari';
import { dict, localePath, type Locale } from '@/i18n';
import { packageVehicleKey } from '@/lib/book';

const SEATS: Record<string, number> = { dzire: 4, ertiga: 6, crysta: 6 };
type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (typeof v === 'string' ? v : undefined);

function Shell({ locale, path, crumbs, children }: { locale: Locale; path: string; crumbs: { label: string; href?: string }[]; children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header locale={locale} path={path} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-10">
        <Breadcrumbs items={crumbs} locale={locale} />
        {children}
      </main>
      <Footer locale={locale} />
    </div>
  );
}

/** /booking/package/<slug> — one of the six bookable tours, booked as a package (owner, 20 Oct 2026). */
export function PackageBookingPage({ locale, slug, searchParams }: { locale: Locale; slug: string; searchParams: Search }) {
  const pkg = PACKAGES.find((p) => p.slug === slug);
  const tour = pkg ? pkgIn(pkg, locale) : null;
  if (!tour?.bookable) notFound();
  const t = dict(locale);
  const cars = tour.fromRupees.map((c) => {
    const key = packageVehicleKey(c.vehicle);
    return { key, label: c.vehicle === 'Innova Crysta' ? t.booking.crysta : c.vehicle === 'Ertiga' ? t.booking.ertiga : t.booking.dzire, rupees: c.rupees, seats: SEATS[key] };
  });
  const path = `/booking/package/${slug}`;
  return (
    <Shell locale={locale} path={path} crumbs={[{ label: t.nav.packages, href: localePath('/packages', locale) }, { label: tour.name, href: localePath(`/packages/${slug}`, locale) }, { label: t.tourBook.bookTour }]}>
      <h1 className="mt-5 text-h1 text-royal-600">{tour.name}</h1>
      <p className="mt-2 text-muted">{t.pkg.daysNightsShort(tour.days, tour.nights)} · {t.tourBook.startsFrom(tour.startsFrom)}</p>
      <p className="mt-1 text-sm text-muted">{tour.route.join(' → ')}</p>
      <div className="mt-5 rounded-xl border border-gold-300 bg-sand-50 p-4">
        <IncludesList includes={tour.includes} excludes={tour.excludes} locale={locale} />
      </div>
      <div className="mt-6">
        <CatalogBooking locale={locale} choice={{ kind: 'package', slug, cars }} initial={one(searchParams.vehicle)} />
      </div>
    </Shell>
  );
}

/** /booking/safari/<spot> — a desert safari at its listed rates (owner, 20 Oct 2026). */
export function SafariBookingPage({ locale, spot: slug, searchParams }: { locale: Locale; spot: string; searchParams: Search }) {
  const spot = SAFARI.find((s) => s.slug === slug);
  if (!spot || !SAFARI_BOOKABLE) notFound();
  const t = dict(locale);
  const words = spot[locale];
  const offers = spot.offers.map((o) => ({ key: o.key, name: o[locale].name, rupees: o.rupees, per: o.per }));
  return (
    <Shell locale={locale} path={`/booking/safari/${slug}`} crumbs={[{ label: t.nav.desertSafari, href: `${localePath('/desert-safari', locale)}#${slug}` }, { label: t.tourBook.bookSafari }]}>
      <h1 className="mt-5 text-h1 text-royal-600">{t.tourBook.bookSafari}</h1>
      <p className="mt-2 font-semibold text-royal-700">{words.name}</p>
      <p className="mt-1 text-muted">{words.line}</p>
      <div className="mt-6">
        <CatalogBooking locale={locale} choice={{ kind: 'safari', spot: slug, offers }} initial={one(searchParams.offer)} />
      </div>
    </Shell>
  );
}
