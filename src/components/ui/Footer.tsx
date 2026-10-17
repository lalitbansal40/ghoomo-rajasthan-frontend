import Link from 'next/link';
import { dict, localePath, type Locale } from '@/i18n';
import { NAV, exists } from '@/i18n/pages';
import { brand, whatsappLink } from '@/lib/site';
import { DuneDivider, FortSun } from '@/components/motifs';
import { REGIONS } from '@/content/regions';
import { PLACES } from '@/content/places';
import { routeBySlug } from '@/content/routes/list';
import { routeEndName } from '@/content/cities';

/** The roads the footer lists — the most asked-for, all in Rajasthan, none held. */
const FOOTER_ROUTES = [
  'jaipur-to-udaipur',
  'jaipur-to-jodhpur',
  'jaipur-to-jaisalmer',
  'jaipur-to-ajmer',
  'delhi-to-jaipur',
  'udaipur-to-jodhpur',
  'jodhpur-to-jaisalmer',
  'jaipur-to-ranthambore',
];

/**
 * The foot of every page. `full`: the fort against the sun on a band of dunes, then explore,
 * destinations by region, popular cab routes, how to reach us and legal — one under another on
 * a phone. `compact`: the coming-soon page's thin strip. Links only to pages that exist in this language.
 */
export function Footer({ locale, variant = 'full' }: { locale: Locale; variant?: 'full' | 'compact' }) {
  const t = dict(locale);
  const link = (path: string, label: string) => {
    const href = exists(path, locale) ? localePath(path, locale) : exists(path, 'en') ? path : null;
    return href ? (
      <Link href={href} className="underline-offset-4 hover:underline">
        {label}
      </Link>
    ) : null;
  };
  const legal = [
    ['/contact', t.nav.contact],
    ['/privacy', t.common.privacy],
    ['/terms', t.common.terms],
    ['/refund', t.common.refund],
    ['/photo-credits', t.common.credits],
  ] as const;

  if (variant === 'compact') {
    return (
      <footer className="bg-sand-200 px-4 pb-8 pt-2 text-center text-small text-ink">
        <p>
          {t.brand.aHelloMyCabCompany} · {locale === 'hi' ? 'जयपुर' : brand.city}
        </p>
        <nav aria-label={t.common.legal} className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {legal.map(([p, l]) => (
            <span key={p}>{link(p, l)}</span>
          ))}
        </nav>
      </footer>
    );
  }

  return (
    <footer className="mt-16">
      <div className="relative">
        <FortSun tone="silhouette" className="mx-auto -mb-6 w-56 text-maroon-700 sm:w-72" />
        <DuneDivider />
      </div>
      <div className="bg-sand-200 px-4 pb-10 sm:px-6">
        <div className="mx-auto grid max-w-[var(--container-site)] gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h2 className="text-h3 text-royal-700">{t.common.explore}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {NAV.map((n) => (
                <li key={n.key}>{exists(n.path, locale) ? link(n.path, t.nav[n.key]) : <span className="text-muted">{t.nav[n.key]} · {t.nav.soon}</span>}</li>
              ))}
              {exists('/about', locale) ? <li>{link('/about', t.nav.about)}</li> : null}
            </ul>
          </div>
          {exists('/destinations', locale) ? (
            <div>
              <h2 className="text-h3 text-royal-700">{t.nav.destinations}</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {REGIONS.filter((r) => PLACES.some((p) => p.region === r.key)).map((r) => (
                  <li key={r.key}>
                    <Link href={`${localePath('/destinations', locale)}?region=${r.key}`} className="underline-offset-4 hover:underline">
                      {r[locale].name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {exists('/cab/x', locale) ? (
            <div>
              <h2 className="text-h3 text-royal-700">{t.common.popularRoutes}</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {FOOTER_ROUTES.map(routeBySlug)
                  .filter((r) => r && !r.held)
                  .map((r) => (
                    <li key={r!.slug}>
                      <Link href={localePath(`/cab/${r!.slug}`, locale)} className="underline-offset-4 hover:underline">
                        {routeEndName(r!.pickup, locale)} → {routeEndName(r!.drop, locale)}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}
          <div>
            <h2 className="text-h3 text-royal-700">{t.common.talkToUs}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <a className="font-semibold text-royal-700 underline-offset-4 hover:underline" href={brand.phoneHref}>
                  {brand.phone}
                </a>
              </li>
              <li>
                <a
                  className="underline-offset-4 hover:underline"
                  href={whatsappLink(t.cta.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.cta.whatsapp}
                </a>
              </li>
              {brand.email ? (
                <li>
                  <a className="underline-offset-4 hover:underline" href={`mailto:${brand.email}`}>
                    {brand.email}
                  </a>
                </li>
              ) : null}
              <li className="text-small text-ink/80">{brand.address}</li>
            </ul>
          </div>
          <div>
            <h2 className="text-h3 text-royal-700">{t.common.legal}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {legal.map(([p, l]) => {
                const a = link(p, l);
                return a ? <li key={p}>{a}</li> : null;
              })}
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-[var(--container-site)] border-t border-gold-500/50 pt-4 text-small text-ink/80">
          © {new Date().getFullYear()} {t.brand.name} · {t.brand.aHelloMyCabCompany}
        </p>
      </div>
    </footer>
  );
}
