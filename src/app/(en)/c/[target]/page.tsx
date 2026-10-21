import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DialNow } from '@/components/DialNow';
import { Footer, Header } from '@/components/ui';
import { brand } from '@/lib/site';
import { callTarget, type CallWho } from '@/lib/whatsapp-links';

/**
 * /c/<who>-<mobile> — what a Ghoomo Rajasthan WhatsApp "Call karein" button opens (owner,
 * 21 Oct 2026). The button's URL is fixed at approval (`/c/{{1}}`), so who is being rung
 * travels in that one value:
 *
 *   customer-98…    the desk ringing a customer (its lead, booking and cancellation alerts)
 *   yourdriver-98…  a customer ringing the driver of their booking
 *   office-96…      a customer ringing us, before a driver is set
 *
 * One language: the button's URL is the English one. Never indexed, never cached, and the
 * number never leaves in a Referer.
 */
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Call', robots: { index: false, follow: false }, referrer: 'no-referrer' };

const WORDS: Record<CallWho | 'none', { heading: string; label: string }> = {
  customer: { heading: 'Calling the customer', label: 'Customer’s number' },
  driver: { heading: 'Calling the driver', label: 'Driver’s number' },
  yourdriver: { heading: 'Calling your driver', label: 'Driver’s number' },
  office: { heading: `Calling ${brand.name}`, label: 'Our number' },
  none: { heading: 'Calling', label: 'Number' },
};

export default async function CallPage({ params }: { params: Promise<{ target: string }> }) {
  const target = callTarget((await params).target);
  if (!target) redirect('/');
  const words = WORDS[target.who ?? 'none'];
  const href = `tel:+91${target.ten}`;
  const pretty = `${target.ten.slice(0, 5)} ${target.ten.slice(5)}`;

  return (
    <div className="flex min-h-dvh flex-col">
      <Header locale="en" path="/" />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:py-14">
        {/* Fires on arrival; the link below carries the page when it does not. */}
        <DialNow href={href} />
        <h1 className="text-h1 text-royal-600">{words.heading}</h1>
        <p className="mt-3 text-ink/80">Your phone should be opening the dialer. If it does not, tap the number.</p>
        <a href={href} className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-royal-600 px-7 text-lg font-semibold text-white">
          Call +91 {pretty}
        </a>
        {/* Spelt out too, to read back or copy on a device that will not dial. */}
        <p className="mt-6 text-sm text-ink/70">{words.label}: +91 {pretty}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          {/* A customer whose driver does not answer rings the office. */}
          {target.who === 'yourdriver' ? (
            <a href={brand.phoneHref} className="inline-flex min-h-11 items-center rounded-full border border-gold-300 px-6 text-sm font-semibold">
              Call the office
            </a>
          ) : null}
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full border border-gold-300 px-6 text-sm font-semibold">
            Home
          </Link>
        </div>
      </main>
      <Footer locale="en" />
    </div>
  );
}
