import type { Metadata } from 'next';
import { EnquiryForm } from '@/components/EnquiryForm';
import { DocPage } from '@/components/DocPage';
import { pageMetadata } from '@/lib/seo';
import { safeProductSlug } from '@/lib/enquiry';

export const metadata: Metadata = { title: 'Plan your Rajasthan trip', robots: { index: false, follow: false }, ...pageMetadata('/enquiry', 'en') };

export default async function EnquiryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const allowed = ['package', 'safari', 'cab', 'custom'] as const;
  const type = allowed.includes(query.type as (typeof allowed)[number]) ? query.type as (typeof allowed)[number] : 'custom';
  const productSlug = safeProductSlug(typeof query.product === 'string' ? query.product : undefined);
  const productLabel = typeof query.name === 'string' ? query.name.slice(0, 80) : '';
  return <DocPage path="/enquiry" title="Plan your Rajasthan trip" intro="Tell us a little about your plans. Our team will contact you to discuss options; price and availability are confirmed by the team.">
    <EnquiryForm locale="en" initialType={type} productSlug={productSlug} productLabel={productLabel} />
  </DocPage>;
}
