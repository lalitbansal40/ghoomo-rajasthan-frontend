import type { Metadata } from 'next';
import Link from 'next/link';
import { alternates } from '@/lib/seo';
import { DocPage, DocSection } from '@/components/DocPage';
import { Owner } from '@/components/Owner';
import { brand } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What Ghoomo Rajasthan keeps about you, why, who else sees it, and how to have it removed.',
  alternates: alternates('/privacy', 'en'),
};

// TO FILL (owner): legalName, gstin, email in src/lib/site.ts — this page shows them by itself.
const updated = '16 October 2026';

/**
 * Written for Ghoomo Rajasthan in its own words, on the structure of hellomycabs.com's privacy
 * page. What it says has to stay true of the site: today it collects nothing (no form, no
 * account); bookings — and with them name, number and pickup — come in Phase 4, paid through
 * Cashfree (Hello My Cab's payment gateway). Change this page in the same commit as anything
 * that changes those facts — and the Hindi one (hi/privacy) with it.
 */
export default function PrivacyPage() {
  return (
    <DocPage
      path="/privacy"
      title="Privacy"
      updated={updated}
      intro="We ask for as little as a tour needs, keep it only for the trip and our accounts, and never sell it."
    >
      <DocSection title="Who we are">
        <p>
          <Owner />
        </p>
      </DocSection>
      <DocSection title="What we collect today">
        <p>
          Nothing through this site. There is no form and no account yet: if you message us on WhatsApp or
          call us, we see your number and what you tell us, as with any call or message.
        </p>
        <p>
          We count visits to the site without cookies and without identifying you (Plausible Analytics):
          which pages are opened, from which country and which kind of device — never who you are.
        </p>
      </DocSection>
      <DocSection title="When you book a tour">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            <strong>Your name</strong> — so the driver knows who he is meeting.
          </li>
          <li>
            <strong>Your mobile number</strong> — for the booking details, a one-time code when you sign in,
            and so the driver can reach you.
          </li>
          <li>
            <strong>Where to pick you up</strong> — a hotel, a house or a landmark.
          </li>
          <li>
            <strong>The trip</strong> — the dates, the places, the car and the price.
          </li>
        </ul>
        <p>
          We do not ask for your location, your date of birth or any identity document. Card, UPI and bank
          details never reach us: you pay on Cashfree&rsquo;s own page, and we are told only whether the
          payment went through.
        </p>
      </DocSection>
      <DocSection title="Who else sees it">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            <strong>The driver of your tour</strong> — your name, number and pickup point. That is the
            booking.
          </li>
          <li>
            <strong>Cashfree</strong>, our payment gateway — the amount and the booking reference.
          </li>
          <li>
            <strong>{brand.parent}</strong> — the same company, whose drivers, cars and booking system
            run your tour.
          </li>
        </ul>
        <p>We do not sell your details and we do not give them to advertisers.</p>
      </DocSection>
      <DocSection title="How long we keep it">
        <p>
          A booking is kept as our record of the trip — for our accounts, for tax, and so we can answer a
          question about a tour long after it.
        </p>
      </DocSection>
      <DocSection title="Your details, your call">
        <p>
          Ask us what we hold about you, ask us to correct it, or ask us to delete what the law does not
          require us to keep. Call or WhatsApp{' '}
          <a className="font-semibold text-royal underline" href={brand.phoneHref}>
            {brand.phone}
          </a>
          {brand.email ? (
            <>
              {' '}
              or write to{' '}
              <a className="font-semibold text-royal underline" href={`mailto:${brand.email}`}>
                {brand.email}
              </a>
            </>
          ) : null}
          .
        </p>
      </DocSection>
      <DocSection title="Related">
        <p>
          <Link className="text-royal underline" href="/terms">
            Terms
          </Link>{' '}
          ·{' '}
          <Link className="text-royal underline" href="/refund">
            Cancellation and refund
          </Link>{' '}
          ·{' '}
          <Link className="text-royal underline" href="/contact">
            Contact
          </Link>
        </p>
      </DocSection>
    </DocPage>
  );
}
