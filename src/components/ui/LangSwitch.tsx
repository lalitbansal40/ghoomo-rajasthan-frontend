import Link from 'next/link';
import { dict, localePath, localeOf, otherLocale, LANG_TAG } from '@/i18n';
import { exists } from '@/i18n/pages';

/**
 * "EN | हिं" — the same page in the other language, or that language's home when the page has
 * no twin yet (i18n/pages.ts). The page says where it is (`path`), so this is server-rendered:
 * no client JavaScript to read the URL (it saved a chunk on every page, 16 Oct 2026). A plain
 * link: the two languages are two root layouts, so the switch is a full page load anyway.
 */
export function LangSwitch({ path, className = '' }: { path: string; className?: string }) {
  const here = localeOf(path);
  const there = otherLocale(here);
  const bare = path.replace(/^\/hi(?=\/|$)/, '') || '/';
  const href = exists(bare, there) ? localePath(bare, there) : localePath('/', there);
  const t = dict(here);
  // On an English page the Hindi words here are the page's only devanagari: drawn in the
  // phone's own font, so they do not pull a 65 kB Hindi font file onto every English page
  // (measured 16 Oct 2026).
  const own = here === 'en' ? { fontFamily: 'system-ui, sans-serif' } : undefined;
  return (
    <Link
      href={href}
      hrefLang={LANG_TAG[there].hreflang}
      lang={LANG_TAG[there].html}
      className={`inline-flex min-h-10 items-center gap-1 rounded-full border border-royal-200 px-3 text-[0.9375rem] font-semibold text-royal-700 hover:bg-royal-50 ${className}`}
    >
      {/* The visible letters are part of the name a screen reader says (WCAG "label in name"),
          followed by what the link does. */}
      <span className="text-muted">{t.lang.current}</span>
      <span aria-hidden className="text-gold-700">|</span>
      <span style={own}>{t.lang.short}</span>
      <span className="sr-only" style={own}>
        {' '}
        — {t.lang.switchTo}
      </span>
    </Link>
  );
}
