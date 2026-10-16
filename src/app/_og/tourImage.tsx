import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { formatRupees } from '@/i18n';
import { PACKAGES_ARE_SAMPLE, cheapest, packageBySlug, pkgIn } from '@/content/packages';
import { photo } from '@/content/photos';

/**
 * A tour's share image (WhatsApp, Facebook, a search result's preview): its photo, the brand's
 * lettering (Rozha One — OFL, src/app/_og/OFL.txt), days and nights, the road, and "from ₹…"
 * only once the price is real. Built once per tour at build time.
 *
 * In English for both languages: the image renderer (Satori) does not shape devanagari — the
 * Hindi name came out with its matras in the wrong place ("सरकटि" for सर्किट, 16 Oct 2026). A
 * clean English image beats a broken Hindi one; the Hindi page's own title and text stay Hindi.
 */
export const OG_SIZE = { width: 1200, height: 630 };

export async function tourImage(slug: string) {
  const pkg = packageBySlug(slug);
  if (!pkg) return new Response('Not found', { status: 404 });
  const tour = pkgIn(pkg, 'en');
  const root = process.cwd();
  const [font, icon, pic] = await Promise.all([
    readFile(join(root, 'src/app/_og/RozhaOne-Regular.ttf')),
    readFile(join(root, 'public/brand/icon-192.png')),
    (async () => {
      const p = photo(tour.photo);
      if (!p) return null;
      // Satori draws PNG/JPEG, not WebP: the photo is converted, at the size it is shown.
      const png = await sharp(join(root, 'public', p.big)).resize(520, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer();
      return `data:image/jpeg;base64,${png.toString('base64')}`;
    })(),
  ]);
  const meta = `${tour.days} days · ${tour.nights} nights`;
  const price = PACKAGES_ARE_SAMPLE ? null : `from ${formatRupees(cheapest(tour).rupees)}`;

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
          <div style={{ display: 'flex', marginTop: 40, fontSize: tour.name.length > 22 ? 58 : 68, lineHeight: 1.1, color: '#1E3A7B' }}>
            {tour.name}
          </div>
          <div style={{ display: 'flex', marginTop: 18, width: 160, height: 4, background: '#E0A93B', borderRadius: 2 }} />
          <div style={{ display: 'flex', marginTop: 22, fontSize: 34, color: '#8E1B1B' }}>{meta}</div>
          <div style={{ display: 'flex', marginTop: 10, fontSize: 26, color: '#5B5650' }}>{tour.route.slice(0, 5).join(' → ')}</div>
          {price ? <div style={{ display: 'flex', marginTop: 24, fontSize: 40, color: '#8E1B1B' }}>{price}</div> : null}
        </div>
        {pic ? (
          // eslint-disable-next-line @next/next/no-img-element -- satori draws plain img
          <img src={pic} width={520} height={630} style={{ objectFit: 'cover' }} alt="" />
        ) : null}
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: 'Rozha', data: font, weight: 400, style: 'normal' }] },
  );
}
