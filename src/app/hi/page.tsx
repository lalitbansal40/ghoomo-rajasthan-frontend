import type { Metadata } from 'next';
import { alternates } from '@/lib/seo';
import { Home } from '../_home/Home';

export const metadata: Metadata = {
  title: { absolute: 'घूमो राजस्थान — गाड़ी और ड्राइवर के साथ राजस्थान टूर पैकेज' },
  description:
    'जयपुर, उदयपुर, जोधपुर, जैसलमेर और भी बहुत कुछ — एक गाड़ी और ऐसे ड्राइवर के साथ जो रास्ता जानता है। दिन-ब-दिन प्लान, जाने से पहले दाम पक्का।',
  alternates: alternates('/', 'hi'),
};

export const revalidate = 86400;

export default function HindiHomePage() {
  return <Home locale="hi" />;
}
