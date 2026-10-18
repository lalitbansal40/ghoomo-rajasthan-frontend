import Image from 'next/image';
import { notFound } from 'next/navigation';
import { savedPreview } from '@/lib/preview-session';
import { PreviewExchange } from '@/components/PreviewExchange';
import { dict, type Locale } from '@/i18n';
import type { DayPlan } from '@/content/packages';
export default async function PreviewPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!['en', 'hi'].includes(locale)) notFound();
  const preview = await savedPreview(); const t = dict(locale as Locale);
  if (!preview) return <main className="mx-auto max-w-4xl p-6"><h1>{t.catalog.preview}</h1><PreviewExchange locale={locale as Locale} /></main>;
  if (preview.slug !== slug || preview.locale !== locale) notFound();
  const content = preview.content; const words = content[locale];
  return <main className="mx-auto max-w-4xl space-y-5 p-6"><PreviewExchange locale={locale as Locale} active /><aside>{t.catalog.preview} · {preview.contentRevision} · {preview.expiresAt}<form action="/preview/exit" method="post"><button type="submit">{t.catalog.exitPreview}</button></form></aside>
    {content.isSample ? <p>{t.pkg.sampleTour}</p> : null}
    <h1 className="text-h1">{words.title || t.catalog.preview}</h1><p>{words.summary}</p><p>{words.route.join(' → ')}</p>
    <p>{content.days} / {content.nights} · {words.bestMonths}</p>
    <ul>{content.rates.length ? content.rates.map((r: { vehicle: string; amountPaise: number }) => <li key={r.vehicle}>{r.vehicle} · ₹{(r.amountPaise / 100).toFixed(2)}</li>) : <li>{t.catalog.onRequest}</li>}</ul>
    <p>{words.startsFrom} → {words.endsAt}</p><ul>{[...words.goodFor, ...words.highlights].map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
    <p>{words.taxNote}</p><ul>{words.includes.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul><ul>{words.excludes.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
    {words.itinerary.map((d: DayPlan) => <section key={d.day}><h2 className="text-h2">{d.day}. {d.title}</h2><p>{d.morning}</p><p>{d.afternoon}</p><p>{d.evening}</p><p>{d.stay}</p></section>)}
    {words.faq.map((f: {question: string; answer: string}, i: number) => <section key={i}><h2>{f.question}</h2><p>{f.answer}</p></section>)}
    {preview.media.map((m: { id: string; rights: { credit: string; license: string; alt: Record<string, string> } }) => <figure key={m.id}><Image unoptimized src={`/preview/media/${m.id}/cover`} alt={m.rights.alt[locale]} width={1280} height={720} /><figcaption>{m.rights.credit} · {m.rights.license}</figcaption></figure>)}
  </main>;
}
