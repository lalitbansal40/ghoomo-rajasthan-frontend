import type { Metadata } from 'next';
import Link from 'next/link';
import { alternates } from '@/lib/seo';
import { DocPage, DocSection } from '@/components/DocPage';
import { Owner } from '@/components/Owner';
import { EXCLUDES, INCLUDES } from '@/content/packages';
import { brand } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'The terms of a Ghoomo Rajasthan tour: the price, what it covers, paying, cancelling and what we ask of you.',
  alternates: alternates('/terms', 'en'),
};

// TO FILL (owner): legalName, gstin, email in src/lib/site.ts — shown here by themselves.
/**
 * Ghoomo Rajasthan's terms, in its own words, on the structure of hellomycabs.com's terms. What
 * the price covers is the same list the packages show (content/packages INCLUDES / EXCLUDES),
 * so the two can never disagree; the money rules are the booking system's (see /refund).
 */
export default function TermsPage() {
  return (
    <DocPage
      path="/terms"
      title="Terms"
      updated="16 October 2026"
      intro="The short version: the price you are shown is the price for the car, the driver and the fuel; the rest is listed below, so nothing comes as a surprise on the road."
    >
      <DocSection title="Who we are">
        <p>
          <Owner /> Tours are driven by {brand.parent}&rsquo;s drivers in its cars, and booked through its
          booking system.
        </p>
      </DocSection>
      <DocSection title="The price">
        <p>
          The price of a tour or a trip is for the car you choose, for the days and the route of that
          booking. A change of route, extra days or extra places on the way can change it — the driver
          or our team will tell you the new price before, not after.
        </p>
        <p>
          While a package is marked <strong>Sample</strong>, its price is an example, not an offer: call
          or WhatsApp us for the real price of that tour.
        </p>
      </DocSection>
      <DocSection title="What the price covers, and what it does not">
        <p>Included:</p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          {INCLUDES.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p>Not included:</p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          {EXCLUDES.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </DocSection>
      <DocSection title="Paying">
        <p>
          A booking made online is confirmed with an advance paid through Razorpay — at least ₹500, or 20%
          of the fare above ₹2,500. The rest is paid to the driver during the trip. A booking is confirmed
          only once the advance has reached us.
        </p>
      </DocSection>
      <DocSection title="Cancelling">
        <p>
          You can cancel any time before the trip starts. What it costs and what comes back is on the{' '}
          <Link className="text-royal underline" href="/refund">
            cancellation and refund
          </Link>{' '}
          page.
        </p>
      </DocSection>
      <DocSection title="What we ask of you">
        {/* The same asks as hellomycabs.com's terms — the same drivers and cars; nothing added
            here that the company has not decided (a waiting charge, say). */}
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>A pickup point the driver can find, and a number he can reach you on.</li>
          <li>Nothing illegal carried in the car, and no damage to it beyond ordinary use.</li>
          <li>No more passengers than the seats the car is booked for.</li>
        </ul>
      </DocSection>
      <DocSection title="Things outside anyone's control">
        <p>
          Weather, road closures, strikes, a monument closed on the day, or a breakdown can change a plan.
          We will do what we can — another car, another route, another day — and tell you as soon as we
          know.
        </p>
      </DocSection>
      <DocSection title="Talking to us">
        <p>
          Call or WhatsApp{' '}
          <a className="font-semibold text-royal underline" href={brand.phoneHref}>
            {brand.phone}
          </a>
          {brand.email ? (
            <>
              , or write to{' '}
              <a className="font-semibold text-royal underline" href={`mailto:${brand.email}`}>
                {brand.email}
              </a>
            </>
          ) : null}
          . See also our{' '}
          <Link className="text-royal underline" href="/privacy">
            privacy
          </Link>{' '}
          page.
        </p>
      </DocSection>
    </DocPage>
  );
}
