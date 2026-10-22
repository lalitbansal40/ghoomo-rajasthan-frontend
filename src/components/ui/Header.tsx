import { ThemeToggle } from '@/components/theme/ThemeToggle';
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
import { motionAttr } from '@/lib/motion';

/**
 * The top of every page: the logo home, the menu (owner, 16 Oct 2026: Packages · Destinations ·
 * Cab · Desert Safari · Contact), sign-in, call, and EN | हिं. A menu page not built yet in
 * this language is shown as "Soon", never as a link to a 404 (i18n/pages.ts). Sticky; the
 * interactive controls stay small client components.
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
    // `data-motion` tells the page's CSS whether this page may move at all (src/lib/motion.ts):
    // off where somebody is booking, paying or signing in — the gold shine included.
    <header {...motionAttr(path)} className="sticky top-0 z-40 border-b border-edge/70 bg-page/95 backdrop-blur supports-[backdrop-filter]:bg-page/80">
      <div className="relative mx-auto flex min-h-16 max-w-[var(--container-site)] flex-wrap items-center gap-x-3 px-4 sm:gap-y-2 sm:px-6">
        <Link href={localePath('/', locale)} aria-label={t.brand.home} className="gr-brand shrink-0 max-sm:my-2.5">
          <Image src="/brand/logo-horizontal.svg" alt={t.brand.logoAlt} width={420} height={120} preload className="gr-brand h-11 w-auto max-[359px]:h-9" />
        </Link>
        <nav aria-label={t.nav.label} className="ml-4 hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {items.map((it) => (
              <li key={it.label} className={it.children?.length ? 'group relative' : undefined}>
                {it.href ? (
                  <Link href={it.href} className="rounded-full px-3 py-2 font-semibold text-heading hover:bg-tint">
                    {it.label}
                  </Link>
                ) : null}
                {/* The regions: shown on hover, and on keyboard focus inside — no script. */}
                {it.href && it.children?.length ? (
                  <ul className="invisible absolute left-0 top-full z-50 w-64 rounded-[var(--radius-md)] bg-surface p-2 opacity-0 shadow-raised ring-1 ring-line/5 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {it.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block rounded-[var(--radius-sm)] px-3 py-2 text-heading hover:bg-tint">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {it.href ? null : (
                  <span aria-disabled className="cursor-default rounded-full px-3 py-2 font-semibold text-subtle" title={it.soon}>
                    {it.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="relative order-3 flex h-12 w-full items-center justify-end gap-2 sm:order-none sm:ml-auto sm:w-auto">
          <ThemeToggle key={path} t={t.theme} headerRow />
          <span className="sm:hidden"><LangSwitch path={path} /></span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
          {/* WhatsApp lives on the floating button (ContactFab); here, the account. */}
          <AccountButton locale={locale} travel={env.travelEnabled} t={{ login: t.account.login, menu: t.account.menu, myBookings: t.account.myBookings, tripRequests: t.account.tripRequests, logout: t.account.logout }} />
          <a
            href={brand.phoneHref}
            aria-label={`${t.cta.call} ${brand.phone}`}
            className="grid h-11 w-11 place-items-center rounded-full border-2 border-link text-link hover:bg-tint"
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

    </header>
  );
}
