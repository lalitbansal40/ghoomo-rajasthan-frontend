// Hindi of (en)/contact — owner to read; keep in step with the English.
import type { Metadata } from 'next';
import { alternates } from '@/lib/seo';
import { ContactButtons } from '@/components/ContactButtons';
import { DocPage, DocSection } from '@/components/DocPage';
import { brand } from '@/lib/site';

export const metadata: Metadata = {
  title: 'संपर्क',
  description: 'राजस्थान घूमने का प्लान बनाना है? घूमो राजस्थान को फ़ोन या WhatsApp करें।',
  alternates: alternates('/contact', 'hi'),
};

export default function HindiContactPage() {
  return (
    <DocPage
      locale="hi"
      path="/contact"
      title="संपर्क"
      intro="राजस्थान घूमने का प्लान है? बताइए कहाँ, कब और कितने लोग। हम रास्ता और गाड़ी सुझा देंगे।"
    >
      <div className="mb-8">
        <ContactButtons locale="hi" />
      </div>

      <DocSection title="फ़ोन या WhatsApp">
        <p>
          <a className="font-semibold text-royal underline" href={brand.phoneHref}>
            {brand.phone}
          </a>
          : हर दिन, कोई व्यक्ति ही जवाब देता है।
        </p>
      </DocSection>

      {brand.email ? (
        <DocSection title="ईमेल">
          <p>
            <a className="font-semibold text-royal underline" href={`mailto:${brand.email}`}>
              {brand.email}
            </a>
          </p>
        </DocSection>
      ) : null}

      <DocSection title="ऑफ़िस">
        <p>{brand.address}</p>
        <p className="text-sm text-muted">
          घूमो राजस्थान {brand.legalName ?? 'हैलो माय कैब'} का एक ब्रांड है।
        </p>
      </DocSection>

      <DocSection title="हमें क्या बताएँ">
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>आप कहाँ से शुरू करेंगे, और कौन-सी जगहें देखना चाहते हैं</li>
          <li>तारीख़ें, या आपके पास कितने दिन हैं</li>
          <li>कितने लोग हैं, और कितना सामान है</li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
