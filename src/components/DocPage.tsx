import type { Locale } from '@/i18n';
import { Footer } from './ui/Footer';
import { Header } from './ui/Header';

/**
 * The plain page for reading — legal pages, credits. The site header and footer, a Rozha One
 * title, text a comfortable width (about 68 characters) at the body size.
 */
export function DocPage({
  title,
  intro,
  updated,
  path,
  locale = 'en',
  children,
}: {
  title: string;
  intro?: string;
  /** "Last updated" — the legal pages carry it. */
  updated?: string;
  /** This page's path — for the header's language switch. */
  path: string;
  locale?: Locale;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header locale={locale} path={path} />
      <main className="mx-auto w-full max-w-[68ch] flex-1 px-4 py-10">
        <h1 className="text-h1 text-royal-600">{title}</h1>
        {updated ? (
          <p className="mt-2 text-sm text-muted">
            {locale === 'hi' ? 'आख़िरी बदलाव' : 'Last updated'} {updated}
          </p>
        ) : null}
        {intro ? <p className="mt-4 text-ink/80">{intro}</p> : null}
        <div className="doc mt-8">{children}</div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}

/** One section of a document page. */
export function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-h3 text-royal-700">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
