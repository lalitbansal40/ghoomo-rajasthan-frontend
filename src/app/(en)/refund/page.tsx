import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { DocPage, DocSection } from '@/components/DocPage';
import { brand } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Cancellation and refund',
  description: 'What cancelling a Ghoomo Rajasthan booking costs, and what comes back to you.',
  ...pageMetadata('/refund', 'en'),
};

/**
 * Every figure here is what the booking system does, not a promise made here
 * (hello-my-cab-backend, the same system Ghoomo's bookings go through — 16 Oct 2026):
 *
 *   minimum advance = ₹500 up to a ₹2,500 fare, else 20%     utils/advance.ts minimumAdvanceOf
 *   cancellation fee = the booking's minimum advance          utils/advance.ts platformShareOf
 *   fee charged      = min(paid online, fee)                  booking.controller.ts computeCancellation
 *   refund           = paid online − fee charged              booking.controller.ts computeCancellation
 *   cancellable until the trip has started                    booking.controller.ts cancelBooking
 *
 * Tour-package cancellation terms are not set yet (owner) — this page says so rather than
 * inventing them. If that code changes, this page changes with it: a refund policy that does
 * not match what the system does is the document that loses the dispute.
 */
export default function RefundPage() {
  return (
    <DocPage
      path="/refund"
      title="Cancellation and refund"
      updated="16 October 2026"
      intro="In short: cancelling costs at most the minimum advance, and whatever you paid beyond it is returned to you."
    >
      <DocSection title="What you pay when you book">
        <p>
          A trip booked online is confirmed with an advance: at least <strong>₹500</strong>, or{' '}
          <strong>20% of the fare</strong> when the fare is more than ₹2,500. You may pay more, up to the
          whole fare. What is left is paid to the driver during the trip.
        </p>
      </DocSection>
      <DocSection title="If you cancel">
        <p>
          The cancellation fee is the minimum advance of your booking — and never more than you actually
          paid. Everything you paid above it is refunded.
        </p>
        <p>
          For example: on a ₹4,500 trip the minimum advance is ₹900. If you paid ₹2,000 and cancel, ₹900 is
          kept and ₹1,100 comes back to you. On a ₹2,000 trip the minimum is ₹500, and that is what is
          kept.
        </p>
      </DocSection>
      <DocSection title="Until when">
        <p>
          You can cancel any time before the trip starts. Once the driver has started the journey the
          booking is under way and cannot be cancelled online — call us and a person will help.
        </p>
      </DocSection>
      <DocSection title="Tour packages">
        <p>
          Tour package cancellation terms will be shown with each package before you book it.
        </p>
      </DocSection>
      <DocSection title="How the refund reaches you">
        <p>
          Through Razorpay, back to the same card, UPI account or bank account the money came from — never
          to a different one.
        </p>
      </DocSection>
      <DocSection title="If we cancel">
        <p>
          If we cannot provide the car you booked, there is no cancellation fee: everything you paid is
          returned.
        </p>
      </DocSection>
      <DocSection title="Questions">
        <p>
          Call or WhatsApp{' '}
          <a className="font-semibold text-royal underline" href={brand.phoneHref}>
            {brand.phone}
          </a>
          , and see the{' '}
          <Link className="text-royal underline" href="/terms">
            terms
          </Link>
          .
        </p>
      </DocSection>
    </DocPage>
  );
}
