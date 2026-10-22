// Hindi of (en)/terms — owner to read; keep in step with the English.
import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { DocPage, DocSection } from '@/components/DocPage';
import { Owner } from '@/components/Owner';
import { EXCLUDES_HI, INCLUDES_HI } from '@/content/packages';
import { brand } from '@/lib/site';

export const metadata: Metadata = {
  title: 'शर्तें',
  description:
    'घूमो राजस्थान टूर की शर्तें: किराया, उसमें क्या शामिल है, पेमेंट, कैंसल करना, और हम आपसे क्या चाहते हैं।',
  ...pageMetadata('/terms', 'hi'),
};

export default function HindiTermsPage() {
  return (
    <DocPage
      locale="hi"
      path="/terms"
      title="शर्तें"
      updated="16 अक्टूबर 2026"
      intro="छोटे में: जो किराया आपको दिखाया जाता है, वह गाड़ी, ड्राइवर और डीज़ल का है। बाक़ी सब नीचे लिखा है, ताकि रास्ते में कोई चौंकाने वाली बात न हो।"
    >
      <DocSection title="हम कौन हैं">
        <p>
          <Owner locale="hi" /> टूर हैलो माय कैब के ड्राइवर उसकी गाड़ियों में चलाते हैं, और बुकिंग उसी के
          बुकिंग सिस्टम से होती है।
        </p>
      </DocSection>

      <DocSection title="किराया">
        <p>
          टूर या यात्रा का किराया आपकी चुनी गाड़ी के लिए है, उस बुकिंग के दिनों और रास्ते के हिसाब से। रास्ता
          बदले, दिन बढ़ें या रास्ते में और जगहें जुड़ें, तो किराया बदल सकता है। ड्राइवर या हमारी टीम नया
          किराया पहले बताएगी, बाद में नहीं।
        </p>
        <p>
          जब तक किसी पैकेज पर <strong>नमूना</strong> लिखा है, उसका किराया एक उदाहरण है, ऑफ़र नहीं। उस टूर का
          असली किराया जानने के लिए हमें फ़ोन या WhatsApp करें।
        </p>
      </DocSection>

      <DocSection title="किराए में क्या शामिल है, और क्या नहीं">
        <p>शामिल:</p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          {INCLUDES_HI.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p>शामिल नहीं:</p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          {EXCLUDES_HI.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </DocSection>

      <DocSection title="पेमेंट">
        <p>
          ऑनलाइन की गई बुकिंग Razorpay से दिए गए एडवांस से पक्की होती है: कम से कम ₹500, या ₹2,500 से ज़्यादा
          किराए पर उसका 20%। बाक़ी रकम यात्रा के दौरान ड्राइवर को दी जाती है। बुकिंग तभी पक्की मानी जाती है जब
          एडवांस हम तक पहुँच जाए।
        </p>
      </DocSection>

      <DocSection title="कैंसल करना">
        <p>
          यात्रा शुरू होने से पहले आप कभी भी कैंसल कर सकते हैं। इसमें कितना लगता है और कितना वापस आता है, यह{' '}
          <Link className="text-link underline" href="/hi/refund">
            कैंसल और रिफ़ंड
          </Link>{' '}
          पेज पर लिखा है।
        </p>
      </DocSection>

      <DocSection title="हम आपसे क्या चाहते हैं">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>लेने की ऐसी जगह जो ड्राइवर ढूँढ सके, और एक नंबर जिस पर वह आपसे बात कर सके।</li>
          <li>गाड़ी में कोई ग़ैर-क़ानूनी सामान नहीं, और आम इस्तेमाल से ज़्यादा गाड़ी का कोई नुक़सान नहीं।</li>
          <li>गाड़ी जितनी सीटों के लिए बुक है, उससे ज़्यादा सवारी नहीं।</li>
        </ul>
      </DocSection>

      <DocSection title="जो किसी के बस में नहीं">
        <p>
          मौसम, बंद सड़क, हड़ताल, उस दिन बंद कोई स्मारक, या गाड़ी ख़राब होना, इनसे प्लान बदल सकता है। हम जो कर
          सकते हैं वह करेंगे: दूसरी गाड़ी, दूसरा रास्ता या दूसरा दिन। और जैसे ही हमें पता चलेगा, आपको बताएँगे।
        </p>
      </DocSection>

      <DocSection title="हमसे बात करें">
        <p>
          <a className="font-semibold text-link underline" href={brand.phoneHref}>
            {brand.phone}
          </a>{' '}
          पर फ़ोन या WhatsApp करें
          {brand.email ? (
            <>
              , या{' '}
              <a className="font-semibold text-link underline" href={`mailto:${brand.email}`}>
                {brand.email}
              </a>{' '}
              पर लिखें
            </>
          ) : null}
          । हमारा{' '}
          <Link className="text-link underline" href="/hi/privacy">
            प्राइवेसी
          </Link>{' '}
          पेज भी देखें।
        </p>
      </DocSection>
    </DocPage>
  );
}
