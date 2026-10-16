'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dict, localePath, localeOf, otherLocale, LANG_TAG } from '@/i18n';
import { exists } from '@/i18n/pages';

/**
 * "EN | हिं" — the same page in the other language, or that language's home when the page has
 * no twin yet (i18n/pages.ts). A plain link: the two languages are two root layouts, so the
 * switch is a full page load anyway.
 */
export function LangSwitch({ className = '' }: { className?: string }) {
  const path = usePathname() || '/';
  const here = localeOf(path);
  const there = otherLocale(here);
  const bare = path.replace(/^\/hi(?=\/|$)/, '') || '/';
  const href = exists(bare, there) ? localePath(bare, there) : localePath('/', there);
  const t = dict(here);
  return (
    <Link
      href={href}
      hrefLang={LANG_TAG[there].hreflang}
      lang={LANG_TAG[there].html}
      aria-label={t.lang.switchTo}
      className={`inline-flex min-h-10 items-center gap-1 rounded-full border border-royal-200 px-3 text-[0.9375rem] font-semibold text-royal-700 hover:bg-royal-50 ${className}`}
    >
      <span aria-hidden className="text-muted">{t.lang.current}</span>
      <span aria-hidden className="text-gold-700">|</span>
      <span aria-hidden>{t.lang.short}</span>
    </Link>
  );
}
