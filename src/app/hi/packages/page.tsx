// Hindi of (en)/packages/page.tsx — the words are in content/packages (hi:) and i18n/hi.ts; owner to read.
import type { Metadata } from 'next';
import { alternates } from '@/lib/seo';
import { ToursList } from '../../_tours/ToursList';

export const metadata: Metadata = {
  title: 'गाड़ी और ड्राइवर के साथ राजस्थान टूर पैकेज',
  description:
    '2 से 7 दिन के राजस्थान टूर — जयपुर, उदयपुर, जोधपुर, जैसलमेर, पुष्कर, रणथंभौर, माउंट आबू। एक गाड़ी, एक ड्राइवर, हर दिन का प्लान।',
  alternates: alternates('/packages', 'hi'),
};

export default function HindiToursPage() {
  return <ToursList locale="hi" />;
}