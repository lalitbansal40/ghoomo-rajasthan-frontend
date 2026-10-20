import { dict, localePath, type Locale } from '@/i18n';
import { pkgIn, type TourPackage } from '@/content/packages';
import { PLACES } from '@/content/places';
import { TOUR_FAQ } from '@/content/home';
import { tourPhoto } from '@/lib/tour-photo';
import { packageTravelCheckout } from '@/lib/travel-catalog';
import { catalog } from '@/lib/catalog';
import { packageIndexable } from '@/lib/indexing-policy';
import { ManagedGallery } from '@/components/ManagedGallery';
import { brand } from '@/lib/site';
import { bookPackageLink } from '@/lib/book';
import { touristTripJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { VehiclePicker } from '@/components/VehiclePicker';
import { MehrabFrame } from '@/components/motifs/MehrabFrame';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs, breadcrumbJsonLd } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { DestinationCard } from '@/components/ui/DestinationCard';
import { FAQ, faqJsonLd } from '@/components/ui/FAQ';
import { Footer } from '@/components/ui/Footer';
import { Header } from '@/components/ui/Header';
import { Icon } from '@/components/ui/Icon';
import { IncludesList } from '@/components/ui/IncludesList';
import { ItineraryTimeline } from '@/components/ui/ItineraryTimeline';
import { PackageCard } from '@/components/ui/PackageCard';
import { PhotoCredit } from '@/components/ui/PhotoCredit';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StickyCta } from '@/components/ui/StickyCta';

/** What a tour page says about itself in a search result and a share — its own words. */
export function tourDescription(pkg: TourPackage, locale: Locale): string {
  const t = pkgIn(pkg, locale);
  if (t.seoDescription) return t.seoDescription;
  const lead = locale === 'hi' ? `${t.days} दिन / ${t.nights} रात: ` : `${t.days} days, ${t.nights} nights: `;
  return (lead + t.highlights.slice(0, 3).join(' · ')).slice(0, 155);
}

/** One tour, in either language — photo, price by car, book, the days, what is in the price. */
export async function TourPage({ pkg, locale }: { pkg: TourPackage; locale: Locale }) {
  const t = dict(locale);
  const tour = pkgIn(pkg, locale);
  const p = tourPhoto(tour, locale);
  const { packages: PACKAGES } = await catalog();
  const checkoutSlug = tour.isSample ? null : await packageTravelCheckout(tour.slug, tour.contentRevision);
  const checkoutHref = checkoutSlug ? localePath(`/travel-checkout/${checkoutSlug}`, locale) : null;
  const path = localePath(`/packages/${tour.slug}`, locale);
  const crumbs = [
    { label: locale === 'hi' ? 'होम' : 'Home', href: localePath('/', locale) },
    { label: t.nav.packages, href: localePath('/packages', locale) },
    { label: tour.name },
  ];
  const others = PACKAGES.filter((x) => x.slug !== pkg.slug).slice(0, 3).map((x) => pkgIn(x, locale));
  const cities = tour.cities.map((key) => PLACES.find((p) => p.key === key)).filter((p) => p !== undefined);
  const faq = tour.isSample ? TOUR_FAQ[locale] : (tour.faq ?? []).map((f) => ({ q: f.question, a: f.answer }));
  const cheapestCar = [...tour.fromRupees].sort((a, b) => a.rupees - b.rupees)[0]?.vehicle ?? '';

  return (
    <>
      <Header locale={locale} path={path} />
      <main className="mx-auto max-w-[var(--container-site)] px-4 pb-24 pt-6 sm:px-6 md:pb-12">
        <Breadcrumbs items={crumbs} locale={locale} />
        {tour.isSample && !tour.bookable ? (
          <div className="mt-4 max-w-2xl">
            <Alert tone="warning">{t.pkg.sampleTour}</Alert>
          </div>
        ) : null}

        {/* ── The top: photo, name, road, price by car, book ─────────────── */}
        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-12">
          {p ? (
            <div className="relative mx-auto w-[64vw] max-w-[320px] md:w-full">
              <MehrabFrame unoptimized={Boolean(tour.media.length)} srcSet={tour.media.length ? `${p.card} 640w, ${p.big} 1280w` : undefined} src={p.big} alt={p.alt} preload sizes="(min-width: 768px) 340px, 64vw" />
              <PhotoCredit photo={p} label={t.common.photoBy} />
            </div>
          ) : null}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="days">{t.pkg.daysNightsShort(tour.days, tour.nights)}</Badge>
            </div>
            <h1 className="text-h1 mt-3 text-royal-600">{tour.name}</h1>
            {tour.summary ? <p className="mt-3 text-muted">{tour.summary}</p> : null}
            <p className="mt-3 flex flex-wrap items-center gap-x-1.5 text-muted">
              <Icon name="mapPin" size={18} className="text-maroon-600" />
              {tour.route.join(' → ')}
            </p>
            {checkoutHref ? <div className="mt-5 space-y-2"><Button variant="primary" href={checkoutHref}>{locale === 'hi' ? 'वर्तमान विकल्प चुनें और ऑनलाइन बुक करें' : 'Choose current options and book online'}</Button><p className="text-sm text-muted">{locale === 'hi' ? 'चेकआउट पर उपलब्ध दर, तारीख और शामिल सेवाएँ चुनकर अंतिम कुल देखें।' : 'Select the current rate plan, dates and inclusions at checkout to review your final total.'}</p></div> : null}
            <div className="mt-6 rounded-[var(--radius-lg)] bg-white p-5 shadow-card ring-1 ring-black/5">
              <VehiclePicker
                tour={tour}
                prices={tour.fromRupees}
                locale={locale}
                priceLabels={{ from: t.pkg.from, samplePrice: t.pkg.samplePrice, onRequest: t.catalog.onRequest, gstExtra: t.pkg.gstExtra }}
                labels={{ car: t.pkg.car, book: tour.bookable ? t.cta.bookNow : t.catalog.enquire, call: `${t.cta.call} · ${brand.phone}` }}
              />
            </div>
          </div>
        </div>

        {/* ── Highlights ───────────────────────────────────────────────── */}
        <section className="mt-12">
          <h2 className="text-h2 text-royal-600">{t.pkg.highlights}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {tour.highlights.map((h) => (
              <li key={h} className="flex gap-2 rounded-[var(--radius-md)] bg-sand-50 p-3 ring-1 ring-gold-300/60">
                <Icon name="check" className="mt-0.5 text-success" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Day by day, and what the price covers ──────────────────────── */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <section>
            <h2 className="text-h2 text-royal-600">{t.pkg.itinerary}</h2>
            <div className="mt-6">
              <ItineraryTimeline days={tour.itinerary} locale={locale} />
            </div>
          </section>
          <div className="flex flex-col gap-8">
            <section className="rounded-[var(--radius-lg)] bg-white p-5 shadow-card ring-1 ring-black/5">
              <IncludesList includes={tour.includes} excludes={tour.excludes} locale={locale} />
            </section>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[var(--radius-md)] bg-royal-50 p-4">
                <h3 className="text-h3 flex items-center gap-2 text-royal-700">
                  <Icon name="sun" /> {t.pkg.bestTime}
                </h3>
                <p className="mt-1">{tour.bestMonths}</p>
              </div>
              <div className="rounded-[var(--radius-md)] bg-royal-50 p-4">
                <h3 className="text-h3 flex items-center gap-2 text-royal-700">
                  <Icon name="users" /> {t.pkg.goodFor}
                </h3>
                <p className="mt-1">{tour.goodFor.join(' · ')}</p>
              </div>
            </section>
          </div>
        </div>

        {/* ── Cities on this tour ──────────────────────────────────────── */}
        {cities.length ? (
          <section className="mt-12">
            <h2 className="text-h2 text-royal-600">{t.pkg.citiesOnTour}</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {cities.map((d) => (
                <DestinationCard
                  key={d.key}
                  name={d[locale].name}
                  line={d[locale].line}
                  photoKey={d.photo}
                  href={localePath(`/destinations/${d.slug}`, locale)}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* ── Questions ────────────────────────────────────────────────── */}
        {faq.length ? <section className="mx-auto mt-12 max-w-3xl">
          <SectionHeader title={t.pkg.tourQuestions} />
          <div className="mt-6">
            <FAQ items={faq} />
          </div>
        </section> : null}

        {/* ── More tours ───────────────────────────────────────────────── */}
        {others.length ? <section className="mt-12">
          <h2 className="text-h2 text-royal-600">{t.pkg.moreTours}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((x) => (
              <PackageCard key={x.slug} tour={x} href={localePath(`/packages/${x.slug}`, locale)} locale={locale} />
            ))}
          </div>
        </section> : null}
      </main>
      <ManagedGallery tour={tour} locale={locale} />
      <Footer locale={locale} />
      <StickyCta>
        <Button variant="primary" href={checkoutHref ?? bookPackageLink(tour, cheapestCar, locale)}>
          {checkoutHref ? (locale === 'hi' ? 'ऑनलाइन बुक करें' : 'Book online') : tour.bookable ? t.cta.bookNow : t.catalog.enquire}
        </Button>
        <Button variant="call" href={brand.phoneHref}>
          {t.cta.call}
        </Button>
      </StickyCta>
      <JsonLd path={`/packages/${pkg.slug}`} locale={locale} revision={pkg.contentRevision} eligible={packageIndexable(pkg)} data={[touristTripJsonLd(tour, locale, tourDescription(pkg, locale)), breadcrumbJsonLd(crumbs), faqJsonLd(faq)]} />
    </>
  );
}
