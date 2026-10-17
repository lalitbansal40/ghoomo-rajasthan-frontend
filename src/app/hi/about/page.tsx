// Hindi of (en)/about — the words are in content/about.ts (hi).
import type { Metadata } from 'next';
import { alternates } from '@/lib/seo';
import { AboutPage } from '../../_about/AboutPage';

export const metadata: Metadata = {
  title: 'हमारे बारे में — हैलो माय कैब का ब्रांड',
  description: 'घूमो राजस्थान कौन चलाता है, हमारे साथ यात्रा कैसे होती है, और बुकिंग लेने से पहले हमारे ड्राइवर कैसे वेरिफ़ाई होते हैं।',
  alternates: alternates('/about', 'hi'),
};

export default function HindiAbout() {
  return <AboutPage locale="hi" />;
}
