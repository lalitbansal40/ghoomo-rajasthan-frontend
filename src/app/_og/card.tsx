import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { env } from '@/lib/env';
import { managedMediaUrl } from '@/lib/catalog-contract';
import { photo } from '@/content/photos';

/**
 * Every share image on the site (WhatsApp, Facebook, a search result's preview) — the brand's
 * lettering (Rozha One, OFL: src/app/_og/OFL.txt), a title, a line or two, a price only when
 * the caller has a real one, and the photo on the right. Built once per page at build time.
 *
 * In English for both languages: the image renderer (Satori) does not shape devanagari — the
 * Hindi came out with its matras in the wrong place ("सरकटि" for सर्किट, 16 Oct 2026). A
 * clean English image beats a broken Hindi one; the Hindi page's own title and text stay Hindi.
 */
export const OG_SIZE = { width: 1200, height: 630 };

export async function ogCard({
  title,
  meta,
  sub,
  price,
  photoKey,
  imageUrl,
}: {
  title: string;
  meta?: string;
  sub?: string;
  price?: string | null;
  photoKey?: string;
  imageUrl?: string;
}) {
  const root = process.cwd();
  const [font, icon, fort, pic] = await Promise.all([
    readFile(join(root, 'src/app/_og/RozhaOne-Regular.ttf')),
    readFile(join(root, 'public/brand/icon-192.png')),
    readFile(join(root, 'public/brand/icon-512.png')),
    (async () => {
      if (imageUrl) {
        const url = managedMediaUrl(imageUrl, env.apiBaseUrl);
        const response = await fetch(url, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(8000) });
        if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) return null;
        const reader = response.body?.getReader(); if (!reader) return null;
        const chunks: Uint8Array[] = []; let size = 0;
        try { while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 4 * 1024 * 1024) throw new Error('OG image too large'); chunks.push(value); } } finally { await reader.cancel(); }
        const jpg = await sharp(Buffer.concat(chunks), { limitInputPixels: 24_000_000 }).resize(520, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer();
        return `data:image/jpeg;base64,${jpg.toString('base64')}`;
      }
      const p = photoKey ? photo(photoKey) : null;
      if (!p) return null;
      // Satori draws PNG/JPEG, not WebP: the photo is converted, at the size it is shown.
      const jpg = await sharp(join(root, 'public', p.big)).resize(520, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer();
      return `data:image/jpeg;base64,${jpg.toString('base64')}`;
    })(),
  ]);

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#FBF7EF', fontFamily: 'Rozha' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 680, padding: '56px 56px 56px 64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- satori draws plain img */}
            <img src={`data:image/png;base64,${icon.toString('base64')}`} width={72} height={72} alt="" />
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: 30, lineHeight: 1 }}>
              <span style={{ color: '#1E3A7B' }}>Ghoomo</span>
              <span style={{ color: '#8E1B1B' }}>Rajasthan</span>
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: 40, fontSize: title.length > 22 ? 58 : 68, lineHeight: 1.1, color: '#1E3A7B' }}>
            {title}
          </div>
          <div style={{ display: 'flex', marginTop: 18, width: 160, height: 4, background: '#E0A93B', borderRadius: 2 }} />
          {meta ? <div style={{ display: 'flex', marginTop: 22, fontSize: 34, color: '#8E1B1B' }}>{meta}</div> : null}
          {sub ? <div style={{ display: 'flex', marginTop: 10, fontSize: 26, color: '#5B5650' }}>{sub}</div> : null}
          {price ? <div style={{ display: 'flex', marginTop: 24, fontSize: 40, color: '#8E1B1B' }}>{price}</div> : null}
        </div>
        {pic ? (
          // eslint-disable-next-line @next/next/no-img-element -- satori draws plain img
          <img src={pic} width={520} height={630} style={{ objectFit: 'cover' }} alt="" />
        ) : (
          // No licensed photo: the logo, large, on royal blue — never an empty half.
          <div style={{ display: 'flex', width: 520, height: 630, alignItems: 'center', justifyContent: 'center', background: '#1E3A7B' }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- satori draws plain img */}
            <img src={`data:image/png;base64,${fort.toString('base64')}`} width={300} height={300} alt="" />
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE, headers: { 'Cache-Control': 'no-store' }, fonts: [{ name: 'Rozha', data: font, weight: 400, style: 'normal' }] },
  );
}
