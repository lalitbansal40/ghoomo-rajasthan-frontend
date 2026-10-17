import Image from 'next/image';
import { dict, formatRupees, localePath, type Locale } from '@/i18n';
import { SAFARI, SAFARI_FAQ, SAFARI_IS_SAMPLE } from '@/content/safari';
import { routeByPair } from '@/content/routes/list';
import { routeEndName } from '@/content/cities';
import { placeBySlug } from '@/content/places';
import { PACKAGES, pkgIn } from '@/content/packages';
import { photo } from '@/content/photos';
import { safe } from '@/lib/api';
import { cheapest, localView } from '@/lib/fares';
import { routeFares } from '@/lib/route-fares';
import { bookSafariLink, enquireLink } from '@/lib/book';
import { brand } from '@/lib/site';
import { JsonLd } from '@/components/JsonLd';
import { LocalFareTable } from '@/components/LocalFareTable';
import { Camel, DuneDivider, MehrabFrame } from '@/components/motifs';
import {
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  FAQ,
  Footer,
  Header,
  Icon,
  PackageCard,
  PhotoCredit,
  RouteCard,
  SectionHeader,
  StickyCta,
  breadcrumbJsonLd,
  faqJsonLd,
} from '@/components/ui';

/** The roads to the dunes the page shows, with their fares. */
const ROADS_TO_DUNES: Array<[string, string]> = [
  ['JAIPUR', 'JAISALMER'],
  ['JODHPUR', 'JAISALMER'],
  ['BIKANER', 'JAISALMER'],
  ['JAIPUR', 'BIKANER'],
  ['JAIPUR', 'PUSHKAR'],
];

/** /desert-safari — four places, what each sells, when to go, and the car to get there. */
export async function SafariPage({ locale }: { locale: Locale }) {
  const t = dict(locale);
  const s = t.safari;
  const path = localePath('/desert-safari', locale);
  const crumbs = [{ label: locale === 'hi' ? 'होम' : 'Home', href: localePath('/', locale) }, { label: t.nav.desertSafari }];
  const hero = photo('camel-sunset');

  const roads = (
    await Promise.all(
      ROADS_TO_DUNES.map(async ([p, d]) => {
        const r = routeByPair(p, d);
        if (!r || r.held) return null;
        return { r, low: cheapest((await routeFares(r)).oneway) };
      }),
    )
  ).filter((x) => x !== null);
  const jaisalmerLocal = localView(await safe.local('JAISALMER'));
  const desertTours = PACKAGES.filter((p) => p.cities.some((c) => ['JAISALMER', 'BIKANER', 'PUSHKAR'].includes(c))).map((p) => pkgIn(p, locale));
  const faq = SAFARI_FAQ[locale];

  return (
    <>
      <Header locale={locale} path={path} />
      <main className="mx-auto max-w-[var(--container-site)] px-4 pb-24 pt-6 sm:px-6 md:pb-12">
        <Breadcrumbs items={crumbs} locale={locale} />

        {/* ── Top: the camel at sunset, the promise ───────────────────── */}
        <div className="mt-6 grid items-center gap-8 md:grid-cols-[minmax(0,300px)_1fr] lg:gap-12">
          {hero ? (
            <div className="relative mx-auto w-[58vw] max-w-[280px] md:w-full">
              <MehrabFrame src={hero.card} alt={hero.alt} preload sizes="(min-width: 768px) 300px, 58vw" />
              <PhotoCredit photo={hero} label={t.common.photoBy} />
            </div>
          ) : null}
          <div>
            <h1 className="text-h1 text-royal-600">{s.title}</h1>
            <p className="text-body-lg mt-3">{s.line}</p>
            <div className="mt-5" aria-hidden>
              <Camel walking size={72} />
            </div>
            {SAFARI_IS_SAMPLE ? (
              <div className="mt-5 max-w-xl">
                <Alert tone="warning">{s.sample}</Alert>
              </div>
            ) : null}
          </div>
        </div>

        {/* ── Where, and what each place sells ──────────────────────────── */}
        <h2 className="text-h2 mt-14 text-royal-600">{s.where}</h2>
        <div className="mt-6 flex flex-col gap-10">
          {SAFARI.map((spot) => {
            const sp = spot[locale];
            const ph = photo(spot.photo);
            const place = placeBySlug(spot.slug);
            return (
              <section key={spot.slug} id={spot.slug} className="scroll-mt-24 rounded-[var(--radius-lg)] bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
                <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                  {ph ? (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-sand-200">
                      <Image src={ph.card} alt={ph.alt} fill sizes="(min-width: 768px) 220px, 90vw" className="object-cover" />
                    </div>
                  ) : null}
                  <div>
                    <h3 className="text-h2 text-royal-700">{sp.name}</h3>
                    <p className="mt-1">{sp.line}</p>
                    <p className="mt-2 text-small text-muted">
                      <strong>{s.goodFor}:</strong> {sp.goodFor}
                    </p>
                    {place ? (
                      <a href={localePath(`/destinations/${place.slug}`, locale)} className="mt-2 inline-flex items-center gap-1 text-small font-semibold text-royal-600 underline">
                        {place[locale].name} <Icon name="arrow" size={16} />
                      </a>
                    ) : null}
                  </div>
                </div>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {spot.offers.map((o) => {
                    const ot = o[locale];
                    return (
                      <li key={o.key} className="flex flex-col rounded-[var(--radius-md)] bg-sand-50 p-4 ring-1 ring-gold-300/60">
                        <h4 className="text-h3 text-royal-700">{ot.name}</h4>
                        <p className="mt-1 text-small">{ot.detail}</p>
                        <ul className="mt-3 flex flex-col gap-1 text-small">
                          {ot.includes.map((i) => (
                            <li key={i} className="flex gap-2">
                              <Icon name="check" size={16} className="mt-0.5 text-success" />
                              {i}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex flex-wrap items-baseline gap-x-2">
                          <span className="text-h3 text-maroon-600" data-safari={`${spot.slug}-${o.key}`} data-rupees={o.rupees}>
                            {formatRupees(o.rupees)}
                          </span>
                          <span className="text-small text-muted">{s.per[o.per]}</span>
                          {SAFARI_IS_SAMPLE ? <Badge tone="sample">{t.pkg.samplePrice}</Badge> : null}
                        </div>
                        <div className="mt-4">
                          <Button variant="whatsapp" size="sm" href={bookSafariLink(sp.name, ot.name, locale)}>
                            {s.book}
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        {/* ── When, and what to carry ───────────────────────────────────── */}
        <section className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-[var(--radius-md)] bg-royal-50 p-5">
            <h2 className="text-h3 flex items-center gap-2 text-royal-700">
              <Icon name="sun" /> {s.when}
            </h2>
            <p className="mt-2">{s.whenBody}</p>
          </div>
          <div className="rounded-[var(--radius-md)] bg-royal-50 p-5">
            <h2 className="text-h3 flex items-center gap-2 text-royal-700">
              <Icon name="check" /> {s.carry}
            </h2>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
              {s.carryList.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── The car to the dunes ─────────────────────────────────────── */}
        <section className="mt-14">
          <h2 className="text-h2 text-royal-600">{s.getThere}</h2>
          <p className="mt-2 text-muted">{s.getThereLine}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roads.map(({ r, low }) => (
              <RouteCard
                key={r.slug}
                from={routeEndName(r.pickup, locale)}
                to={routeEndName(r.drop, locale)}
                fromRupees={low?.rupees ?? null}
                href={localePath(`/cab/${r.slug}`, locale)}
                locale={locale}
              />
            ))}
          </div>
          {jaisalmerLocal ? (
            <div className="mt-8 max-w-xl">
              <h3 className="text-h3 text-royal-700">{t.place.carThere(routeEndName('JAISALMER', locale))}</h3>
              <div className="mt-3">
                <LocalFareTable view={jaisalmerLocal} locale={locale} />
              </div>
            </div>
          ) : null}
        </section>

        {/* ── Tours with a desert night ─────────────────────────────────── */}
        {desertTours.length ? (
          <section className="mt-14">
            <h2 className="text-h2 text-royal-600">{s.tours}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {desertTours.map((x) => (
                <PackageCard key={x.slug} tour={x} href={localePath(`/packages/${x.slug}`, locale)} locale={locale} />
              ))}
            </div>
          </section>
        ) : null}

        {/* ── Cancelling ───────────────────────────────────────────────── */}
        <section className="mt-14 max-w-2xl">
          <h2 className="text-h3 text-royal-700">{s.cancel}</h2>
          <p className="mt-2">{s.cancelBody}</p>
        </section>

        {/* ── Questions ────────────────────────────────────────────────── */}
        <section className="mx-auto mt-14 max-w-3xl">
          <SectionHeader title={s.questions} />
          <div className="mt-6">
            <FAQ items={faq} />
          </div>
        </section>
      </main>
      <DuneDivider />
      <Footer locale={locale} />
      <StickyCta>
        <Button variant="whatsapp" href={enquireLink(locale)}>
          {t.cta.whatsapp}
        </Button>
        <Button variant="call" href={brand.phoneHref}>
          {t.cta.call}
        </Button>
      </StickyCta>
      {/* No Offer while the rates are samples — only the page's questions and its place in the site. */}
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(faq)]} />
    </>
  );
}
