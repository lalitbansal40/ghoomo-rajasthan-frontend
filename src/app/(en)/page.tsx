import type { Metadata } from 'next';
import Image from 'next/image';
import { ContactButtons } from '@/components/ContactButtons';
import { Dunes } from '@/components/Dunes';
import { Footer } from '@/components/Footer';
import { alternates } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: 'Ghoomo Rajasthan — coming soon' },
  description: 'Tours across Rajasthan with a car and a driver who knows the road. Coming soon.',
  alternates: alternates('/', 'en'),
};

/**
 * The coming-soon page (Phase 0): the logo, what we will be, and the two ways to reach us
 * today. No photograph — the logo is the largest thing on the screen and it is a 20 kB SVG,
 * so the first paint is the whole page.
 */
export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-6 pt-10 text-center"
        style={{
          // The sun behind the logo: a soft glow, not a picture.
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(255,210,122,.55) 0, rgba(245,166,35,.12) 34%, rgba(251,247,239,0) 60%)',
        }}
      >
        <Image
          src="/brand/logo-full.svg"
          alt="Ghoomo Rajasthan"
          width={533}
          height={519}
          priority
          className="h-auto w-[86vw] max-w-[440px]"
        />
        {/* The logo above already says the name; the heading says it for screen readers. */}
        <h1 className="mt-8 font-display text-3xl text-maroon sm:text-5xl">
          <span className="sr-only">Ghoomo Rajasthan — </span>Jald aa raha hai
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink/80">
          Tours across Rajasthan with a car and a driver who knows the road.
        </p>
        <p className="mx-auto mt-1 max-w-xl text-muted">
          Jaipur · Udaipur · Jodhpur · Jaisalmer · Pushkar · Ranthambore
        </p>
        <div className="mt-8 w-full max-w-xl">
          <p className="mb-3 font-semibold text-ink">Abhi trip plan karni hai? Hum se seedhe baat karo.</p>
          <ContactButtons />
        </div>
      </main>
      <Dunes />
      <Footer />
    </div>
  );
}
