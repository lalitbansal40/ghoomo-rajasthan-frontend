import { ThemeToggle } from '@/components/theme/ThemeToggle';
import Image from 'next/image';
import { dict, localePath, type Locale } from '@/i18n';
import { ContactButtons } from '@/components/ContactButtons';
import { DuneDivider } from '@/components/motifs';
import { Button } from '@/components/ui';

/** A page that is not there (notFound() inside a language) — in that language, a way home, and us. */
export function NotFoundView({ locale }: { locale: Locale }) {
  const t = dict(locale);
  return (
    <main className="flex min-h-dvh flex-col">
        <div className="flex justify-end px-4 pt-2"><ThemeToggle t={dict(locale).theme} /></div>
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <Image src="/brand/logo-icon.svg" alt="" width={96} height={96} preload />
        <h1 className="text-h1 mt-6 text-link">{t.common.notFoundTitle}</h1>
        <p className="mt-3 text-subtle">{t.common.notFoundBody}</p>
        <Button className="mt-6" variant="ghost" href={localePath('/', locale)} icon={null} iconRight="arrow">
          {t.common.goHome}
        </Button>
        <div className="mt-6 w-full">
          <ContactButtons locale={locale} />
        </div>
      </div>
      <DuneDivider />
    </main>
  );
}
