'use client';
import { THEME_TEXT } from '@/i18n/theme';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

import type { Locale } from '@/i18n';
import { ERROR_COPY } from '@/i18n/error-copy';
import { DuneDivider } from '@/components/motifs/DuneDivider';
import { buttonClass } from '@/components/ui/button-style';

/** Something broke while rendering — in the page's language, with a retry (Next 16's `retry`). */
export function ErrorView({ locale, retry }: { locale: Locale; retry: () => void }) {
  const t = ERROR_COPY[locale];
  return (
    <main className="flex min-h-dvh flex-col">
        <div className="flex justify-end px-4 pt-2"><ThemeToggle t={THEME_TEXT[locale]} /></div>
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- Fixed-size SVG needs no image runtime in this eager error boundary. */}
        <img src="/brand/logo-icon.svg" alt="" width={96} height={96} />
        <h1 className="text-h1 mt-6 text-link">{t.title}</h1>
        <p className="mt-3 text-subtle">{t.body}</p>
        <button type="button" className={buttonClass({className: 'mt-6'})} onClick={retry}>
          <span className="whitespace-nowrap">{t.retry}</span>
        </button>
      </div>
      <DuneDivider />
    </main>
  );
}
