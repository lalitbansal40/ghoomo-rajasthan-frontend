import type { Metadata } from 'next';
import { ContactButtons } from '@/components/ContactButtons';
import { pageMetadata } from '@/lib/seo';
import { DocPage, DocSection } from '@/components/DocPage';
import { brand } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Call or WhatsApp Ghoomo Rajasthan to plan a tour across Rajasthan.',
  ...pageMetadata('/contact', 'en'),
};

export default function ContactPage() {
  return (
    <DocPage
      scene="dunes"
      path="/contact"
      title="Contact"
      intro="Planning a trip across Rajasthan? Tell us where, when and how many of you — we will suggest the route and the car."
    >
      <div className="mb-8">
        <ContactButtons />
      </div>
      <DocSection title="Call or WhatsApp">
        <p>
          <a className="font-semibold text-royal underline" href={brand.phoneHref}>
            {brand.phone}
          </a>
        </p>
      </DocSection>
      {brand.email ? (
        <DocSection title="Email">
          <p>
            <a className="font-semibold text-royal underline" href={`mailto:${brand.email}`}>
              {brand.email}
            </a>
          </p>
        </DocSection>
      ) : null}
      <DocSection title="Office">
        <p>{brand.address}</p>
        <p className="text-sm text-muted">
          {brand.name} is a brand of {brand.legalName ?? brand.parent}.
        </p>
      </DocSection>
      <DocSection title="What to tell us">
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>Where you start, and the places you want to see</li>
          <li>The dates, or how many days you have</li>
          <li>How many people, and how much luggage</li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
