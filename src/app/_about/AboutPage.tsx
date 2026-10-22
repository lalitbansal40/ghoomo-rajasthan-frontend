import { dict, localePath, type Locale } from '@/i18n';
import { ABOUT } from '@/content/about';
import { DRIVERS } from '@/content/facts';
import { LINKABLE_ROUTES } from '@/content/routes/list';
import { PLACES } from '@/content/places';
import { brand } from '@/lib/site';
import { Owner } from '@/components/Owner';
import { ContactButtons } from '@/components/ContactButtons';
import { FortSun, Jaali, SparkleDivider } from '@/components/motifs';
import { Breadcrumbs, Footer, Header, Icon, breadcrumbJsonLd } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { PageScene } from '@/components/scene/PageScene';

/** /about and /hi/about — who runs Ghoomo Rajasthan, the true numbers, how a trip works, the drivers. */
export function AboutPage({ locale }: { locale: Locale }) {
  const t = dict(locale);
  const a = ABOUT[locale];
  const path = localePath('/about', locale);
  const crumbs = [{ label: locale === 'hi' ? 'होम' : 'Home', href: localePath('/', locale) }, { label: a.title }];
  // Each number from its source — content/facts.ts, the route list, the place list.
  const numbers = [
    { value: DRIVERS, label: a.numbers.drivers },
    { value: String(LINKABLE_ROUTES.length), label: a.numbers.roads },
    { value: String(PLACES.length), label: a.numbers.places },
    { value: '24×7', label: a.numbers.always },
  ];

  return (
    <>
      <Header locale={locale} path={path} />
      <PageScene kind="dunes" />
      <main>
        <div className="mx-auto max-w-[var(--container-site)] px-4 pt-6 sm:px-6">
          <Breadcrumbs items={crumbs} locale={locale} />
          <div className="mt-6 grid items-center gap-8 md:grid-cols-[1fr_minmax(0,260px)]">
            <div className="max-w-3xl">
              <h1 className="text-h1 text-link">{a.title}</h1>
              <div className="mt-4 space-y-4">
                {a.intro.map((p) => (
                  <p key={p.slice(0, 24)} className="text-body-lg">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <FortSun className="mx-auto w-40 md:w-full" />
          </div>
        </div>

        {/* ── The numbers ──────────────────────────────────────────────── */}
        <section className="relative mt-12 overflow-hidden bg-primary py-10 text-white">
          <Jaali opacity={0.06} className="invert" />
          <ul className="relative mx-auto grid max-w-[var(--container-site)] grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4">
            {numbers.map((n) => (
              <li key={n.label} className="text-center">
                <span className="text-display block text-sun-400">{n.value}</span>
                <span className="mt-1 block text-white/90">{n.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mx-auto max-w-[var(--container-site)] px-4 pb-16 sm:px-6">
          {/* ── How a trip works ─────────────────────────────────────────── */}
          <section className="mt-12">
            <h2 className="text-h2 text-center text-link">{a.howTitle}</h2>
            <SparkleDivider className="mx-auto mt-3" />
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {a.how.map((s, i) => (
                <li key={s.title} className="rounded-[var(--radius-lg)] bg-surface p-5 shadow-card ring-1 ring-line/5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-500 font-semibold text-on-gold">{i + 1}</span>
                  <h3 className="text-h3 mt-3 text-heading">{s.title}</h3>
                  <p className="mt-1 text-content/80">{s.body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* ── Drivers, and who we are ──────────────────────────────────── */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <section className="rounded-[var(--radius-lg)] bg-soft p-6 ring-1 ring-edge/60">
              <h2 className="text-h3 flex items-center gap-2 text-heading">
                <Icon name="check" className="text-positive" /> {a.driversTitle}
              </h2>
              <p className="mt-2">{a.drivers}</p>
            </section>
            <section className="rounded-[var(--radius-lg)] bg-soft p-6 ring-1 ring-edge/60">
              <h2 className="text-h3 flex items-center gap-2 text-heading">
                <Icon name="mapPin" className="text-accent" /> {a.whoTitle}
              </h2>
              <p className="mt-2">
                <Owner locale={locale} />
              </p>
              <p className="mt-2">
                <a className="font-semibold text-link underline" href={brand.phoneHref}>
                  {brand.phone}
                </a>
              </p>
            </section>
          </div>

          <div className="mt-12">
            <ContactButtons locale={locale} />
          </div>
          <p className="mt-6 text-center text-small text-subtle">
            <a className="underline" href={localePath('/contact', locale)}>
              {t.nav.contact}
            </a>
          </p>
        </div>
      </main>
      <Footer locale={locale} />
      <JsonLd path="/about" locale={locale} data={[breadcrumbJsonLd(crumbs)]} />
    </>
  );
}
