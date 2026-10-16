// Hindi of (en)/refund — owner to read; keep in step with the English.
// Every figure is the booking system's (see the comment in (en)/refund) — the same numbers here.
import type { Metadata } from 'next';
import Link from 'next/link';
import { alternates } from '@/lib/seo';
import { DocPage, DocSection } from '@/components/DocPage';
import { brand } from '@/lib/site';

export const metadata: Metadata = {
  title: 'कैंसल और रिफ़ंड',
  description: 'घूमो राजस्थान की बुकिंग कैंसल करने में कितना लगता है, और आपको कितना वापस मिलता है।',
  alternates: alternates('/refund', 'hi'),
};

export default function HindiRefundPage() {
  return (
    <DocPage
      locale="hi"
      path="/refund"
      title="कैंसल और रिफ़ंड"
      updated="16 अक्टूबर 2026"
      intro="छोटे में: कैंसल करने में ज़्यादा से ज़्यादा कम से कम एडवांस जितना लगता है, और उससे ऊपर जो भी आपने दिया, वह आपको वापस मिलता है।"
    >
      <DocSection title="बुक करते समय आप क्या देते हैं">
        <p>
          ऑनलाइन बुक की गई यात्रा एडवांस से पक्की होती है: कम से कम <strong>₹500</strong>, या किराया ₹2,500 से
          ज़्यादा हो तो <strong>किराए का 20%</strong>। आप चाहें तो ज़्यादा दे सकते हैं, पूरे किराए तक। बाक़ी
          रकम यात्रा के दौरान ड्राइवर को दी जाती है।
        </p>
      </DocSection>

      <DocSection title="अगर आप कैंसल करें">
        <p>
          कैंसल करने का चार्ज आपकी बुकिंग का कम से कम एडवांस है, और यह कभी भी आपकी दी हुई रकम से ज़्यादा नहीं
          होता। उससे ऊपर जो भी आपने दिया, वह पूरा रिफ़ंड होता है।
        </p>
        <p>
          उदाहरण: ₹4,500 की यात्रा पर कम से कम एडवांस ₹900 है। अगर आपने ₹2,000 दिए और कैंसल किया, तो ₹900
          कटेंगे और ₹1,100 आपको वापस मिलेंगे। ₹2,000 की यात्रा पर कम से कम एडवांस ₹500 है, और उतना ही कटता है।
        </p>
      </DocSection>

      <DocSection title="कब तक">
        <p>
          यात्रा शुरू होने से पहले आप कभी भी कैंसल कर सकते हैं। ड्राइवर के यात्रा शुरू करने के बाद बुकिंग चालू
          हो जाती है और ऑनलाइन कैंसल नहीं हो सकती। तब हमें फ़ोन करें, कोई व्यक्ति आपकी मदद करेगा।
        </p>
      </DocSection>

      <DocSection title="टूर पैकेज">
        <p>टूर पैकेज कैंसल करने की शर्तें हर पैकेज के साथ, बुक करने से पहले दिखाई जाएँगी।</p>
      </DocSection>

      <DocSection title="रिफ़ंड आप तक कैसे पहुँचता है">
        <p>
          Cashfree से, उसी कार्ड, UPI अकाउंट या बैंक अकाउंट में जिससे पैसा आया था। किसी दूसरे में कभी नहीं।
        </p>
      </DocSection>

      <DocSection title="अगर हम कैंसल करें">
        <p>
          अगर हम आपकी बुक की हुई गाड़ी नहीं दे पाते, तो कोई कैंसल चार्ज नहीं: आपका दिया हुआ सारा पैसा वापस
          मिलता है।
        </p>
      </DocSection>

      <DocSection title="सवाल">
        <p>
          <a className="font-semibold text-royal underline" href={brand.phoneHref}>
            {brand.phone}
          </a>{' '}
          पर फ़ोन या WhatsApp करें, और{' '}
          <Link className="text-royal underline" href="/hi/terms">
            शर्तें
          </Link>{' '}
          देखें।
        </p>
      </DocSection>
    </DocPage>
  );
}
