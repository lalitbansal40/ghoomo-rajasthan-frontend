import { catalog, toursInCity } from '@/lib/catalog';
import { CatalogNotice } from '@/components/CatalogNotice';
import { dict, localePath, type Locale } from '@/i18n';
import { PLACES } from '@/content/places';
import { REGIONS } from '@/content/regions';
import { bookStartLink, customTripLink } from '@/lib/book';
import { brand } from '@/lib/site';
import { itemListJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { PlaceFilter } from '@/components/PlaceFilter';
import { RajasthanMap } from '@/components/RajasthanMap';
import { DuneDivider } from '@/components/motifs';
import { Breadcrumbs, Button, DestinationCard, EmptyState, Footer, Header, SectionHeader, StickyCta, breadcrumbJsonLd } from '@/components/ui';

/** Map labels for places close enough that their names would collide (checked on the map). */
const LABEL_SIDE: Record<string, 'left' | 'right' | 'above' | 'below'> = {
  jaipur: 'above',
  ajmer: 'below',
  pushkar: 'above',
  jodhpur: 'left',
  ranthambore: 'right',
  udaipur: 'right',
  'mount-abu': 'left',
  chittorgarh: 'right',
};

/** Every place, on a map and by region — /destinations and /hi/destinations. */
export async function DestinationsList({ locale }: { locale: Locale }) {
  const catalogState = await catalog();
  const PACKAGES = catalogState.packages;
  const packagesFor = (key: string) => toursInCity(PACKAGES, key);
  const t = dict(locale);
  const pt = t.place;
  const path = localePath('/destinations', locale);
  const crumbs = [{ label: locale === 'hi' ? 'होम' : 'Home', href: localePath('/', locale) }, { label: t.nav.destinations }];
  const regions = REGIONS.filter((r) => PLACES.some((p) => p.region === r.key));
  // The filter takes the cards in region order, so each region's section finds its own.
  const ordered = regions.flatMap((r) => PLACES.filter((p) => p.region === r.key));
  const usedTags = (Object.keys(pt.tags) as Array<keyof typeof pt.tags>).filter((k) => PLACES.some((p) => p.tags.includes(k)));
  const href = (slug: string) => localePath(`/destinations/${slug}`, locale);

  return (
    <>
      <Header locale={locale} path={path} />
      <main className="mx-auto max-w-[var(--container-site)] px-4 pb-24 pt-6 sm:px-6 md:pb-12">
        <CatalogNotice unavailable={catalogState.unavailable} locale={locale} />
        <Breadcrumbs items={crumbs} locale={locale} />
        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_minmax(0,420px)]">
          <SectionHeader as="h1" align="left" className="!max-w-2xl" title={pt.listTitle} intro={pt.listIntro(PLACES.length)} />
          <div className="mx-auto w-full max-w-[420px]">
            <RajasthanMap
              label={pt.mapLabel}
              points={PLACES.map((p) => ({ slug: p.slug, name: p[locale].name, lat: p.lat, lng: p.lng, href: href(p.slug), labelled: p.featured, side: LABEL_SIDE[p.slug] }))}
            />
          </div>
        </div>
        <div className="mt-8">
          <PlaceFilter
            items={ordered.map((p) => ({ slug: p.slug, region: p.region, tags: p.tags }))}
            regions={regions.map((r) => ({ key: r.key, name: r[locale].name, line: r[locale].line }))}
            tags={usedTags.map((k) => ({ key: k, label: pt.tags[k] }))}
            labels={{ region: pt.region, kind: pt.kind, all: pt.any }}
            empty={
              <EmptyState
                title={pt.none}
                action={
                  <Button variant="primary" href={customTripLink(locale)}>
                    {t.cta.planTrip}
                  </Button>
                }
              />
            }
          >
            {ordered.map((p) => {
              const n = packagesFor(p.key).length;
              return (
                <DestinationCard
                  key={p.slug}
                  name={p[locale].name}
                  line={p[locale].line}
                  photoKey={p.photo}
                  tours={n || undefined}
                  href={href(p.slug)}
                  locale={locale}
                />
              );
            })}
          </PlaceFilter>
        </div>
      </main>
      <DuneDivider />
      <Footer locale={locale} />
      <StickyCta>
        <Button variant="primary" href={bookStartLink(locale)}>
          {t.cta.bookNow}
        </Button>
        <Button variant="call" href={brand.phoneHref}>
          {t.cta.call}
        </Button>
      </StickyCta>
      <JsonLd path="/destinations" locale={locale} data={[itemListJsonLd(PLACES.map((p) => ({ name: p[locale].name, path: href(p.slug) }))), breadcrumbJsonLd(crumbs)]} />
    </>
  );
}
