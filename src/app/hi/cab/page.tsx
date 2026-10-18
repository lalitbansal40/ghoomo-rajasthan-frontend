// Hindi of (en)/cab — owner to read; keep in step with the English.
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { CabHub } from '../../_cab/CabHub';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'राजस्थान में ड्राइवर के साथ कैब — किराया',
  description: 'शहरों के बीच एक तरफ़ कैब, किलोमीटर के हिसाब से राजस्थान टूर के लिए गाड़ी, शहर में दिन भर की गाड़ी, और ग्रुप के लिए टेम्पो ट्रैवलर — हर किराया सामने।',
  ...pageMetadata('/cab', 'hi'),
};

export default function HindiCabPage() {
  return <CabHub locale="hi" />;
}
