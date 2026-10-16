'use client';

import Image from 'next/image';
import { ContactButtons } from '@/components/ContactButtons';
import { Dunes } from '@/components/Dunes';

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <Image src="/brand/logo-icon.svg" alt="" width={96} height={96} />
        <h1 className="mt-6 font-display text-3xl text-royal sm:text-4xl">Kuch gadbad ho gayi</h1>
        <p className="mt-3 text-muted">Something went wrong on our side. Please try again.</p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-6 font-semibold text-maroon underline underline-offset-4"
        >
          Dobara try karein
        </button>
        <div className="mt-8 w-full">
          <ContactButtons />
        </div>
      </div>
      <Dunes />
    </main>
  );
}
