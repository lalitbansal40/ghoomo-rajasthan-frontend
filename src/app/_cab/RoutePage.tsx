import { dict, formatRupees, localePath, type Locale } from '@/i18n';
import { exists } from '@/i18n/pages';
import { LINKABLE_ROUTES, routeByPair, type GhoomoRoute } from '@/content/routes/list';
import { ROUTE_TEXT } from '@/content/routes/text';
import { routeIndexable } from '@/content/routes/indexable';
import { routeKey } from '@/lib/slug';
import { cityName, routeEndName } from '@/content/cities';
import { PLACES, placeForCity } from '@/content/places';
import { region } from '@/content/regions';
import { packageBySlug, pkgIn } from '@/content/packages';
import { cheapest, type OnewayView } from '@/lib/fares';
import { routeFares } from '@/lib/route-fares';
import { routeFaq } from '@/lib/route-faq';
import { bookRouteLink } from '@/lib/book';
import { brand } from '@/lib/site';
import { taxiServiceJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { OnewayFareTable } from '@/components/OnewayFareTable';
import { RouteBook } from '@/components/RouteBook';
import { FortSun } from '@/components/motifs';
import {
  Badge,
  Breadcrumbs,
  Button,
  DestinationCard,
  FAQ,
  Footer,
  Header,
  Icon,
  IncludesList,
  PackageCard,
  RouteCard,
  SectionHeader,
  StickyCta,
  breadcrumbJsonLd,
  faqJsonLd,
} from '@/components/ui';

/** The two ends of a route in this language. */
export function routeNames(route: GhoomoRoute, locale: Locale) {
  return { from: routeEndName(route.pickup, locale), to: routeEndName(route.drop, locale) };
}

export { routeIndexable } from '@/content/routes/indexable';

/** A route's search-result line: the distance and the lowest fare when known, then its own first words. */
export function routeDescription(route: GhoomoRoute, oneway: OnewayView | null, locale: Locale): string {
  const { from, to } = routeNames(route, locale);
  const text = ROUTE_TEXT[routeKey(route.pickup, route.drop)]?.[locale].intro[0];
  const low = cheapest(oneway);
  const facts =
    locale === 'hi'
      ? [`${from} से ${to} कैब`, oneway?.km ? `${oneway.km} किमी` : null, low ? `${formatRupees(low.rupees)} से` : null]
      : [`${from} to ${to} cab`, oneway?.km ? `${oneway.km} km` : null, low ? `from ${formatRupees(low.rupees)}` : null];
  const lead = facts.filter(Boolean).join(', ') + (locale === 'hi' ? '। ' : '. ');
  const tail = text ?? dict(locale).route.dataOnly(from, to);
  const all = lead + tail;
  return all.length <= 155 ? all : `${all.slice(0, 152).replace(/\s+\S*$/, '')}…`;
}

/** One road, in either language: the fare by car, the round trip, what is on the way, and booking. */
export async function RoutePage({ route, locale }: { route: GhoomoRoute; locale: Locale }) {
  const t = dict(locale);
  const rt = t.route;
  const { from, to } = routeNames(route, locale);
  const path = localePath(`/cab/${route.slug}`, locale);
  const text = ROUTE_TEXT[routeKey(route.pickup, route.drop)]?.[locale];
  const packages = (ROUTE_TEXT[routeKey(route.pickup, route.drop)]?.packages ?? [])
    .map(packageBySlug)
    .filter((p) => p !== null)
    .map((p) => pkgIn(p, locale));
  const { oneway, roundtrip } = await routeFares(route);
  const low = cheapest(oneway);
  const reg = region(route.region);

  const crumbs = [
    { label: locale === 'hi' ? 'होम' : 'Home', href: localePath('/', locale) },
    ...(exists('/cab', locale) ? [{ label: t.nav.cab, href: localePath('/cab', locale) }] : []),
    { label: rt.title(from, to) },
  ];

  const reverse = routeByPair(route.drop, route.pickup);
  const reverseLink = reverse && !reverse.held ? reverse : null;
  const more = LINKABLE_ROUTES.filter((r) => r.pickup === route.pickup && r.slug !== route.slug && r.slug !== reverse?.slug)
    .sort((a, b) => Number(b.rajasthan === 'both') - Number(a.rajasthan === 'both'))
    .slice(0, 6);
  const arriving = placeForCity(route.drop);

  const cars = (oneway?.rows ?? []).slice().sort((a, b) => a.rupees - b.rupees);
  const bookLinks = Object.fromEntries(cars.map((c) => [c.key, bookRouteLink(route.pickup, route.drop, locale, c.key, Boolean(route.held))]));
  const faq = routeFaq(from, to, oneway, roundtrip, locale);
  const roundLow = roundtrip?.rows.filter((r) => !r.van).sort((a, b) => a.rupees - b.rupees)[0];

  const extras = [
    rt.extra.gst(oneway?.gstPercent ?? 5),
    oneway?.tollOnBill ? rt.extra.tollBill(formatRupees(Math.max(...oneway.rows.map((r) => r.tollRupees)))) : rt.extra.tollRoad,
    rt.extra.parking,
    rt.extra.stateTax,
    ...(oneway?.airportSurcharge ? [rt.extra.airport(formatRupees(oneway.airportSurcharge))] : []),
  ];

  return (
    <>
      <Header locale={locale} path={path} />
      <main className="mx-auto max-w-[var(--container-site)] px-4 pb-24 pt-6 sm:px-6 md:pb-12">
        <Breadcrumbs items={crumbs} locale={locale} />

        {/* ── Title, the road, the fares ──────────────────────────────── */}
        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_minmax(0,440px)] lg:gap-12">
          <div>
            <Badge tone="days">{reg[locale].name}</Badge>
            <h1 className="text-h1 mt-3 text-royal-600">{rt.title(from, to)}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-2 text-muted">
              <Icon name="mapPin" size={18} className="text-maroon-600" />
              <span>
                {from} <span className="text-gold-700">→</span> {to}
              </span>
              {oneway?.km ? <span>· {rt.km(oneway.km)}</span> : null}
            </p>
            {low ? (
              <p className="mt-4 text-body-lg">
                <span className="text-h2 text-maroon-600">{t.fare.fromAmount(formatRupees(low.rupees))}</span>
                <span className="text-muted"> · {low.label}</span>
              </p>
            ) : null}
            <div className="mt-6 space-y-4">
              {(text?.intro ?? [rt.dataOnly(from, to)]).map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </div>
          <section aria-labelledby="fares" className="rounded-[var(--radius-lg)] bg-sand-50 p-4 ring-1 ring-gold-300/60 sm:p-5">
            <h2 id="fares" className="text-h3 text-royal-700">
              {rt.faresTitle}
            </h2>
            <div className="mt-3">
              {oneway ? (
                <OnewayFareTable view={oneway} locale={locale} />
              ) : (
                <p className="font-semibold text-royal-700" data-fare="none">
                  {t.fare.onWhatsapp}
                </p>
              )}
            </div>
            <div className="mt-4">
              {cars.length ? (
                <RouteBook
                  cars={cars.map((c) => ({ key: c.key, label: c.label }))}
                  messages={bookLinks}
                  labels={{ choose: rt.chooseCar, book: rt.book }}
                />
              ) : (
                <Button variant="primary" size="lg" href={bookRouteLink(route.pickup, route.drop, locale, undefined, Boolean(route.held))}>
                  {rt.book}
                </Button>
              )}
            </div>
          </section>
        </div>

        {/* ── Coming back ──────────────────────────────────────────────── */}
        {roundtrip && roundLow ? (
          <section className="mt-12 max-w-2xl rounded-[var(--radius-lg)] bg-royal-50 p-5">
            <h2 className="text-h3 text-royal-700">{rt.roundTitle}</h2>
            <p className="mt-2">
              {rt.roundLine(roundtrip.includedKm)}{' '}
              <strong className="text-maroon-600" data-fare="roundtrip" data-rupees={roundLow.rupees}>
                {t.fare.fromAmount(formatRupees(roundLow.rupees))}
              </strong>{' '}
              <span className="text-muted">
                ({roundLow.label}, {t.fare.gst(roundtrip.gstPercent)})
              </span>
            </p>
            <p className="mt-2 text-small text-muted">{rt.roundMore(roundtrip.minKmPerDay)}</p>
          </section>
        ) : null}

        {/* ── On the way, and a tip ────────────────────────────────────── */}
        {text?.onTheWay?.length ? (
          <section className="mt-12">
            <h2 className="text-h2 text-royal-600">{rt.onTheWay}</h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2">
              {text.onTheWay.map((s) => (
                <li key={s.name} className="rounded-[var(--radius-md)] bg-sand-50 p-4 ring-1 ring-gold-300/60">
                  <h3 className="text-h3 flex items-start gap-2 text-royal-700">
                    <span aria-hidden className="mt-0.5 text-gold-700">✦</span>
                    {s.name}
                  </h3>
                  <p className="mt-1 text-ink/80">{s.line}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
        {text?.tip ? (
          <aside className="mt-8 flex max-w-2xl gap-3 rounded-[var(--radius-md)] border-l-4 border-gold-500 bg-white p-4 shadow-card">
            <Icon name="info" className="mt-0.5 shrink-0 text-gold-700" />
            <p>
              <strong className="text-royal-700">{rt.tip}: </strong>
              {text.tip}
            </p>
          </aside>
        ) : null}

        {/* ── Tours on this road ───────────────────────────────────────── */}
        {packages.length ? (
          <section className="mt-12">
            <h2 className="text-h2 text-royal-600">{rt.toursOnRoad}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((x) => (
                <PackageCard key={x.slug} tour={x} href={localePath(`/packages/${x.slug}`, locale)} locale={locale} />
              ))}
            </div>
          </section>
        ) : null}

        {/* ── What the fare covers ─────────────────────────────────────── */}
        <section className="mt-12 rounded-[var(--radius-lg)] bg-white p-5 shadow-card ring-1 ring-black/5">
          <IncludesList includes={rt.inFare} excludes={extras} locale={locale} />
        </section>

        {/* ── Arriving, the other way, more roads ──────────────────────── */}
        <div className={`mt-12 grid gap-10 ${arriving ? 'lg:grid-cols-[minmax(0,280px)_1fr]' : ''}`}>
          {arriving ? (
            <section>
              <h2 className="text-h3 text-royal-700">{rt.arriving(arriving[locale].name)}</h2>
              <div className="mt-4 max-w-[280px]">
                <DestinationCard
                  name={arriving[locale].name}
                  line={arriving[locale].line}
                  photoKey={arriving.photo}
                  href={localePath(`/destinations/${arriving.slug}`, locale)}
                  locale={locale}
                />
              </div>
            </section>
          ) : null}
          <div className="flex flex-col gap-8">
            {reverseLink ? (
              <section>
                <h2 className="text-h3 text-royal-700">{rt.otherWay}</h2>
                <div className="mt-4 max-w-md">
                  <RouteCard from={to} to={from} href={localePath(`/cab/${reverseLink.slug}`, locale)} locale={locale} />
                </div>
              </section>
            ) : null}
            {more.length ? (
              <section>
                <h2 className="text-h3 text-royal-700">{rt.moreFrom(cityName(route.pickup, locale))}</h2>
                <div className={`mt-4 grid gap-3 sm:grid-cols-2 ${arriving ? '' : 'lg:grid-cols-3'}`}>
                  {more.map((r) => (
                    <RouteCard
                      key={r.slug}
                      from={routeEndName(r.pickup, locale)}
                      to={routeEndName(r.drop, locale)}
                      href={localePath(`/cab/${r.slug}`, locale)}
                      locale={locale}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>

        {/* ── Beyond Rajasthan: the way in ─────────────────────────────── */}
        {route.rajasthan === 'none' ? (
          <section className="mt-12">
            <a
              href={localePath('/destinations', locale)}
              className="flex items-center gap-4 rounded-[var(--radius-lg)] bg-sand-200 p-5 ring-1 ring-gold-300 hover:ring-gold-500"
            >
              <FortSun className="w-16 shrink-0" />
              <span>
                <span className="text-h3 block text-royal-700">{rt.beyondTitle}</span>
                <span className="text-muted">{rt.beyondLine(PLACES.length)}</span>
              </span>
              <Icon name="arrow" className="ml-auto text-royal-600" />
            </a>
          </section>
        ) : null}

        {/* ── Questions ────────────────────────────────────────────────── */}
        {faq.length ? (
          <section className="mx-auto mt-12 max-w-3xl">
            <SectionHeader title={rt.questions(from, to)} />
            <div className="mt-6">
              <FAQ items={faq} />
            </div>
          </section>
        ) : null}
      </main>
      <Footer locale={locale} />
      <StickyCta>
        <Button variant="primary" href={low ? bookLinks[low.key] : bookRouteLink(route.pickup, route.drop, locale, undefined, Boolean(route.held))}>
          {t.cta.whatsapp}
        </Button>
        <Button variant="call" href={brand.phoneHref}>
          {t.cta.call}
        </Button>
      </StickyCta>
      {routeIndexable(route) ? (
        <JsonLd
          data={[
            taxiServiceJsonLd({ name: rt.title(from, to), from, to, path, locale, lowestRupees: low?.rupees ?? null }),
            breadcrumbJsonLd(crumbs),
            ...(faq.length ? [faqJsonLd(faq)] : []),
          ]}
        />
      ) : null}
    </>
  );
}
