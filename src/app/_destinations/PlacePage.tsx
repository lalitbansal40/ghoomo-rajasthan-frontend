import { sitePhotos, photoFor } from '@/lib/site-photos';
import { catalog, toursInCity } from '@/lib/catalog';
import { CatalogNotice } from '@/components/CatalogNotice';
import { dict, localePath, type Locale } from '@/i18n';
import { exists } from '@/i18n/pages';
import { PLACES, fareCity, type Place } from '@/content/places';
import { region } from '@/content/regions';
import { cityName } from '@/content/cities';
import { LINKABLE_ROUTES } from '@/content/routes/list';
import { pkgIn } from '@/content/packages';
import { photo } from '@/content/photos';
import { safe } from '@/lib/api';
import { cheapest, localView } from '@/lib/fares';
import { routeFares, roundtripRates } from '@/lib/route-fares';
import { bookPlaceLink } from '@/lib/book';
import { BookingWidget } from '@/components/booking/BookingWidget';
import { brand } from '@/lib/site';
import { touristDestinationJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { LocalFareTable } from '@/components/LocalFareTable';
import { PerKmTable } from '@/components/PerKmTable';
import { FortSun, MehrabFrame } from '@/components/motifs';
import {
  Badge,
  Breadcrumbs,
  Button,
  DestinationCard,
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
import { PageScene } from '@/components/scene/PageScene';

/** The places whose desert safari is sold on /desert-safari (anchors there by the same slug). */
export const SAFARI_PLACES = new Set(['jaisalmer', 'bikaner', 'pushkar', 'osian']);

/**
 * A place page's title: as much of "— what to see, when to go" as fits in 60 characters with
 * the " · Ghoomo Rajasthan" the layout adds.
 */
export function placeTitle(place: Place, locale: Locale): string {
  const name = place[locale].name;
  const tails = locale === 'hi' ? [' — क्या देखें, कब जाएँ', ' — क्या देखें', ''] : [' — what to see, when to go', ' — what to see', ''];
  const suffix = locale === 'hi' ? ' · घूमो राजस्थान' : ' · Ghoomo Rajasthan';
  return name + (tails.find((tail) => [...(name + tail + suffix)].length <= 60) ?? '');
}

/** What a place page says about itself in a search result — its line and its first sights. */
export function placeDescription(place: Place, locale: Locale): string {
  const t = place[locale];
  const sights = t.see.slice(0, 3).map((s) => s.name).join(', ');
  const tail = locale === 'hi' ? ` — ${sights}। कब जाएँ, कितने दिन, और वहाँ गाड़ी।` : ` — ${sights}. When to go, how long, and a car there.`;
  return (t.line + tail).slice(0, 155);
}

/** One place, in either language: what to see, when, how long, the roads there and a car in town. */
export async function PlacePage({ place, locale }: { place: Place; locale: Locale }) {
  const catalogState = await catalog();
  const PACKAGES = catalogState.packages;
  const packagesFor = (key: string) => toursInCity(PACKAGES, key);
  const t = dict(locale);
  const pt = t.place;
  const txt = place[locale];
  const reg = region(place.region);
  const path = localePath(`/destinations/${place.slug}`, locale);
  const p = photoFor(`place:${place.key}`, place.photo ? photo(place.photo) : null, await sitePhotos(), locale);
  const crumbs = [
    { label: locale === 'hi' ? 'होम' : 'Home', href: localePath('/', locale) },
    { label: t.nav.destinations, href: localePath('/destinations', locale) },
    { label: reg[locale].name, href: `${localePath('/destinations', locale)}?region=${reg.key}` },
    { label: txt.name },
  ];

  // The car in town: this place's own local fare, or the nearest town's.
  const town = fareCity(place);
  const local = town && place.nearest?.how !== 'roundTrip' ? localView(await safe.local(town)) : null;
  // A day out from a bigger town: the per-km rates the round trip is billed at.
  const perKm = place.nearest?.how === 'roundTrip' ? await roundtripRates() : null;

  // Roads that end here — only once the cab pages exist (Step 3), never a link to a 404.
  const showRoads = exists('/cab/x', locale) && place.cityKey;
  const roads = showRoads
    ? LINKABLE_ROUTES.filter((r) => r.drop === place.cityKey)
        .sort((a, b) => Number(b.pickup === 'JAIPUR') - Number(a.pickup === 'JAIPUR') || Number(a.rajasthan !== 'both') - Number(b.rajasthan !== 'both'))
        .slice(0, 6)
    : [];
  const roadFares = await Promise.all(roads.map((r) => routeFares(r).then((f) => ({ r, f }))));

  const tours = packagesFor(place.key).map((x) => pkgIn(x, locale));
  // The city a car is booked from here — the place's own, or the nearest one with fares.
  const bookCity = fareCity(place);
  const nearby = PLACES.filter((x) => x.slug !== place.slug && x.region === place.region).slice(0, 3);
  const others = nearby.length ? nearby : PLACES.filter((x) => x.slug !== place.slug && x.featured).slice(0, 3);
  const safari = SAFARI_PLACES.has(place.slug) && exists('/desert-safari', locale);

  return (
    <>
      <Header locale={locale} path={path} />
      <PageScene kind="place" />
      <main className="mx-auto max-w-[var(--container-site)] px-4 pb-24 pt-6 sm:px-6 md:pb-12">
        <CatalogNotice unavailable={catalogState.unavailable} locale={locale} />
        <Breadcrumbs items={crumbs} locale={locale} />

        {/* ── The top: photo in the jharokha, name, line, intro ─────────── */}
        <div className="mt-6 grid items-start gap-8 md:grid-cols-[minmax(0,320px)_1fr] lg:gap-12">
          <div className="relative mx-auto w-[60vw] max-w-[300px] md:w-full">
            {p ? (
              <>
                <MehrabFrame src={p.card} alt={p.alt} preload sizes="(min-width: 768px) 320px, 60vw" />
                <PhotoCredit photo={p} label={t.common.photoBy} />
              </>
            ) : (
              <div className="grid aspect-[148/218] place-items-center rounded-t-full bg-primary-hover p-8">
                <FortSun tone="silhouette" className="w-full text-gold-500" />
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="days">{reg[locale].name}</Badge>
              {place.tags.map((tag) => (
                <Badge key={tag} tone="neutral">
                  {pt.tags[tag]}
                </Badge>
              ))}
            </div>
            <h1 className="text-h1 mt-3 text-link">{txt.name}</h1>
            <p className="text-body-lg mt-2 text-accent">{txt.line}</p>
            <div className="mt-5 space-y-4">
              {txt.intro.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primary" href={bookCity ? '#book' : bookPlaceLink(txt.name, locale)}>
                {pt.plan}
              </Button>
              <Button variant="call" href={brand.phoneHref}>
                {t.cta.call} · {brand.phone}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Book a car here: a day in town, or the road there (owner, 20 Oct 2026) ── */}
        {bookCity ? (
          <section className="mx-auto mt-10 max-w-3xl">
            <BookingWidget locale={locale} {...(place.cityKey ? { defaultTrip: 'local' as const, defaultPickup: place.cityKey } : { defaultTrip: 'one_way' as const, defaultDrop: bookCity })} />
          </section>
        ) : null}

        {/* ── What to see ──────────────────────────────────────────────── */}
        <section className="mt-12">
          <h2 className="text-h2 text-link">{pt.see}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {txt.see.map((s) => (
              <li key={s.name} className="rounded-[var(--radius-md)] bg-soft p-4 ring-1 ring-edge/60">
                <h3 className="text-h3 flex items-start gap-2 text-heading">
                  <span aria-hidden className="mt-0.5 text-gold-text">✦</span>
                  {s.name}
                </h3>
                <p className="mt-1 text-content/80">{s.line}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── When, how long, getting there ────────────────────────────── */}
        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { icon: 'sun' as const, title: pt.when, body: txt.when },
            { icon: 'calendar' as const, title: pt.howLong, body: txt.days },
            { icon: 'mapPin' as const, title: pt.reach, body: txt.reach },
          ].map((b) => (
            <div key={b.title} className="rounded-[var(--radius-md)] bg-tint p-5">
              <h2 className="text-h3 flex items-center gap-2 text-heading">
                <Icon name={b.icon} /> {b.title}
              </h2>
              <p className="mt-2">{b.body}</p>
            </div>
          ))}
        </section>

        {/* ── Roads here, with their fares ──────────────────────────────── */}
        {roadFares.length ? (
          <section className="mt-12">
            <h2 className="text-h2 text-link">{pt.roadsHere(txt.name)}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roadFares.map(({ r, f }) => (
                <RouteCard
                  key={r.slug}
                  from={cityName(r.pickup, locale)}
                  to={txt.name}
                  km={f.oneway?.km ?? null}
                  fromRupees={cheapest(f.oneway)?.rupees ?? null}
                  href={localePath(`/cab/${r.slug}`, locale)}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* ── A car there ──────────────────────────────────────────────── */}
        {town ? (
          <section className="mt-12 max-w-2xl">
            <h2 className="text-h2 text-link">{pt.carThere(txt.name)}</h2>
            <p className="mt-2 text-subtle">
              {place.nearest
                ? place.nearest.how === 'roundTrip'
                  ? pt.carRoundTrip(txt.name, cityName(place.nearest.cityKey, locale))
                  : pt.carFrom(txt.name, cityName(place.nearest.cityKey, locale))
                : pt.carThereLine}
            </p>
            <div className="mt-4">
              {local ? (
                <LocalFareTable view={local} locale={locale} />
              ) : perKm ? (
                <PerKmTable view={perKm} locale={locale} />
              ) : (
                <p className="font-semibold text-heading" data-fare="none">
                  {t.fare.onWhatsapp}
                </p>
              )}
            </div>
          </section>
        ) : null}

        {/* ── Tours that go here ───────────────────────────────────────── */}
        {tours.length ? (
          <section className="mt-12">
            <h2 className="text-h2 text-link">{pt.toursHere}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((x) => (
                <PackageCard key={x.slug} tour={x} href={localePath(`/packages/${x.slug}`, locale)} locale={locale} />
              ))}
            </div>
          </section>
        ) : null}

        {/* ── Desert safari ────────────────────────────────────────────── */}
        {safari ? (
          <section className="mt-12">
            <a
              href={`${localePath('/desert-safari', locale)}#${place.slug}`}
              className="flex items-center gap-4 rounded-[var(--radius-lg)] bg-alternate p-5 ring-1 ring-edge hover:ring-gold-500"
            >
              <FortSun className="w-16 shrink-0" />
              <span>
                <span className="text-h3 block text-heading">{pt.safariHere}</span>
                <span className="text-subtle">{pt.safariLine}</span>
              </span>
              <Icon name="arrow" className="ml-auto text-link" />
            </a>
          </section>
        ) : null}

        {/* ── Nearby ───────────────────────────────────────────────────── */}
        <section className="mt-12">
          <h2 className="text-h2 text-link">{pt.nearby}</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {others.map((x) => (
              <DestinationCard
                key={x.slug}
                name={x[locale].name}
                line={x[locale].line}
                photoKey={x.photo}
                href={localePath(`/destinations/${x.slug}`, locale)}
                locale={locale}
              />
            ))}
          </div>
        </section>

        {/* ── Questions ────────────────────────────────────────────────── */}
        <section className="mx-auto mt-12 max-w-3xl">
          <SectionHeader title={pt.questions(txt.name)} />
          <div className="mt-6">
            <FAQ items={txt.faq} />
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <StickyCta>
        {/* The short label: two buttons must fit a 360 px phone side by side, in Hindi too. */}
        <Button variant="primary" href={bookCity ? '#book' : bookPlaceLink(txt.name, locale)}>
          {t.cta.bookNow}
        </Button>
        <Button variant="call" href={brand.phoneHref}>
          {t.cta.call}
        </Button>
      </StickyCta>
      <JsonLd path={`/destinations/${place.slug}`} locale={locale} data={[touristDestinationJsonLd(place, locale, p?.big), breadcrumbJsonLd(crumbs), faqJsonLd(txt.faq)]} />
    </>
  );
}
