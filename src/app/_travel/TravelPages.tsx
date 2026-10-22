import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { DocPage } from '@/components/DocPage';
import { TravelBookingBuilder } from '@/components/travel/TravelBookingBuilder';
import { TravelCustomRequest } from '@/components/travel/TravelCustomRequest';
import { TravelQuotes } from '@/components/travel/TravelQuotes';
import { TravelBookings } from '@/components/travel/TravelBookings';
import { localePath, type Locale } from '@/i18n';
import { env } from '@/lib/env';
import { travelPublicCatalog, travelProduct } from '@/lib/travel-catalog';
import { travelPath, type TravelKind } from '@/lib/travel-contract';
import { pageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
export const travelTitle = (kind: TravelKind, hi: boolean) => ({ tour: hi ? 'राजस्थान टूर बुक करें' : 'Book Rajasthan tours', group: hi ? 'ग्रुप टूर बुक करें' : 'Book a group tour', hotel: hi ? 'होटल बुक करें' : 'Book a hotel' })[kind];
function check() { if (!env.travelEnabled) notFound(); }
export async function travelProductMetadata(kind: TravelKind, slug: string, locale: Locale) {
  check(); const data = await travelProduct(slug); if (!data || data.product.kind !== kind) notFound();
  return { title: data.product.content[locale].title, description: data.product.content[locale].summary,
    ...pageMetadata(`${travelPath(kind)}/${slug}`, locale, true, data.product.contentRevision) };
}
function TravelNavigation({ locale }: { locale: Locale }) {
  const hi = locale === 'hi';
  return <nav aria-label={hi ? 'यात्रा बुकिंग के विकल्प' : 'Travel booking options'} className="mb-6 flex flex-wrap gap-5 text-link underline">{(['tour', 'group', 'hotel'] as const).map(kind => <Link className="min-h-11" key={kind} href={localePath(travelPath(kind), locale)}>{travelTitle(kind, hi)}</Link>)}<Link className="min-h-11" href={localePath('/plan-your-trip', locale)}>{hi ? 'अपनी यात्रा बनाएँ' : 'Build your trip'}</Link><Link className="min-h-11" href={localePath('/travel-bookings', locale)}>{hi ? 'मेरी यात्रा बुकिंग' : 'My travel bookings'}</Link></nav>;
}
export async function TravelListing({ kind, locale }: { kind: TravelKind; locale: Locale }) {
  check(); const items = (await travelPublicCatalog()).filter(p => p.kind === kind); const hi = locale === 'hi';
  return <DocPage path={travelPath(kind)} locale={locale} title={travelTitle(kind, hi)} intro={hi ? 'तारीख, यात्रियों और दर की शर्तें देखकर ऑनलाइन बुक करें।' : 'Review travel dates, party and rate conditions, then book online.'}>
    <TravelNavigation locale={locale} />
    {items.length ? <ul className="space-y-5">{items.map(p => <li key={p.id} className="rounded-xl border border-edge bg-surface p-5"><h2 className="text-h3 text-link">{p.content[locale].title}</h2><p className="mt-3">{p.content[locale].summary}</p><Link className="mt-4 inline-block min-h-12 rounded-lg bg-primary px-5 py-3 font-semibold text-white" href={localePath(`${travelPath(kind)}/${p.slug}`, locale)}>{hi ? 'विवरण और बुकिंग' : 'Details and booking'}</Link></li>)}</ul> : <p role="status">{hi ? 'अभी कोई प्रकाशित विकल्प उपलब्ध नहीं है।' : 'No published options are available yet.'}</p>}
  </DocPage>;
}
export async function travelListingMetadata(kind: TravelKind, locale: Locale) {
  check(); const items = await travelPublicCatalog();
  return { title: travelTitle(kind, locale === 'hi'), ...pageMetadata(travelPath(kind), locale, items.some(p => p.kind === kind)) };
}
export async function TravelDetail({ kind, slug, locale }: { kind: TravelKind; slug: string; locale: Locale }) {
  check(); const data = await travelProduct(slug); if (!data || data.product.kind !== kind) notFound();
  const w = data.product.content[locale], hi = locale === 'hi';
  return <DocPage path={`${travelPath(kind)}/${slug}`} locale={locale} title={w.title} intro={w.summary}>
    <TravelNavigation locale={locale} />
    <JsonLd path={`${travelPath(kind)}/${slug}`} locale={locale} revision={data.product.contentRevision}
      data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: hi ? 'होम' : 'Home', item: `${env.siteUrl}${localePath('/', locale)}` },
        { '@type': 'ListItem', position: 2, name: travelTitle(kind, hi), item: `${env.siteUrl}${localePath(travelPath(kind), locale)}` },
        { '@type': 'ListItem', position: 3, name: w.title, item: `${env.siteUrl}${localePath(`${travelPath(kind)}/${slug}`, locale)}` },
      ] }} />
    {data.product.media.length ? <section className="my-6 grid gap-5 sm:grid-cols-2" aria-label={hi ? 'तस्वीरें और श्रेय' : 'Photos and credits'}>{data.product.media.map(m =>
      <figure key={m.id}><Image unoptimized src={new URL(m.variants.cover, new URL(env.apiBaseUrl).origin).toString()} alt={m.rights.alt[locale]} width={1280} height={720} className="h-auto w-full rounded-xl" /><figcaption className="mt-2 break-words text-sm">{m.rights.credit} · {m.rights.license} · {m.rights.changes}<br />{m.rights.source}</figcaption></figure>)}</section> : null}
    <p>{w.location}</p><h2 className="mt-6 text-h3 text-link">{hi ? 'यात्रा / ठहरने का विवरण' : 'Itinerary / stay details'}</h2>
    <ol className="my-5 space-y-4">{w.itinerary.map(d => <li key={d.day}><strong>{d.day}. {d.title}</strong><p>{d.details}</p></li>)}</ol>
    <h2 className="text-h3 text-link">{hi ? 'शामिल' : 'Included'}</h2><ul className="my-4 list-disc pl-5">{w.includes.map(s => <li key={s}>{s}</li>)}</ul>
    <h2 className="text-h3 text-link">{hi ? 'शामिल नहीं' : 'Excluded'}</h2><ul className="my-4 list-disc pl-5">{w.excludes.map(s => <li key={s}>{s}</li>)}</ul>
    <p className="whitespace-pre-wrap">{w.terms}</p><p className="my-4 whitespace-pre-wrap">{w.cancellation}</p>
    <Link className="inline-block min-h-12 rounded-lg bg-action px-5 py-3 font-semibold text-white" href={localePath(`/travel-checkout/${slug}`, locale)}>{hi ? 'तारीख चुनें और बुक करें' : 'Choose dates and book'}</Link>
  </DocPage>;
}
export async function TravelPlanner({ locale, slug }: { locale: Locale; slug?: string }) {
  check(); const items = await travelPublicCatalog(); const initial = slug ? await travelProduct(slug) : undefined;
  if (slug && !initial) notFound(); const hi = locale === 'hi';
  return <DocPage path={slug ? `/travel-checkout/${slug}` : '/plan-your-trip'} locale={locale} title={hi ? 'अपनी राजस्थान यात्रा बनाएँ और बुक करें' : 'Build and book your Rajasthan trip'} intro={hi ? 'टूर, ग्रुप प्रस्थान और होटल जोड़ें। अंतिम कीमत और उपलब्धता चेकआउट पर दोबारा जाँची जाएगी।' : 'Combine tours, group departures and hotel stays. Prices and availability are rechecked at checkout.'}>
    <TravelNavigation locale={locale} />
    {!items.length && !initial ? <p role="status">{hi ? 'अभी बिक्री योग्य प्रकाशित विकल्प उपलब्ध नहीं हैं।' : 'There are no published booking options available yet.'}</p> : <TravelBookingBuilder locale={locale} products={items} initial={initial ?? undefined} />}
    {!slug ? <div className="mt-8"><TravelCustomRequest locale={locale} /></div> : null}
  </DocPage>;
}
export function TravelBookingsPage({ locale, id }: { locale: Locale; id?: string }) {
  if (id && !/^[a-f\d]{24}$/i.test(id)) notFound();
  return <DocPage path={id ? `/travel-bookings/${id}` : '/travel-bookings'} locale={locale} title={locale === 'hi' ? 'मेरी यात्रा बुकिंग' : 'My travel bookings'}><TravelBookings locale={locale} id={id} /></DocPage>;
}

export function TravelQuotesPage({ locale, id }: { locale: Locale; id?: string }) {
  if (id && !/^[a-f\d]{24}$/i.test(id)) notFound();
  return <DocPage path={id ? `/trip-requests/${id}` : '/trip-requests'} locale={locale} title={locale === 'hi' ? 'मेरी रिक्वेस्ट और कोटेशन' : 'My requests and quotes'}><TravelQuotes locale={locale} id={id} /></DocPage>;
}
