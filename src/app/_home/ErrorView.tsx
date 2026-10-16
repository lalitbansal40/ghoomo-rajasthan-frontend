'use client';

import Image from 'next/image';
import { dict, type Locale } from '@/i18n';
import { DuneDivider } from '@/components/motifs';
import { Button } from '@/components/ui/Button';

/** Something broke while rendering — in the page's language, with a retry (Next 16's `retry`). */
export function ErrorView({ locale, retry }: { locale: Locale; retry: () => void }) {
  const t = dict(locale);
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <Image src="/brand/logo-icon.svg" alt="" width={96} height={96} />
        <h1 className="text-h1 mt-6 text-royal-600">{t.common.errorTitle}</h1>
        <p className="mt-3 text-muted">{t.common.errorBody}</p>
        <Button className="mt-6" variant="primary" icon={null} onClick={() => retry()}>
          {t.state.retry}
        </Button>
      </div>
      <DuneDivider />
    </main>
  );
}
