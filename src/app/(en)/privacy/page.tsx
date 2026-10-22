import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { DocPage, DocSection } from '@/components/DocPage';
import { Owner } from '@/components/Owner';
import { brand } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What Ghoomo Rajasthan keeps about you, why, who else sees it, and how to have it removed.',
  ...pageMetadata('/privacy', 'en'),
};

// TO FILL (owner): legalName, gstin, email in src/lib/site.ts — this page shows them by itself.
const updated = '18 October 2026';

/**
 * Written for Ghoomo Rajasthan in its own words, on the structure of hellomycabs.com's privacy
 * page. Keep this and its Hindi counterpart in step with actual enquiry, booking and optional
 * public-only analytics behavior; business/legal owner approval remains a release gate.
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
          When you submit an enquiry, we receive your name, mobile number, travel date or flexibility,
          number of travellers, selected trip or vehicle and any message you add. With your permission,
          we use these to respond to that travel enquiry. Calls and WhatsApp messages also share the
          number and information you provide through that channel.
        </p>
        <p>
          Analytics is off before launch and in development or previews. When enabled in production,
          Plausible receives sanitized public-page URLs and limited visit or enquiry-event context,
          without analytics cookies. The browser also supplies network and device information. We
          do not send form values, names, phones, booking/payment references, OTPs or access tokens.
          Private booking, account and preview pages are excluded. A call or WhatsApp click does not
          prove that a conversation happened.
        </p>
      </DocSection>
      <DocSection title="Where online cab booking is available">
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
          details never reach us: you pay on Razorpay&rsquo;s own page, and we are told only whether the
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
            <strong>Razorpay</strong>, our payment provider — the amount and the booking reference.
          </li>
          <li>
            <strong>{brand.parent}</strong> — the same company, whose drivers, cars and booking system
            run your tour.
          </li>
        </ul>
        <p>We do not sell your details and we do not give them to advertisers.</p>
      </DocSection>
      <DocSection title="How long we keep it">
        <p>Enquiries are eligible for automatic removal from the enquiry store after 30 days. Booking
          and accounting records are separate; an enquiry is not a confirmed booking.</p>
        <p>
          A booking is kept as our record of the trip — for our accounts, for tax, and so we can answer a
          question about a tour long after it.
        </p>
      </DocSection>
      <DocSection title="Your details, your call">
        <p>
          Ask us what we hold about you, ask us to correct it, or ask us to delete what the law does not
          require us to keep. Call or WhatsApp{' '}
          <a className="font-semibold text-link underline" href={brand.phoneHref}>
            {brand.phone}
          </a>
          {brand.email ? (
            <>
              {' '}
              or write to{' '}
              <a className="font-semibold text-link underline" href={`mailto:${brand.email}`}>
                {brand.email}
              </a>
            </>
          ) : null}
          .
        </p>
      </DocSection>
      <DocSection title="Related">
        <p>
          <Link className="text-link underline" href="/terms">
            Terms
          </Link>{' '}
          ·{' '}
          <Link className="text-link underline" href="/refund">
            Cancellation and refund
          </Link>{' '}
          ·{' '}
          <Link className="text-link underline" href="/contact">
            Contact
          </Link>
        </p>
      </DocSection>
    </DocPage>
  );
}
