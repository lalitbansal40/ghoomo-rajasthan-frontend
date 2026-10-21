import { sitePhotos } from '@/lib/site-photos';
import { stockPhotoCredits } from '@/lib/site-photo-credits';
import { catalog } from '@/lib/catalog';
import { travelPublicCatalog } from '@/lib/travel-catalog';
import { env } from '@/lib/env';
import { CatalogNotice } from '@/components/CatalogNotice';
import type { Metadata } from 'next';
import Image from 'next/image';
import { DocPage } from '@/components/DocPage';
import { LICENCE_URL } from '@/content/photos';

export const metadata: Metadata = {
  title: 'Photo credits',
  description: 'Who took the photographs on this site, and the licence each one is used under.',
  alternates: { canonical: '/photo-credits' },
  // A list of names and licences — worth a link, never a search result.
  robots: { index: false, follow: true },
};

/**
 * The credit every photograph asks for (content/photos.ts, written by scripts/photos.mjs from
 * the Commons API). CC BY and CC BY-SA require the author, the licence, the source and any
 * change to be named; every file here is cropped and resized, so that is said too.
 */
export default async function PhotoCreditsPage() {
  const state = await catalog();
  const photos = await sitePhotos();
  const managed = [...new Map(state.packages.flatMap((p) => p.media ?? []).map((m) => [m.id, m])).values()];
  const travelMedia = [...new Map((await travelPublicCatalog()).flatMap(p => p.media).map(m => [m.id, m])).values()];
  return (
    <DocPage
      path="/photo-credits"
      title="Photo credits"
      intro="Credits, sources, licences and changes for the photographs used on this site. Thank you to every photographer below."
    >
      <CatalogNotice unavailable={state.unavailable} locale="en" />
      <ul className="grid gap-5 sm:grid-cols-2">
        {travelMedia.map(m => <li key={m.id}><Image unoptimized src={new URL(m.variants.card, new URL(env.apiBaseUrl).origin).toString()} alt={m.rights.alt.en} width={640} height={480} className="h-auto w-full" /><p>{m.rights.credit} · {m.rights.license}</p><p className="break-words">{m.rights.source}</p><p>{m.rights.changes}</p></li>)}
        {managed.map((m) => <li key={m.id}><Image unoptimized src={m.variants.card} alt={m.alt.en} width={640} height={480} className="h-auto w-full" /><p>{m.credit} · {m.licence}</p><p className="break-words">{m.sourceUrl}</p><p>{m.changes}</p></li>)}
        {Object.entries(photos).map(([slot, p]) => <li key={slot} className="overflow-hidden rounded-2xl border border-black/10 bg-white"><Image src={p.variants.card} alt={p.alt.en} width={640} height={480} className="h-auto w-full" /><div className="p-4 text-sm"><p className="font-semibold">{p.alt.en}</p><p>© {p.credit}</p><p>Rights confirmed by the uploader. Cropped and resized; metadata removed.</p></div></li>)}
        {stockPhotoCredits(photos).map((p) => {
          const licence = LICENCE_URL[p.licence];
          return (
            <li key={p.key} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
              <Image src={p.card} alt={p.alt} width={640} height={480} className="h-auto w-full" />
              <div className="p-4 text-sm leading-relaxed">
                <p className="font-semibold text-ink">{p.alt}</p>
                <p className="mt-1">
                  Photo by {p.credit} ·{' '}
                  {licence ? (
                    <a href={licence} className="text-royal underline" rel="license noopener" target="_blank">
                      {p.licence}
                    </a>
                  ) : (
                    p.licence
                  )}{' '}
                  ·{' '}
                  <a href={p.sourceUrl} className="text-royal underline" rel="noopener" target="_blank">
                    Source
                  </a>
                </p>
                <p className="mt-1 text-muted">{p.changes}.</p>
              </div>
            </li>
          );
        })}
      </ul>
    </DocPage>
  );
}
