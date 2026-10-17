import type { Metadata } from 'next';
import { EnquiryForm } from '@/components/EnquiryForm';
import { DocPage } from '@/components/DocPage';
import { alternates } from '@/lib/seo';
import { safeProductSlug } from '@/lib/enquiry';

export const metadata: Metadata = { title: 'राजस्थान यात्रा की योजना', robots: { index: false, follow: false }, alternates: alternates('/enquiry', 'hi') };

export default async function HindiEnquiryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const allowed = ['package', 'safari', 'cab', 'custom'] as const;
  const type = allowed.includes(query.type as (typeof allowed)[number]) ? query.type as (typeof allowed)[number] : 'custom';
  const productSlug = safeProductSlug(typeof query.product === 'string' ? query.product : undefined);
  const productLabel = typeof query.name === 'string' ? query.name.slice(0, 80) : '';
  return <DocPage locale="hi" path="/enquiry" title="राजस्थान यात्रा की योजना" intro="अपने प्लान के बारे में बताइए। हमारी टीम विकल्पों पर बात करने के लिए आपसे संपर्क करेगी; दाम और उपलब्धता टीम बताएगी।">
    <EnquiryForm locale="hi" initialType={type} productSlug={productSlug} productLabel={productLabel} />
  </DocPage>;
}
