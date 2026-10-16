import { dict, localePath, type Locale } from '@/i18n';
import { PACKAGES, cheapest, pkgIn, PACKAGES_ARE_SAMPLE } from '@/content/packages';
import { DESTINATIONS, packagesFor } from '@/content/destinations';
import { PLACES } from '@/content/places';
import { popularRoutes } from '@/content/popular-routes';
import { DAY_BUCKETS, HERO, HOME_FAQ, HOW, SECTIONS, WHY } from '@/content/home';
import { photo } from '@/content/photos';
import { brand } from '@/lib/site';
import { bookRouteLink, enquireLink } from '@/lib/book';
import { faqJsonLd } from '@/components/ui/FAQ';
import { JsonLd } from '@/components/JsonLd';
import { TourFilter } from '@/components/TourFilter';
import { Car, DuneDivider, FortSun, Jaali, MehrabFrame, SparkleDivider } from '@/components/motifs';
import {
  Alert,
  Button,
  DestinationCard,
  EmptyState,
  FAQ,
  Footer,
  Header,
  Icon,
  PackageCard,
  RouteCard,
  SectionHeader,
  StickyCta,
} from '@/components/ui';
import { travelAgencyJsonLd, websiteJsonLd } from '@/lib/schema';

/**
 * The home page, in either language (Phase 2): the fort in the jharokha, tours with a filter,
 * cab fares from the Hello My Cab network, where to go, why us, how it works, questions, and
 * the two ways to reach us. One photo is preloaded (the hero's); everything else is SVG or lazy.
 */
export async function Home({ locale }: { locale: Locale }) {
  const t = dict(locale);
  const L = <K extends { en: string; hi: string }>(x: K) => x[locale];
  // Hawa Mahal: a tall façade that fills the tall jharokha (a wide fort photo showed only wall).
  const hero = photo('jaipur-hawa-mahal');
  const routes = await popularRoutes(locale);
  const tours = PACKAGES.map((p) => pkgIn(p, locale));
  const path = localePath('/', locale);

  return (
    <>
      <Header locale={locale} path={path} />
      <main className="pb-24 md:pb-0">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="sun-glow relative overflow-hidden">
          <Jaali opacity={0.07} />
          <div className="relative mx-auto grid max-w-[var(--container-site)] items-center gap-8 px-4 pb-4 pt-8 sm:px-6 md:grid-cols-[1.15fr_1fr] md:pt-14">
            <div className="order-2 text-center md:order-1 md:text-left">
              <p className="text-small font-semibold uppercase tracking-[0.12em] text-gold-700 [:lang(hi)_&]:normal-case [:lang(hi)_&]:tracking-normal">
                {L(HERO.eyebrow)}
              </p>
              <h1 className="text-display mt-3 text-royal-600">{L(HERO.title)}</h1>
              <SparkleDivider className="mx-auto mt-4 md:mx-0" />
              <p className="text-body-lg mx-auto mt-4 max-w-xl text-ink/80 md:mx-0">{L(HERO.line)}</p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                <Button size="lg" href={localePath('/packages', locale)} icon={null} iconRight="arrow">
                  {L(HERO.seeTours)}
                </Button>
                <Button size="lg" variant="whatsapp" href={enquireLink(locale)}>
                  {t.cta.whatsapp}
                </Button>
              </div>
            </div>
            {hero ? (
              <div className="order-1 mx-auto w-[58vw] max-w-[300px] md:order-2 md:w-full md:max-w-[340px]">
                <MehrabFrame src={hero.big} alt={hero.alt} preload sizes="(min-width: 768px) 340px, 58vw" />
              </div>
            ) : null}
          </div>
          {/* The car on the dunes — drives on the spot; still under reduced motion. */}
          <div className="relative">
            <DuneDivider tone="ivory" />
            <Car moving size={150} className="absolute bottom-[22%] left-[8%] sm:bottom-[26%] sm:left-[14%] sm:w-[190px]" />
          </div>
        </section>

        {/* ── Tours with the filter ──────────────────────────────────────── */}
        <section className="mx-auto max-w-[var(--container-site)] px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader eyebrow={L(SECTIONS.toursEyebrow)} title={L(SECTIONS.tours)} intro={L(SECTIONS.toursIntro)} />
          {PACKAGES_ARE_SAMPLE ? (
            <div className="mx-auto mt-6 max-w-2xl">
              <Alert tone="warning">{L(SECTIONS.sampleNote)}</Alert>
            </div>
          ) : null}
          <div className="mt-8">
            <TourFilter
              items={tours.map((x) => ({ slug: x.slug, cities: x.cities, days: x.days, price: cheapest(x).rupees }))}
              cities={DESTINATIONS.filter((d) => packagesFor(d.key).length).map((d) => ({ key: d.key, label: d[locale].name }))}
              dayBuckets={DAY_BUCKETS.map((b) => ({
                key: b.key,
                label: b[locale],
                min: b.key === 'short' ? 0 : b.key === 'mid' ? 4 : 6,
                max: b.key === 'short' ? 3 : b.key === 'mid' ? 5 : 99,
              }))}
              labels={{ city: L(SECTIONS.filterCity), days: L(SECTIONS.filterDays), all: L(SECTIONS.filterAll) }}
              empty={
                <EmptyState
                  title={L(SECTIONS.noMatch)}
                  body={L(SECTIONS.noMatchBody)}
                  action={
                    <Button variant="whatsapp" href={enquireLink(locale)}>
                      {t.cta.whatsapp}
                    </Button>
                  }
                />
              }
            >
              {tours.map((x) => (
                <PackageCard key={x.slug} tour={x} href={localePath(`/packages/${x.slug}`, locale)} locale={locale} />
              ))}
            </TourFilter>
          </div>
          <div className="mt-8 text-center">
            <Button variant="secondary" href={localePath('/packages', locale)} icon={null} iconRight="arrow">
              {L(SECTIONS.allTours)}
            </Button>
          </div>
        </section>

        {/* ── Cab between cities (Hello My Cab fares) ─────────────────────── */}
        {routes.length ? (
          <section className="bg-sand-50 py-12 sm:py-16">
            <div className="mx-auto max-w-[var(--container-site)] px-4 sm:px-6">
              <SectionHeader eyebrow={L(SECTIONS.routesEyebrow)} title={L(SECTIONS.routes)} intro={L(SECTIONS.routesIntro)} />
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {routes.map((r) => (
                  <RouteCard
                    key={`${r.pickup}-${r.drop}`}
                    from={r.from}
                    to={r.to}
                    km={r.km}
                    fromRupees={r.fromRupees}
                    href={bookRouteLink(r.from, r.to, locale)}
                    locale={locale}
                  />
                ))}
              </div>
              <p className="mt-4 text-center text-small text-muted">{L(SECTIONS.routesNote)}</p>
            </div>
          </section>
        ) : null}

        {/* ── Where to go ─────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[var(--container-site)] px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader eyebrow={L(SECTIONS.placesEyebrow)} title={L(SECTIONS.places)} />
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Eight on the home page — two full rows; the rest are a tap away. */}
            {DESTINATIONS.slice(0, 8).map((d) => (
              <DestinationCard
                key={d.key}
                name={d[locale].name}
                line={d[locale].line}
                photoKey={d.photo}
                tours={packagesFor(d.key).length || undefined}
                href={localePath(`/destinations/${d.slug}`, locale)}
                locale={locale}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="secondary" href={localePath('/destinations', locale)}>
              {t.place.seeAll(PLACES.length)}
            </Button>
          </div>
        </section>

        {/* ── Why us ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-royal-600 py-12 text-white sm:py-16">
          <Jaali opacity={0.06} className="invert" />
          <div className="relative mx-auto max-w-[var(--container-site)] px-4 sm:px-6">
            <h2 className="text-h2 text-center text-white">{L(SECTIONS.why)}</h2>
            <SparkleDivider className="mx-auto mt-3" />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {WHY.map((w) => (
                <li key={w.title.en} className="rounded-[var(--radius-md)] bg-white/8 p-5 ring-1 ring-white/15">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-500 text-ink">
                    <Icon name={w.icon} />
                  </span>
                  <h3 className="text-h3 mt-3 text-white">{L(w.title)}</h3>
                  <p className="mt-1 text-white/85">{L(w.line)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[var(--container-site)] px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader title={L(SECTIONS.how)} />
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {HOW.map((h, i) => (
              <li key={h.title.en} className="flex gap-4 md:flex-col md:items-center md:text-center">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-500 text-lg font-bold text-ink ring-4 ring-sand-100">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-h3 text-royal-700">{L(h.title)}</h3>
                  <p className="mt-1 text-muted">{L(h.line)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Questions ───────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-3xl px-4 pb-12 sm:px-6 sm:pb-16">
          <SectionHeader title={L(SECTIONS.faq)} />
          <div className="mt-8">
            <FAQ items={HOME_FAQ[locale]} />
          </div>
        </section>

        {/* ── Plan your trip ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-sand-200">
          <DuneDivider tone="ivory" flip />
          <div className="mx-auto grid max-w-[var(--container-site)] items-center gap-6 px-4 pb-14 sm:px-6 md:grid-cols-[1fr_auto]">
            <div className="text-center md:text-left">
              <h2 className="text-h1 text-royal-600">{L(SECTIONS.cta)}</h2>
              <p className="text-body-lg mt-3 max-w-xl text-ink/80">{L(SECTIONS.ctaLine)}</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                <Button size="lg" variant="whatsapp" href={enquireLink(locale)}>
                  {t.cta.whatsapp}
                </Button>
                <Button size="lg" variant="call" href={brand.phoneHref}>
                  {t.cta.call} · {brand.phone}
                </Button>
              </div>
            </div>
            <FortSun className="mx-auto w-56 md:w-64" />
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <StickyCta>
        <Button variant="whatsapp" href={enquireLink(locale)}>
          {t.cta.whatsapp}
        </Button>
        <Button variant="call" href={brand.phoneHref}>
          {t.cta.call}
        </Button>
      </StickyCta>
      <JsonLd data={[travelAgencyJsonLd(), websiteJsonLd(locale), faqJsonLd(HOME_FAQ[locale])]} />
    </>
  );
}
