// Hindi of (en)/destinations — owner to read; keep in step with the English.
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { DestinationsList } from '../../_destinations/DestinationsList';

export const metadata: Metadata = {
  title: 'राजस्थान घूमने की जगहें, इलाक़े के हिसाब से',
  description: 'राजस्थान की हर देखने लायक जगह, इलाक़े के हिसाब से — क्या देखें, कब जाएँ, कितने दिन, और वहाँ ले जाने के लिए ड्राइवर के साथ गाड़ी।',
  ...pageMetadata('/destinations', 'hi'),
};

export default function HindiDestinationsPage() {
  return <DestinationsList locale="hi" />;
}
