import type { Metadata } from 'next';
import Image from 'next/image';
import { Cinzel_Decorative, Rozha_One, Yatra_One } from 'next/font/google';

/**
 * The brand at a glance, for the team (never a search result, never in the sitemap): the
 * three lettering candidates for the owner to choose from, the colours, and every logo file
 * at the sizes it is used at. The three fonts are loaded on this page only.
 */
export const metadata: Metadata = {
  title: 'Brand',
  robots: { index: false, follow: false },
};

const yatra = Yatra_One({ subsets: ['latin'], weight: '400', display: 'swap' });
const rozha = Rozha_One({ subsets: ['latin'], weight: '400', display: 'swap' });
const cinzel = Cinzel_Decorative({ subsets: ['latin'], weight: '700', display: 'swap' });

const FONTS = [
  { key: 'yatra', name: 'Yatra One', className: yatra.className, note: 'Desi, hand-painted feel.' },
  { key: 'rozha', name: 'Rozha One', className: rozha.className, note: 'Chosen (16 Oct 2026) — a classical serif with an Indian hand, the closest to the logo.' },
  { key: 'cinzel', name: 'Cinzel Decorative', className: cinzel.className, note: 'Royal, carved-in-stone capitals.' },
];

const COLOURS = [
  { name: 'Royal', hex: '#1E3A7B', use: 'Headings, header, buttons', dark: true },
  { name: 'Maroon', hex: '#8E1B1B', use: 'Prices, highlights', dark: true },
  { name: 'Gold', hex: '#E0A93B', use: 'Borders, dividers, ✦', dark: false },
  { name: 'Sun', hex: '#F5A623', use: 'Gradient start', dark: false },
  { name: 'Sun light', hex: '#FFD27A', use: 'Gradient end', dark: false },
  { name: 'Sand', hex: '#F3D9A4', use: 'Sections, cards', dark: false },
  { name: 'Ivory', hex: '#FBF7EF', use: 'Page background', dark: false },
  { name: 'Ink', hex: '#1B1B1F', use: 'Body text', dark: true },
];

const FILES = [
  { file: 'logo-full.svg', use: 'Hero, about, print — with the car, the brand on its side' },
  { file: 'logo-horizontal.svg', use: 'Header, email signature' },
  { file: 'logo-icon.svg', use: 'Favicon, app icon, WhatsApp / social picture' },
  { file: 'logo-white.svg', use: 'On photos and dark backgrounds (one colour — no car)', dark: true },
  { file: 'logo-mono.svg', use: 'Bills, stamps (one colour — no car)' },
];

export default function BrandPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl text-royal">Ghoomo Rajasthan — brand</h1>
      <p className="mt-2 text-muted">For the team. Not linked from the site and hidden from search.</p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-royal">1. The lettering — Rozha One</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {FONTS.map((f) => (
            <figure key={f.key} className="rounded-2xl border border-gold/40 bg-white p-4">
              <div className={`${f.className} text-center leading-tight`}>
                <p className="text-4xl text-royal">Ghoomo</p>
                <p className="text-4xl text-maroon">Rajasthan</p>
                <p className="mt-3 text-lg text-ink">Jaipur · Udaipur · Jaisalmer</p>
              </div>
              <Image
                src={`/brand/options/full-${f.key}.svg`}
                alt={`The full logo in ${f.name}`}
                width={260}
                height={330}
                className="mx-auto mt-4 h-auto w-full max-w-[220px]"
              />
              <figcaption className="mt-3 text-sm">
                <strong>{f.name}</strong> — {f.note}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-royal">2. Colours</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLOURS.map((c) => (
            <div key={c.hex} className="overflow-hidden rounded-xl border border-black/10">
              <div className="flex h-20 items-end p-2" style={{ background: c.hex, color: c.dark ? '#fff' : '#1B1B1F' }}>
                <span className="text-sm font-semibold">{c.name}</span>
              </div>
              <p className="bg-white p-2 text-xs">
                <code>{c.hex}</code>
                <br />
                {c.use}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-royal">3. Logo files</h2>
        <p className="mt-1 text-sm text-muted">In <code>public/brand/</code>. The icon at the sizes a phone and a browser tab show it:</p>
        <div className="mt-4 flex items-end gap-6 rounded-2xl bg-white p-4">
          {[16, 32, 64, 128, 256].map((s) => (
            <div key={s} className="text-center text-xs text-muted">
              <Image src="/brand/logo-icon.svg" alt="" width={s} height={s} unoptimized />
              <p className="mt-1">{s}px</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {FILES.map((f) => (
            <figure key={f.file} className={`rounded-2xl border border-black/10 p-4 ${f.dark ? 'bg-royal' : 'bg-white'}`}>
              <Image
                src={`/brand/${f.file}`}
                alt={f.file}
                width={400}
                height={240}
                className="mx-auto h-40 w-auto object-contain"
                unoptimized
              />
              <figcaption className={`mt-2 text-sm ${f.dark ? 'text-white' : ''}`}>
                <code>{f.file}</code> — {f.use}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
