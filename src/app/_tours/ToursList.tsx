import { catalog, toursInCity } from '@/lib/catalog';
import { packageIndexable } from '@/lib/indexing-policy';
import { CatalogNotice } from '@/components/CatalogNotice';
import { dict, localePath, type Locale } from '@/i18n';
import { STATIC_TOURS_BOOKABLE, cheapest, pkgIn } from '@/content/packages';
import { DESTINATIONS } from '@/content/destinations';
import { DAY_BUCKETS, HOME_FAQ, SECTIONS } from '@/content/home';
import { brand } from '@/lib/site';
import { bookStartLink, customTripLink } from '@/lib/book';
import { JsonLd } from '@/components/JsonLd';
import { TourFilter } from '@/components/TourFilter';
import { breadcrumbJsonLd, faqJsonLd } from '@/components/ui';
import { Alert, Breadcrumbs, Button, EmptyState, FAQ, Footer, Header, PackageCard, SectionHeader, StickyCta } from '@/components/ui';
import { DuneDivider } from '@/components/motifs';
import { PageScene } from '@/components/scene/PageScene';

/** The tours list, in either language: filter by city and days, sort, every tour as a card. */
export async function ToursList({ locale }: { locale: Locale }) {
  const catalogState = await catalog();
  const PACKAGES = catalogState.packages;
  // The sample note goes once the static tours are booked at their prices (STATIC_TOURS_BOOKABLE).
  const PACKAGES_ARE_SAMPLE = catalogState.sample && !STATIC_TOURS_BOOKABLE;
  const packagesFor = (key: string) => toursInCity(PACKAGES, key);
  const t = dict(locale);
  const L = <K extends { en: string; hi: string }>(x: K) => x[locale];
  const tours = PACKAGES.map((p) => pkgIn(p, locale));
  const path = localePath('/packages', locale);
  const crumbs = [
    { label: locale === 'hi' ? 'होम' : 'Home', href: localePath('/', locale) },
    { label: t.nav.packages },
  ];
  // Three of the home page's questions — the ones a list of tours raises.
  const faq = HOME_FAQ[locale].filter((_, i) => [0, 4, 5].includes(i));

  return (
    <>
      <Header locale={locale} path={path} />
      <PageScene kind="tours" />
      <main className="mx-auto max-w-[var(--container-site)] px-4 pb-24 pt-6 sm:px-6 md:pb-12">
        <CatalogNotice unavailable={catalogState.unavailable} locale={locale} />
        <Breadcrumbs items={crumbs} locale={locale} />
        <SectionHeader as="h1" align="left" className="mt-6 !max-w-3xl" title={L(SECTIONS.toursTitle)} intro={L(SECTIONS.toursPageIntro)} />
        {PACKAGES_ARE_SAMPLE ? (
          <div className="mt-6 max-w-2xl">
            <Alert tone="warning">{L(SECTIONS.sampleNote)}</Alert>
          </div>
        ) : null}
        <div className="mt-8">
          <TourFilter
            sort
            items={tours.map((x) => ({ slug: x.slug, cities: x.cities, days: x.days, price: cheapest(x)?.rupees ?? null }))}
            cities={DESTINATIONS.filter((d) => packagesFor(d.key).length).map((d) => ({ key: d.key, label: d[locale].name }))}
            dayBuckets={DAY_BUCKETS.map((b) => ({
              key: b.key,
              label: b[locale],
              min: b.key === 'short' ? 0 : b.key === 'mid' ? 4 : 6,
              max: b.key === 'short' ? 3 : b.key === 'mid' ? 5 : 99,
            }))}
            labels={{
              city: L(SECTIONS.filterCity),
              days: L(SECTIONS.filterDays),
              all: L(SECTIONS.filterAll),
              sort: L(SECTIONS.sort),
              recommended: L(SECTIONS.sortRecommended),
              byDays: L(SECTIONS.sortDays),
              byPrice: L(SECTIONS.sortPrice),
            }}
            empty={
              <EmptyState
                title={L(SECTIONS.noMatch)}
                body={L(SECTIONS.noMatchBody)}
                action={
                  <Button variant="primary" href={customTripLink(locale)}>
                    {t.cta.planTrip}
                  </Button>
                }
              />
            }
          >
            {/* The first card's photo is the page's largest paint: fetched first, not lazily. */}
            {tours.map((x, i) => (
              <PackageCard key={x.slug} tour={x} href={localePath(`/packages/${x.slug}`, locale)} locale={locale} preload={i === 0} />
            ))}
          </TourFilter>
        </div>
        {/* Each tour city's own page — what to see there, when, and a car in town. */}
        <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-small">
          <span className="font-semibold text-subtle">{L(SECTIONS.aboutPlaces)}</span>
          {DESTINATIONS.filter((d) => packagesFor(d.key).length).map((d) => (
            <a key={d.key} href={localePath(`/destinations/${d.slug}`, locale)} className="text-link underline">
              {d[locale].name}
            </a>
          ))}
        </p>

        <section className="mx-auto mt-16 max-w-3xl">
          <SectionHeader title={L(SECTIONS.faq)} />
          <div className="mt-6">
            <FAQ items={faq} />
          </div>
        </section>
      </main>
      <section className="bg-alternate">
        <DuneDivider tone="ivory" flip settle={path} />
        <div className="mx-auto max-w-[var(--container-site)] px-4 pb-12 text-center sm:px-6">
          <h2 className="text-h2 text-link">{L(SECTIONS.cta)}</h2>
          <p className="mx-auto mt-2 max-w-xl text-content/80">{L(SECTIONS.ctaLine)}</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="primary" size="lg" href={bookStartLink(locale)}>
              {t.cta.bookNow}
            </Button>
            <Button variant="call" size="lg" href={brand.phoneHref}>
              {t.cta.call} · {brand.phone}
            </Button>
          </div>
        </div>
      </section>
      <Footer locale={locale} />
      <StickyCta>
        <Button variant="primary" href={bookStartLink(locale)}>
          {t.cta.bookNow}
        </Button>
        <Button variant="call" href={brand.phoneHref}>
          {t.cta.call}
        </Button>
      </StickyCta>
      <JsonLd path="/packages" locale={locale} eligible={!catalogState.unavailable && catalogState.packages.some(packageIndexable)} data={[breadcrumbJsonLd(crumbs), faqJsonLd(faq)]} />
    </>
  );
}
