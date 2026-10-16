import type { Metadata } from 'next';
import Image from 'next/image';
import { DocPage } from '@/components/DocPage';
import { LICENCE_URL, PHOTOS } from '@/content/photos';

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
export default function PhotoCreditsPage() {
  return (
    <DocPage
      title="Photo credits"
      intro="The photographs on this site are from Wikimedia Commons, used under the licence each one was published with. Thank you to every photographer below."
    >
      <ul className="grid gap-5 sm:grid-cols-2">
        {PHOTOS.map((p) => {
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
