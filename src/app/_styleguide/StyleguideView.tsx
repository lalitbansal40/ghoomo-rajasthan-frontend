import Image from 'next/image';
import { PageScene } from '@/components/scene/PageScene';
import tokens from '@/design/tokens.json';
import { dict, formatRupees, type Locale } from '@/i18n';
import { EXCLUDES, INCLUDES, PACKAGES, PACKAGES_ARE_SAMPLE, pkgIn } from '@/content/packages';
import { photo } from '@/content/photos';
import { brand, whatsappLink } from '@/lib/site';
import { Camel, Car, DuneDivider, FortSun, Jaali, MehrabFrame, SparkleDivider } from '@/components/motifs';
import {
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  DateInput,
  DestinationCard,
  EmptyState,
  FAQ,
  Field,
  Footer,
  Header,
  IncludesList,
  ItineraryTimeline,
  Loader,
  PackageCard,
  PhoneInput,
  PhotoCredit,
  PriceTag,
  RouteCard,
  SectionHeader,
  Select,
  Stars,
  StickyCta,
  TextInput,
  Textarea,
  indiaToday,
} from '@/components/ui';
import { DemoChips, DemoStepper, DemoToast, MotionToggle } from './demos';

/**
 * The style guide (Phase 1): every token, motif and component, in the page's language — for the
 * team and the owner to say yes to before Phase 2. Never indexed, never linked. Anything that
 * looks like data here is marked Sample.
 */
const L = {
  en: {
    title: 'Ghoomo Rajasthan — style guide',
    intro: 'Every colour, size, motif and part the site is built from. For the team — hidden from search.',
    nav: ['Logo', 'Colours', 'Type', 'Shape', 'Motifs', 'Parts', 'Sample page'],
    logoNote: 'Lettering: Rozha One — the closest to the logo (chosen 16 Oct 2026).',
    colours: 'Colours — each with its contrast on ivory and on white',
    type: 'Type — English and Hindi side by side',
    shape: 'Corners, shadows and motion',
    motifs: 'Motifs',
    motionOff: 'Animation off',
    motionOn: 'Animation on',
    parts: 'Parts — every state',
    buttons: 'Buttons',
    badges: 'Badges, chips, price',
    cards: 'Cards',
    timeline: 'Day by day',
    faq: 'Questions',
    forms: 'Form',
    states: 'Loading, empty, messages',
    sample: 'Sample page',
    sampleQs: [
      { q: 'Sample — Can we change the route?', a: 'Sample answer. Yes — tell us when you book and the price is updated before the trip.' },
      { q: 'Sample — Is the driver with us every day?', a: 'Sample answer. One car and one driver for the whole tour.' },
      { q: 'Sample — Are hotels included?', a: 'Sample answer. Not in the tour price; we can suggest some.' },
    ],
    toastBtn: 'Show a toast',
    toastMsg: 'Sample — Added to your trip',
    heroTitle: 'Rajasthan, the way it should be seen',
    heroLine: 'Forts, lakes and dunes — with a car and a driver who knows the road.',
    hover: 'Hover me',
    loadingLine: 'Your booking is on its way…',
    emptyTitle: 'No tours here yet',
    emptyBody: 'Tell us where you want to go and we will plan it.',
    success: 'Booking confirmed — Sample',
    warning: 'Prices are samples until the real tours are in.',
    error: 'That number does not look right — Sample',
    info: 'Hotels are not included in the tour price.',
    starsLabel: 'Sample rating',
    car: 'Car',
  },
  hi: {
    title: 'घूमो राजस्थान — स्टाइल गाइड',
    intro: 'साइट जिन रंगों, साइज़, मोटिफ़ और हिस्सों से बनती है — सब एक जगह। टीम के लिए — सर्च में नहीं।',
    nav: ['लोगो', 'रंग', 'अक्षर', 'आकार', 'मोटिफ़', 'हिस्से', 'नमूना पेज'],
    logoNote: 'अक्षर: Rozha One — लोगो से सबसे मिलता हुआ (16 अक्टूबर 2026 को चुना)।',
    colours: 'रंग — हर एक का कंट्रास्ट, आइवरी और सफ़ेद पर',
    type: 'अक्षर — अंग्रेज़ी और हिंदी साथ-साथ',
    shape: 'कोने, परछाईं और हलचल',
    motifs: 'मोटिफ़',
    motionOff: 'एनिमेशन बंद',
    motionOn: 'एनिमेशन चालू',
    parts: 'हिस्से — हर हालत में',
    buttons: 'बटन',
    badges: 'बैज, चिप, दाम',
    cards: 'कार्ड',
    timeline: 'दिन-ब-दिन',
    faq: 'सवाल',
    forms: 'फ़ॉर्म',
    states: 'लोडिंग, खाली, संदेश',
    sample: 'नमूना पेज',
    sampleQs: [
      { q: 'नमूना — क्या रास्ता बदल सकते हैं?', a: 'नमूना जवाब। हाँ — बुकिंग के समय बताइए, दाम यात्रा से पहले बता देंगे।' },
      { q: 'नमूना — क्या ड्राइवर हर दिन साथ रहेगा?', a: 'नमूना जवाब। पूरे टूर में एक गाड़ी और एक ड्राइवर।' },
      { q: 'नमूना — क्या होटल शामिल है?', a: 'नमूना जवाब। टूर के दाम में नहीं; हम कुछ होटल सुझा सकते हैं।' },
    ],
    toastBtn: 'टोस्ट दिखाएँ',
    toastMsg: 'नमूना — आपकी यात्रा में जुड़ गया',
    heroTitle: 'राजस्थान, जैसा देखना चाहिए',
    heroLine: 'क़िले, झीलें और रेत के टीले — गाड़ी और ऐसे ड्राइवर के साथ जो रास्ता जानता है।',
    hover: 'माउस लाइए',
    loadingLine: 'आपकी बुकिंग बन रही है…',
    emptyTitle: 'अभी यहाँ कोई टूर नहीं',
    emptyBody: 'बताइए कहाँ जाना है — हम प्लान कर देंगे।',
    success: 'बुकिंग पक्की — नमूना',
    warning: 'असली टूर आने तक दाम नमूना हैं।',
    error: 'यह नंबर सही नहीं लगता — नमूना',
    info: 'टूर के दाम में होटल शामिल नहीं है।',
    starsLabel: 'नमूना रेटिंग',
    car: 'गाड़ी',
  },
} as const;

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const f = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return ((x + 0.05) / (y + 0.05)).toFixed(1);
};
/** White or ink on a swatch — whichever reads better. */
const labelOn = (hex: string) => (Number(ratio('#FFFFFF', hex)) >= Number(ratio('#1B1B1F', hex)) ? '#FFFFFF' : '#1B1B1F');

const TYPE_SAMPLE = {
  en: 'Jaisalmer at sunset',
  hi: 'सूर्यास्त में जैसलमेर',
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-edge py-12">
      <h2 className="text-h2 text-link">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function StyleguideView({ locale, now }: { locale: Locale; now: number }) {
  const s = L[locale];
  const t = dict(locale);
  const ids = ['logo', 'colours', 'type', 'shape', 'motifs', 'parts', 'sample'];
  const royal = PACKAGES.find((p) => p.slug === 'royal-rajasthan-circuit') ?? PACKAGES[0];
  const jp = photo('jaisalmer-fort');

  return (
    <>
      <Header locale={locale} path={locale === 'hi' ? '/hi/styleguide' : '/styleguide'} />
      <nav
        aria-label="Style guide"
        className="sticky top-16 z-30 -mb-px overflow-x-auto border-b border-edge bg-soft/95 backdrop-blur max-sm:top-[6.5rem]"
      >
        <ul className="mx-auto flex max-w-[var(--container-site)] gap-1 px-4 py-2 sm:px-6">
          {s.nav.map((n, i) => (
            <li key={n}>
              <a href={`#${ids[i]}`} className="block whitespace-nowrap rounded-full px-3 py-1.5 text-small font-semibold text-heading hover:bg-tint">
                {n}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <main className="mx-auto max-w-[var(--container-site)] px-4 pb-24 sm:px-6">
        <div className="py-10">
          <h1 className="text-h1 text-link">{s.title}</h1>
          <p className="text-body-lg mt-3 max-w-2xl text-content/80">{s.intro}</p>
        </div>

        <Section id="logo" title={s.nav[0]}>
          <p className="text-subtle">{s.logoNote}</p>
          <div className="mt-6 grid gap-6 md:grid-cols-[2fr_1fr]">
            <div className="rounded-[var(--radius-lg)] bg-surface p-6 shadow-card">
              <Image src="/brand/logo-full.svg" alt={t.brand.logoAlt} width={533} height={519} className="gr-brand mx-auto h-auto w-full max-w-sm" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-[var(--radius-md)] bg-surface p-4 shadow-card">
                <Image src="/brand/logo-horizontal.svg" alt="" width={420} height={120} className="gr-brand h-14 w-auto" />
              </div>
              <div className="flex flex-wrap items-end gap-4 rounded-[var(--radius-md)] bg-surface p-4 shadow-card">
                {[16, 32, 64, 96].map((z) => (
                  <Image key={z} src="/brand/logo-icon.svg" alt="" width={z} height={z} unoptimized />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[var(--radius-md)] bg-primary p-4">
                  <Image src="/brand/logo-white.svg" alt="" width={200} height={190} className="h-auto w-full" unoptimized />
                </div>
                <div className="rounded-[var(--radius-md)] bg-surface p-4 shadow-card">
                  <Image src="/brand/logo-mono.svg" alt="" width={200} height={190} className="gr-brand h-auto w-full" unoptimized />
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="colours" title={s.colours}>
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            {(['light', 'dark'] as const).map(mode => <section key={mode} data-theme={mode} className="overflow-hidden rounded-xl border border-edge bg-page text-content">
              <PageScene kind="dunes" />
              <div className="space-y-3 p-4">
                <h3 className="text-h3 text-heading">{t.theme[mode]}</h3>
                <p className="text-subtle">{t.theme.helper}</p>
                <Button href={locale === 'hi' ? '/hi/packages' : '/packages'}>{t.nav.packages}</Button>
              </div>
            </section>)}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {Object.entries(tokens.color).map(([name, hex]) => (
              <div key={name} className="overflow-hidden rounded-[var(--radius-sm)] bg-surface ring-1 ring-line/10">
                <div className="flex h-16 items-end p-2 text-small font-semibold" style={{ background: hex, color: labelOn(hex) }}>
                  {name}
                </div>
                <p className="p-2 text-[0.75rem] leading-5 text-subtle">
                  <code>{hex}</code>
                  <br />
                  ivory {ratio(hex, '#FBF7EF')} · white {ratio(hex, '#FFFFFF')}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="type" title={s.type}>
          <div className="flex flex-col divide-y divide-edge">
            {Object.entries(tokens.type).map(([name, v]) => (
              <div key={name} className="grid gap-2 py-4 md:grid-cols-[8rem_1fr_1fr] md:items-baseline">
                <code className="text-small text-subtle">
                  {name}
                  <br />
                  {v.family === 'display' ? 'Rozha One' : `Mukta ${v.weight}`}
                </code>
                <p lang="en" className={`text-${name} text-content`}>
                  {TYPE_SAMPLE.en} {name === 'price' ? formatRupees(27999) : ''}
                </p>
                <p lang="hi" className={`text-${name} text-content`}>
                  {TYPE_SAMPLE.hi} {name === 'price' ? formatRupees(27999) : ''}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="shape" title={s.shape}>
          <div className="grid gap-4 sm:grid-cols-4">
            {Object.entries(tokens.radius).map(([k, v]) => (
              <div key={k} className="grid h-24 place-items-center bg-sand-soft text-small font-semibold ring-1 ring-edge" style={{ borderRadius: v }}>
                radius-{k} · {v}
              </div>
            ))}
            <div className="grid h-24 place-items-center rounded-[var(--radius-md)] bg-surface text-small font-semibold shadow-card">shadow-card</div>
            <div className="grid h-24 place-items-center rounded-[var(--radius-md)] bg-surface text-small font-semibold shadow-raised">shadow-raised</div>
            <div className="grid h-24 place-items-center rounded-[var(--radius-md)] bg-surface text-small font-semibold shadow-card transition-[transform,box-shadow] duration-[var(--dur)] ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-raised">
              {s.hover} · 250ms
            </div>
          </div>
        </Section>

        <Section id="motifs" title={s.motifs}>
          <MotionToggle on={s.motionOn} off={s.motionOff}>
            <div className="grid gap-6 md:grid-cols-3">
              {jp ? (
                <div className="relative mx-auto w-48">
                  <MehrabFrame src={jp.card} alt={jp.alt} />
                </div>
              ) : null}
              <div className="flex flex-col items-center justify-center gap-4">
                <Camel walking size={110} />
                <Car moving size={240} />
              </div>
              <div className="flex flex-col items-center gap-4">
                <FortSun className="w-52" />
                <div className="w-full rounded-[var(--radius-md)] bg-alternate p-3">
                  <FortSun tone="silhouette" className="mx-auto w-40 text-accent-strong" />
                </div>
              </div>
            </div>
            <SparkleDivider className="mx-auto mt-8" />
            <div className="relative mt-6 h-32 overflow-hidden rounded-[var(--radius-md)] bg-sand-soft">
              <Jaali />
            </div>
            <div className="mt-6 space-y-2">
              <DuneDivider />
              <DuneDivider tone="gold" flip />
              <DuneDivider tone="ivory" />
            </div>
          </MotionToggle>
        </Section>

        <Section id="parts" title={s.parts}>
          <h3 className="text-h3 text-heading">{s.buttons}</h3>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button href="#parts">{t.cta.bookNow}</Button>
            <Button variant="secondary" href="#parts">
              {t.cta.viewPackage}
            </Button>
            <Button variant="ghost" href="#parts" iconRight="arrow">
              {t.cta.view}
            </Button>
            <Button variant="whatsapp" href={whatsappLink(t.cta.whatsappMessage)}>
              {t.cta.whatsapp}
            </Button>
            <Button variant="call" href={brand.phoneHref}>
              {t.cta.call}
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button size="sm">{t.cta.view}</Button>
            <Button size="lg">{t.cta.planTrip}</Button>
            <Button disabled>{t.cta.payNow}</Button>
            <Button loading>{t.cta.payNow}</Button>
          </div>

          <h3 className="text-h3 mt-10 text-heading">{s.badges}</h3>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="sample">{t.pkg.sample}</Badge>
            <Badge tone="popular">{t.pkg.popular}</Badge>
            <Badge tone="new">{t.pkg.new}</Badge>
            <Badge tone="days">{t.pkg.daysNightsShort(7, 6)}</Badge>
            <Stars value={4.5} label={`${s.starsLabel}: ${t.common.rating(4.5)}`} />
            <span className="text-small text-subtle">({s.starsLabel})</span>
          </div>
          <div className="mt-4">
            <DemoChips labels={['Dzire', 'Ertiga', 'Innova Crysta']} />
          </div>
          <div className="mt-4">
            <PriceTag rupees={27999} vehicle="Dzire" locale={locale} />
          </div>

          <h3 className="text-h3 mt-10 text-heading">{s.cards}</h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PACKAGES.slice(0, 3).map((p, i) => (
              <PackageCard key={p.slug} tour={pkgIn(p, locale)} href="#parts" locale={locale} preload={i === 0} />
            ))}
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <DestinationCard name={locale === 'hi' ? 'जैसलमेर' : 'Jaisalmer'} line={locale === 'hi' ? 'सोने का क़िला, रेत के टीले' : 'The golden fort and the dunes'} photoKey="jaisalmer-dunes" tours={2} href="#parts" locale={locale} />
            <DestinationCard name={locale === 'hi' ? 'उदयपुर' : 'Udaipur'} line={locale === 'hi' ? 'झीलें और महल' : 'Lakes and palaces'} photoKey="udaipur-pichola" tours={3} href="#parts" locale={locale} />
            <div className="flex flex-col gap-3 sm:col-span-2">
              <RouteCard from={locale === 'hi' ? 'जयपुर' : 'Jaipur'} to={locale === 'hi' ? 'उदयपुर' : 'Udaipur'} km={395} fromRupees={5600} href="#parts" locale={locale} sample />
              <RouteCard from={locale === 'hi' ? 'जोधपुर' : 'Jodhpur'} to={locale === 'hi' ? 'जैसलमेर' : 'Jaisalmer'} km={285} fromRupees={4200} href="#parts" locale={locale} sample />
            </div>
          </div>

          <h3 className="text-h3 mt-10 text-heading">{s.timeline}</h3>
          <div className="mt-4 grid gap-8 lg:grid-cols-2">
            <ItineraryTimeline days={royal.itinerary.slice(0, 3)} locale={locale} />
            <IncludesList includes={INCLUDES} excludes={EXCLUDES} locale={locale} />
          </div>

          <h3 className="text-h3 mt-10 text-heading">{s.faq}</h3>
          <div className="mt-4 max-w-2xl">
            <FAQ items={[...s.sampleQs]} />
          </div>
          <div className="mt-6">
            <Breadcrumbs
              locale={locale}
              items={[
                { label: locale === 'hi' ? 'होम' : 'Home', href: '#' },
                { label: t.nav.packages, href: '#' },
                { label: royal.name },
              ]}
            />
          </div>

          <h3 className="text-h3 mt-10 text-heading">{s.forms}</h3>
          <div className="mt-4 grid max-w-3xl gap-5 sm:grid-cols-2">
            <Field id="sg-name" label={t.form.name} required requiredLabel={t.form.required}>
              <TextInput id="sg-name" autoComplete="name" />
            </Field>
            <Field id="sg-phone" label={t.form.phone} required requiredLabel={t.form.required} help={t.form.phoneHelp}>
              <PhoneInput id="sg-phone" help={t.form.phoneHelp} />
            </Field>
            <Field id="sg-phone-bad" label={t.form.phone} required requiredLabel={t.form.required} error={t.form.errPhone}>
              <PhoneInput id="sg-phone-bad" error={t.form.errPhone} defaultValue="98765" />
            </Field>
            <Field id="sg-date" label={t.form.date} requiredLabel={t.form.required}>
              <DateInput id="sg-date" min={indiaToday(now)} />
            </Field>
            <Field id="sg-car" label={s.car} requiredLabel={t.form.required}>
              <Select
                id="sg-car"
                defaultValue=""
                placeholder={t.form.select}
                options={[
                  { value: 'dzire', label: 'Dzire' },
                  { value: 'ertiga', label: 'Ertiga' },
                  { value: 'crysta', label: 'Innova Crysta' },
                ]}
              />
            </Field>
            <DemoStepper label={t.form.people} decrease={t.form.decrease} increase={t.form.increase} />
            <Field id="sg-msg" label={t.form.message} requiredLabel={t.form.required} className="sm:col-span-2">
              <Textarea id="sg-msg" />
            </Field>
          </div>

          <h3 className="text-h3 mt-10 text-heading">{s.states}</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <Loader label={s.loadingLine} />
            <EmptyState title={s.emptyTitle} body={s.emptyBody} action={<Button variant="whatsapp" href={whatsappLink(t.cta.whatsappMessage)}>{t.cta.whatsapp}</Button>} />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Alert tone="success">{s.success}</Alert>
            <Alert tone="warning">{s.warning}</Alert>
            <Alert tone="error">{s.error}</Alert>
            <Alert tone="info">{s.info}</Alert>
          </div>
          <div className="mt-4">
            <DemoToast button={s.toastBtn} message={s.toastMsg} close={t.state.dismiss} />
          </div>
        </Section>

        <Section id="sample" title={s.sample}>
          <div className="overflow-hidden rounded-[var(--radius-lg)] ring-1 ring-edge">
            <div className="sun-glow relative grid items-center gap-6 bg-page px-6 py-12 md:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="text-small font-semibold uppercase tracking-[0.12em] text-gold-text">{t.brand.name}</p>
                <h2 className="text-display mt-2 text-link">{s.heroTitle}</h2>
                <p className="text-body-lg mt-4 text-content/80">{s.heroLine}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button size="lg" href="#sample">{t.cta.planTrip}</Button>
                  <Button size="lg" variant="whatsapp" href={whatsappLink(t.cta.whatsappMessage)}>
                    {t.cta.whatsapp}
                  </Button>
                </div>
              </div>
              <FortSun className="mx-auto w-full max-w-sm" />
            </div>
            <DuneDivider tone="ivory" flip />
            <div className="bg-page px-6 pb-12">
              <SectionHeader eyebrow={t.nav.packages} title={locale === 'hi' ? 'लोकप्रिय टूर' : 'Popular tours'} intro={PACKAGES_ARE_SAMPLE ? `${t.pkg.sample} — ${s.warning}` : undefined} />
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {PACKAGES.slice(3, 6).map((p) => (
                  <PackageCard key={p.slug} tour={pkgIn(p, locale)} href="#sample" locale={locale} />
                ))}
              </div>
              <div className="mt-12 grid items-start gap-8 md:grid-cols-[1fr_1.4fr]">
                <div className="relative mx-auto w-56">
                  {jp ? (
                    <>
                      <MehrabFrame src={jp.card} alt={jp.alt} />
                      <PhotoCredit photo={jp} label={t.common.photoBy} />
                    </>
                  ) : null}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="days">{t.pkg.daysNightsShort(royal.days, royal.nights)}</Badge>
                    <Badge tone="popular">{t.pkg.popular}</Badge>
                  </div>
                  <h3 className="text-h1 mt-3 text-link">{royal.name}</h3>
                  <PriceTag className="mt-3" rupees={Math.min(...royal.fromRupees.map((f) => f.rupees))} vehicle="Dzire" locale={locale} />
                  <div className="mt-6">
                    <ItineraryTimeline days={royal.itinerary.slice(0, 2)} locale={locale} />
                  </div>
                </div>
              </div>
            </div>
            <Footer locale={locale} />
          </div>
        </Section>
      </main>
      <StickyCta>
        <Button variant="whatsapp" href={whatsappLink(t.cta.whatsappMessage)}>
          {t.cta.whatsapp}
        </Button>
        <Button variant="call" href={brand.phoneHref}>
          {t.cta.call}
        </Button>
      </StickyCta>
    </>
  );
}
