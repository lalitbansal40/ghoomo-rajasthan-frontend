import Image from 'next/image';
import Link from 'next/link';
import { ContactButtons } from '@/components/ContactButtons';
import { DuneDivider } from '@/components/motifs';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <Image src="/brand/logo-icon.svg" alt="" width={96} height={96} priority />
        <h1 className="mt-6 font-display text-3xl text-royal sm:text-4xl">Ye raasta nahi mila</h1>
        <p className="mt-3 text-muted">The page you were looking for is not here. Let us help you find your way.</p>
        <Link href="/" className="mt-6 font-semibold text-maroon underline underline-offset-4">
          Home par jaiye
        </Link>
        <div className="mt-8 w-full">
          <ContactButtons />
        </div>
      </div>
      <DuneDivider />
    </main>
  );
}
