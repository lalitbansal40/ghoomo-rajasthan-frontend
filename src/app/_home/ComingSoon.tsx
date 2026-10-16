import { dict, type Locale } from '@/i18n';
import { ContactButtons } from '@/components/ContactButtons';
import { LogoFull } from '@/components/LogoFull';
import { DuneDivider } from '@/components/motifs';
import { Footer, LangSwitch } from '@/components/ui';

/**
 * The coming-soon page, in either language (Phase 0's page on Phase 1's parts): the logo, what
 * we will be, the cities, and the two ways to reach us today. No photograph; the logo is drawn
 * inline (components/LogoFull), so the first paint is the whole page.
 */
const CITIES = {
  en: 'Jaipur · Udaipur · Jodhpur · Jaisalmer · Pushkar · Ranthambore',
  hi: 'जयपुर · उदयपुर · जोधपुर · जैसलमेर · पुष्कर · रणथंभौर',
};
const ASK = {
  en: 'Planning a trip now? Talk to us directly.',
  hi: 'अभी यात्रा प्लान करनी है? हमसे सीधे बात करें।',
};

export function ComingSoon({ locale }: { locale: Locale }) {
  const t = dict(locale);
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex justify-end px-4 pt-4 sm:px-6">
        <LangSwitch path={locale === 'hi' ? '/hi' : '/'} />
      </div>
      <main className="sun-glow relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-6 pt-4 text-center">
        <LogoFull label={t.brand.logoAlt} className="w-[86vw] max-w-[440px]" />
        {/* The logo above already says the name; the heading says it for screen readers. */}
        <h1 className="text-h1 mt-8 text-maroon-600">
          <span className="sr-only">{t.brand.name} — </span>
          {t.common.comingSoon}
        </h1>
        <p className="text-body-lg mx-auto mt-4 max-w-xl text-ink/80">{t.brand.tagline}</p>
        <p className="mx-auto mt-1 max-w-xl text-muted">{CITIES[locale]}</p>
        <div className="mt-8 w-full max-w-xl">
          <p className="mb-3 font-semibold text-ink">{ASK[locale]}</p>
          <ContactButtons locale={locale} />
        </div>
      </main>
      <DuneDivider />
      <Footer locale={locale} variant="compact" />
    </div>
  );
}
