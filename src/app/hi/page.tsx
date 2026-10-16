import type { Metadata } from 'next';
import Image from 'next/image';
import { dict } from '@/i18n';
import { alternates } from '@/lib/seo';

const t = dict('hi');

export const metadata: Metadata = {
  title: { absolute: `${t.brand.name} — ${t.common.comingSoon}` },
  description: t.brand.tagline,
  alternates: alternates('/', 'hi'),
};

/** The Hindi coming-soon page — finished on the new components in Phase 1 step 6. */
export default function HindiHome() {
  return (
    <main className="sun-glow flex min-h-dvh flex-col items-center justify-center px-4 py-10 text-center">
      <Image src="/brand/logo-full.svg" alt={t.brand.logoAlt} width={533} height={519} priority className="h-auto w-[86vw] max-w-[440px]" />
      <h1 className="text-h1 mt-8 text-maroon-600">{t.common.comingSoon}</h1>
      <p className="text-body-lg mx-auto mt-4 max-w-xl">{t.brand.tagline}</p>
    </main>
  );
}
