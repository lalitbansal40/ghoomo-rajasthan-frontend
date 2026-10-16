import Image from 'next/image';
import Link from 'next/link';
import { Footer } from './Footer';

/**
 * The plain page for reading — legal pages, credits. Ivory, a royal heading, text a comfortable
 * width (about 68 characters) at 17px, the logo back to home at the top.
 */
export function DocPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  /** "Last updated" — the legal pages carry it. */
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-gold/40 bg-ivory px-4 py-3">
        <Link href="/" className="inline-block" aria-label="Ghoomo Rajasthan — home">
          <Image src="/brand/logo-horizontal.svg" alt="Ghoomo Rajasthan" width={420} height={120} className="h-12 w-auto" />
        </Link>
      </header>
      <main className="mx-auto w-full max-w-[68ch] flex-1 px-4 py-10 text-[17px] leading-relaxed">
        <h1 className="font-display text-3xl text-royal sm:text-4xl">{title}</h1>
        {updated ? <p className="mt-2 text-sm text-muted">Last updated {updated}</p> : null}
        {intro ? <p className="mt-4 text-ink/80">{intro}</p> : null}
        <div className="doc mt-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

/** One section of a document page. */
export function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-xl font-bold text-royal">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
