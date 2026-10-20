import Image from 'next/image';
import Link from 'next/link';
import { dict, localePath, type Locale } from '@/i18n';
import { NAV, exists } from '@/i18n/pages';
import { REGIONS } from '@/content/regions';
import { PLACES } from '@/content/places';
import { brand } from '@/lib/site';
import { AccountButton } from '@/components/account/AccountButton';
import { env } from '@/lib/env';
import { Icon } from './Icon';
import { LangSwitch } from './LangSwitch';
import { MobileMenu, type MenuItem } from './MobileMenu';

/**
 * The top of every page: the logo home, the menu (owner, 16 Oct 2026: Packages · Destinations ·
 * Cab · Desert Safari · Contact), sign-in, call, and EN | हिं. A menu page not built yet in
 * this language is shown as "Soon", never as a link to a 404 (i18n/pages.ts). Sticky; the
 * phone menu is the only client code.
 */
export function Header({ locale, path }: { locale: Locale; /** This page's path — for the language switch. */ path: string }) {
  const t = dict(locale);
  // The destinations menu opens onto its regions (only those with a place in them).
  const regions = REGIONS.filter((r) => PLACES.some((p) => p.region === r.key)).map((r) => ({
    label: r[locale].name,
    href: `${localePath('/destinations', locale)}?region=${r.key}`,
  }));
  const items: MenuItem[] = NAV.map((n) => ({
    label: t.nav[n.key],
    href: exists(n.path, locale) ? localePath(n.path, locale) : null,
    soon: t.nav.soon,
    ...(n.key === 'destinations' && exists(n.path, locale) ? { children: regions } : {}),
  }));
  if (env.travelEnabled) items.push({ label: locale === 'hi' ? 'यात्रा बुक करें' : 'Book travel', href: localePath('/tours', locale) });
  return (
    <header className="sticky top-0 z-40 border-b border-gold-300/70 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/80">
      <div className="relative mx-auto flex min-h-16 max-w-[var(--container-site)] flex-wrap items-center gap-3 px-4 sm:px-6">
        <Link href={localePath('/', locale)} aria-label={t.brand.home} className="shrink-0">
          <Image src="/brand/logo-horizontal.svg" alt={t.brand.logoAlt} width={420} height={120} preload className="h-11 w-auto" />
        </Link>
        <nav aria-label={t.nav.label} className="ml-4 hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {items.map((it) => (
              <li key={it.label} className={it.children?.length ? 'group relative' : undefined}>
                {it.href ? (
                  <Link href={it.href} className="rounded-full px-3 py-2 font-semibold text-royal-700 hover:bg-royal-50">
                    {it.label}
                  </Link>
                ) : null}
                {/* The regions: shown on hover, and on keyboard focus inside — no script. */}
                {it.href && it.children?.length ? (
                  <ul className="invisible absolute left-0 top-full z-50 w-64 rounded-[var(--radius-md)] bg-white p-2 opacity-0 shadow-raised ring-1 ring-black/5 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {it.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block rounded-[var(--radius-sm)] px-3 py-2 text-royal-700 hover:bg-royal-50">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {it.href ? null : (
                  <span aria-disabled className="cursor-default rounded-full px-3 py-2 font-semibold text-muted" title={it.soon}>
                    {it.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          {/* WhatsApp lives on the floating button (ContactFab); here, the account. */}
          <AccountButton locale={locale} travel={env.travelEnabled} />
          <a
            href={brand.phoneHref}
            aria-label={`${t.cta.call} ${brand.phone}`}
            className="grid h-11 w-11 place-items-center rounded-full border-2 border-royal-600 text-royal-600 hover:bg-royal-50"
          >
            <Icon name="phone" size={20} />
          </a>
          {/* A wrapper hides it on a phone: on the link itself `hidden` would fight its inline-flex. */}
          <span className="hidden sm:inline-flex">
            <LangSwitch path={path} />
          </span>
          <MobileMenu items={items} openLabel={t.nav.menu} closeLabel={t.nav.close} />
        </div>
      </div>
      {/* On a phone the language switch sits under the bar, where there is room for it. */}
      <div className="flex justify-end px-4 pb-2 sm:hidden">
        <LangSwitch path={path} />
      </div>
    </header>
  );
}
