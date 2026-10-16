// Hindi of (en)/privacy — owner to read; keep in step with the English.
import type { Metadata } from 'next';
import Link from 'next/link';
import { alternates } from '@/lib/seo';
import { DocPage, DocSection } from '@/components/DocPage';
import { Owner } from '@/components/Owner';
import { brand } from '@/lib/site';

export const metadata: Metadata = {
  title: 'प्राइवेसी',
  description: 'घूमो राजस्थान आपकी कौन-सी जानकारी रखता है, क्यों, और कौन देखता है। और उसे हटवाना हो तो कैसे।',
  alternates: alternates('/privacy', 'hi'),
};

const updated = '16 अक्टूबर 2026';

export default function HindiPrivacyPage() {
  return (
    <DocPage
      locale="hi"
      path="/privacy"
      title="प्राइवेसी"
      updated={updated}
      intro="टूर के लिए जितनी ज़रूरी हो, हम बस उतनी जानकारी माँगते हैं। उसे सिर्फ़ आपकी यात्रा और हमारे हिसाब-किताब के लिए रखते हैं, और कभी बेचते नहीं।"
    >
      <DocSection title="हम कौन हैं">
        <p>
          <Owner locale="hi" />
        </p>
      </DocSection>

      <DocSection title="आज हम क्या लेते हैं">
        <p>
          इस साइट से कुछ नहीं। अभी यहाँ न कोई फ़ॉर्म है, न अकाउंट। आप हमें WhatsApp करें या फ़ोन करें, तो हमें
          आपका नंबर और आपकी बताई बात दिखती है, जैसे किसी भी कॉल या मैसेज में दिखती है।
        </p>
        <p>
          साइट पर कितने लोग आए, यह हम बिना कुकी के और बिना आपकी पहचान जाने गिनते हैं (Plausible Analytics)।
          कौन-सा पेज खुला, किस देश से और किस तरह के डिवाइस पर, बस यही। आप कौन हैं, यह कभी नहीं।
        </p>
      </DocSection>

      <DocSection title="जब आप टूर बुक करते हैं">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            <strong>आपका नाम</strong>, ताकि ड्राइवर को पता हो कि उसे किससे मिलना है।
          </li>
          <li>
            <strong>आपका मोबाइल नंबर</strong>: बुकिंग की जानकारी के लिए, साइन-इन के समय एक बार के कोड (OTP) के
            लिए, और ताकि ड्राइवर आपसे बात कर सके।
          </li>
          <li>
            <strong>आपको कहाँ से लेना है</strong>: कोई होटल, घर या जानी-मानी जगह।
          </li>
          <li>
            <strong>यात्रा</strong>: तारीख़ें, जगहें, गाड़ी और किराया।
          </li>
        </ul>
        <p>
          हम आपकी लोकेशन, जन्मतिथि या कोई पहचान-पत्र नहीं माँगते। कार्ड, UPI और बैंक की जानकारी हम तक कभी नहीं
          पहुँचती। आप Cashfree के अपने पेज पर पेमेंट करते हैं, और हमें सिर्फ़ यह बताया जाता है कि पेमेंट हुआ
          या नहीं।
        </p>
      </DocSection>

      <DocSection title="और कौन देखता है">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            <strong>आपके टूर का ड्राइवर</strong>: आपका नाम, नंबर और आपको कहाँ से लेना है। बुकिंग इसी से बनती
            है।
          </li>
          <li>
            <strong>Cashfree</strong>, हमारा पेमेंट गेटवे: रकम और बुकिंग नंबर।
          </li>
          <li>
            <strong>हैलो माय कैब</strong>: वही कंपनी, जिसके ड्राइवर, गाड़ियाँ और बुकिंग सिस्टम आपका टूर चलाते
            हैं।
          </li>
        </ul>
        <p>हम आपकी जानकारी बेचते नहीं, और विज्ञापन वालों को नहीं देते।</p>
      </DocSection>

      <DocSection title="कब तक रखते हैं">
        <p>
          बुकिंग हमारे पास यात्रा के रिकॉर्ड के रूप में रहती है: हमारे हिसाब-किताब और टैक्स के लिए, और ताकि
          टूर के बहुत बाद भी उसके बारे में कोई सवाल हो तो हम जवाब दे सकें।
        </p>
      </DocSection>

      <DocSection title="आपकी जानकारी, आपका फ़ैसला">
        <p>
          आप पूछ सकते हैं कि हमारे पास आपकी क्या जानकारी है, उसे ठीक करवा सकते हैं, या जो क़ानूनन रखना ज़रूरी
          नहीं, उसे मिटवा सकते हैं।{' '}
          <a className="font-semibold text-royal underline" href={brand.phoneHref}>
            {brand.phone}
          </a>{' '}
          पर फ़ोन या WhatsApp करें
          {brand.email ? (
            <>
              , या{' '}
              <a className="font-semibold text-royal underline" href={`mailto:${brand.email}`}>
                {brand.email}
              </a>{' '}
              पर लिखें
            </>
          ) : null}
          ।
        </p>
      </DocSection>

      <DocSection title="इनसे जुड़े पेज">
        <p>
          <Link className="text-royal underline" href="/hi/terms">
            शर्तें
          </Link>{' '}
          ·{' '}
          <Link className="text-royal underline" href="/hi/refund">
            कैंसल और रिफ़ंड
          </Link>{' '}
          ·{' '}
          <Link className="text-royal underline" href="/hi/contact">
            संपर्क
          </Link>
        </p>
      </DocSection>
    </DocPage>
  );
}
