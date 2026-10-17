import { dict, formatRupees, localePath, type Locale } from '@/i18n';
import { LINKABLE_ROUTES, type GhoomoRoute } from '@/content/routes/list';
import { cityName, routeEndName } from '@/content/cities';
import { PLACES } from '@/content/places';
import { CAB_FAQ } from '@/content/cab';
import { safe } from '@/lib/api';
import { cheapest, darshanEstimate, localView, roundtripView } from '@/lib/fares';
import { hillRates, roundtripRates, routeFares } from '@/lib/route-fares';
import { whatsappLink, brand } from '@/lib/site';
import { enquireLink } from '@/lib/book';
import { itemListJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { LocalFareTable } from '@/components/LocalFareTable';
import { PerKmTable } from '@/components/PerKmTable';
import { RouteFilter } from '@/components/RouteFilter';
import { DuneDivider } from '@/components/motifs';
import {
  Badge,
  Breadcrumbs,
  Button,
  FAQ,
  Footer,
  Header,
  IncludesList,
  RouteCard,
  SectionHeader,
  StickyCta,
  breadcrumbJsonLd,
  faqJsonLd,
} from '@/components/ui';

/** The order the cab page lists the cities roads start from — Rajasthan first, then the cities that lead in. */
const GROUP_ORDER = ['JAIPUR', 'UDAIPUR', 'JODHPUR', 'AJMER', 'KOTA', 'SIKAR', 'BIKANER', 'DELHI', 'DELHI_AIRPORT', 'NOIDA', 'AGRA', 'HARIDWAR', 'CHANDIGARH'];
/** The worked example on the page: a five-day tour from Jaipur. */
const EXAMPLE_DAYS = 5;

/** /cab and /hi/cab — every road, a car for many days, a car for the day, groups, airports. */
export async function CabHub({ locale }: { locale: Locale }) {
  const t = dict(locale);
  const c = t.cab;
  const path = localePath('/cab', locale);
  const crumbs = [{ label: locale === 'hi' ? 'होम' : 'Home', href: localePath('/', locale) }, { label: t.nav.cab }];

  // ── One way: every linkable road with its lowest fare, grouped by where it starts ──
  const withFares = await Promise.all(LINKABLE_ROUTES.map(async (r) => ({ r, low: cheapest((await routeFares(r)).oneway) })));
  const groupOf = (r: GhoomoRoute) => (r.rajasthan === 'none' ? 'beyond' : r.pickup);
  const keys = [...new Set(withFares.map(({ r }) => groupOf(r)))].sort((a, b) => {
    const rank = (k: string) => (k === 'beyond' ? 999 : GROUP_ORDER.indexOf(k) === -1 ? 500 : GROUP_ORDER.indexOf(k));
    return rank(a) - rank(b) || a.localeCompare(b);
  });
  const groups = keys.map((k) => ({
    key: k === 'beyond' ? 'beyond' : k.toLowerCase().replace(/_/g, '-'),
    name: k === 'beyond' ? c.beyond : c.fromCity(cityName(k, locale)),
    items: withFares.filter(({ r }) => groupOf(r) === k).sort((a, b) => Number(b.r.rajasthan === 'both') - Number(a.r.rajasthan === 'both')),
  }));

  // ── Several days, by the km ──
  const [rates, hill, local, groupTrip] = await Promise.all([
    roundtripRates(),
    hillRates(),
    safe.local('JAIPUR').then(localView),
    safe.roundtrip('JAIPUR', 'REENGUS').then(roundtripView),
  ]);
  const dzire = rates?.rows.find((r) => r.key === 'dzire') ?? rates?.rows.find((r) => !r.van);
  const example = rates && dzire?.perKm ? darshanEstimate(dzire.perKm, EXAMPLE_DAYS, rates.minKmPerDay, dzire.nightCharge) : null;
  const hillLow = hill?.rows.filter((r) => !r.van && r.perKm).sort((a, b) => a.perKm! - b.perKm!)[0];
  const van = groupTrip?.rows.filter((r) => r.van).sort((a, b) => (b.seats ?? 0) - (a.seats ?? 0))[0];

  const airportRoutes = LINKABLE_ROUTES.filter((r) => (r.pickup === 'DELHI_AIRPORT' || r.drop === 'DELHI_AIRPORT') && r.rajasthan !== 'none');
  const faq = CAB_FAQ[locale];
  const placesForLocal = PLACES.filter((p) => p.featured && p.slug !== 'jaipur').slice(0, 6);

  return (
    <>
      <Header locale={locale} path={path} />
      <main className="mx-auto max-w-[var(--container-site)] px-4 pb-24 pt-6 sm:px-6 md:pb-12">
        <Breadcrumbs items={crumbs} locale={locale} />
        <SectionHeader as="h1" align="left" className="mt-6 !max-w-3xl" title={c.title} intro={c.intro} />
        <nav aria-label={c.title} className="mt-6 flex flex-wrap gap-2">
          {(['oneWay', 'darshan', 'local', 'group', 'airport'] as const).map((k) => (
            <a key={k} href={`#${k === 'oneWay' ? 'one-way' : k}`} className="rounded-full bg-royal-50 px-4 py-2 text-[0.9375rem] font-semibold text-royal-700 hover:bg-royal-100">
              {c.jump[k]}
            </a>
          ))}
        </nav>

        {/* ── One way ──────────────────────────────────────────────────── */}
        <section id="one-way" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-royal-600">{c.oneWayTitle}</h2>
          <p className="mt-2 text-muted">{c.oneWayLine(LINKABLE_ROUTES.length)}</p>
          <div className="mt-6">
            <RouteFilter groups={groups.map((g) => ({ key: g.key, name: g.name, count: g.items.length }))} label={c.from} all={t.place.any}>
              {groups.flatMap((g) =>
                g.items.map(({ r, low }) => (
                  <RouteCard
                    key={r.slug}
                    from={routeEndName(r.pickup, locale)}
                    to={routeEndName(r.drop, locale)}
                    fromRupees={low?.rupees ?? null}
                    href={localePath(`/cab/${r.slug}`, locale)}
                    locale={locale}
                  />
                )),
              )}
            </RouteFilter>
          </div>
        </section>

        {/* ── Rajasthan darshan ────────────────────────────────────────── */}
        <section id="darshan" className="mt-16 grid scroll-mt-24 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-h2 text-royal-600">{c.darshanTitle}</h2>
            <p className="mt-2">{c.darshanLine}</p>
            {example && dzire ? (
              <div className="mt-6 rounded-[var(--radius-lg)] bg-royal-50 p-5" data-fare="example">
                <div className="flex items-center gap-2">
                  <h3 className="text-h3 text-royal-700">{c.exampleTitle}</h3>
                  <Badge tone="sample">{c.estimate}</Badge>
                </div>
                <p className="mt-2">{c.example(EXAMPLE_DAYS, example.km, dzire.label, formatRupees(example.rupees))}</p>
                <p className="mt-2 text-small text-muted">{c.exactOnWhatsapp}</p>
              </div>
            ) : null}
            {hillLow?.perKm ? <p className="mt-4 text-small text-muted">{c.hillNote(formatRupees(hillLow.perKm))}</p> : null}
          </div>
          <div>{rates ? <PerKmTable view={rates} locale={locale} /> : <p className="font-semibold text-royal-700">{t.fare.onWhatsapp}</p>}</div>
        </section>

        {/* ── A car for the day ────────────────────────────────────────── */}
        <section id="local" className="mt-16 grid scroll-mt-24 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-h2 text-royal-600">{c.localTitle}</h2>
            <p className="mt-2">{c.localLine(cityName('JAIPUR', locale))}</p>
            <p className="mt-4 text-small text-muted">{c.localOthers}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {placesForLocal.map((p) => (
                <li key={p.slug}>
                  <a href={localePath(`/destinations/${p.slug}`, locale)} className="text-royal-600 underline">
                    {p[locale].name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>{local ? <LocalFareTable view={local} locale={locale} /> : <p className="font-semibold text-royal-700">{t.fare.onWhatsapp}</p>}</div>
        </section>

        {/* ── Groups ───────────────────────────────────────────────────── */}
        <section id="group" className="mt-16 grid scroll-mt-24 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-h2 text-royal-600">{c.groupTitle}</h2>
            <p className="mt-2">{c.groupLine}</p>
            {van?.seats ? (
              <p className="mt-4 rounded-[var(--radius-md)] bg-sand-50 p-4 ring-1 ring-gold-300/60" data-fare="group" data-rupees={van.rupees}>
                {c.groupExample(van.seats, formatRupees(van.rupees))}
              </p>
            ) : null}
            <div className="mt-4">
              <Button variant="whatsapp" href={whatsappLink(c.groupMessage)}>
                {c.groupBook}
              </Button>
            </div>
          </div>
          <div>{rates ? <PerKmTable view={rates} locale={locale} vans /> : <p className="font-semibold text-royal-700">{t.fare.onWhatsapp}</p>}</div>
        </section>

        {/* ── Airports ─────────────────────────────────────────────────── */}
        <section id="airport" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-royal-600">{c.airportTitle}</h2>
          <p className="mt-2 max-w-3xl">{c.jaipurAirport}</p>
          {airportRoutes.length ? (
            <>
              <p className="mt-4 font-semibold text-royal-700">{c.delhiAirport}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {airportRoutes.map((r) => (
                  <RouteCard
                    key={r.slug}
                    from={routeEndName(r.pickup, locale)}
                    to={routeEndName(r.drop, locale)}
                    href={localePath(`/cab/${r.slug}`, locale)}
                    locale={locale}
                  />
                ))}
              </div>
            </>
          ) : null}
        </section>

        {/* ── What is included ─────────────────────────────────────────── */}
        <section className="mt-16 rounded-[var(--radius-lg)] bg-white p-5 shadow-card ring-1 ring-black/5">
          <IncludesList
            includes={t.route.inFare}
            excludes={[t.route.extra.gst(rates?.gstPercent ?? 5), t.route.extra.tollRoad, t.route.extra.parking, t.route.extra.stateTax]}
            locale={locale}
          />
        </section>

        {/* ── Questions ────────────────────────────────────────────────── */}
        <section className="mx-auto mt-16 max-w-3xl">
          <SectionHeader title={c.questions} />
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
      <JsonLd
        data={[
          itemListJsonLd(LINKABLE_ROUTES.map((r) => ({ name: t.route.title(routeEndName(r.pickup, locale), routeEndName(r.drop, locale)), path: localePath(`/cab/${r.slug}`, locale) }))),
          breadcrumbJsonLd(crumbs),
          faqJsonLd(faq),
        ]}
      />
    </>
  );
}
