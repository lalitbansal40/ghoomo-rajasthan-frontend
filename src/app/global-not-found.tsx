import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { en } from '@/i18n/en';
import { hi } from '@/i18n/hi';
import { env } from '@/lib/env';
import { ROBOTS } from '@/lib/seo';
import './globals.css';

/**
 * The 404 for a URL that matches no route at all — needed because the site has two root
 * layouts (English and Hindi) and so no single layout a not-found page could sit in (Next's
 * global-not-found). It bypasses the layouts, so it brings its own styles and fonts, and says
 * it in both languages — it cannot know which one the visitor reads. No web font at all: a
 * font imported here is preloaded on EVERY page of the site (measured 16 Oct 2026 — the Hindi
 * pages fetched the latin files twice), so the 404 uses the phone's own fonts, which every
 * phone has for both scripts. Its two links do not prefetch: prefetching /hi brought the Hindi
 * layout's devanagari font preload onto this English page (Phase 1 audit, 20 Oct 2026).
 */
export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: `${en.common.notFoundTitle} · Ghoomo Rajasthan`,
  robots: ROBOTS,
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-ivory text-ink">
        <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
          <Image src="/brand/logo-icon.svg" alt="" width={96} height={96} preload />
          <h1 className="text-h1 mt-6 text-royal-600">{en.common.notFoundTitle}</h1>
          <p className="mt-3 text-muted">{en.common.notFoundBody}</p>
          <Link href="/" prefetch={false} className="mt-4 font-semibold text-maroon-600 underline underline-offset-4">
            {en.common.goHome}
          </Link>
          <hr className="my-8 w-24 border-gold-500" />
          <p lang="hi" className="text-h2 text-royal-600">
            {hi.common.notFoundTitle}
          </p>
          <p lang="hi" className="mt-3 text-muted">
            {hi.common.notFoundBody}
          </p>
          <Link lang="hi" href="/hi" prefetch={false} className="mt-4 font-semibold text-maroon-600 underline underline-offset-4">
            {hi.common.goHome}
          </Link>
        </main>
      </body>
    </html>
  );
}
