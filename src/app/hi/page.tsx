import { sitePhotos } from '@/lib/site-photos';
import type { Metadata } from 'next';
import { baseMetadata, pageMetadata } from '@/lib/seo';
import { Home } from '../_home/Home';

const homeMetadata: Metadata = {
  title: { absolute: 'घूमो राजस्थान — गाड़ी और ड्राइवर के साथ राजस्थान टूर पैकेज' },
  description:
    'जयपुर, उदयपुर, जोधपुर, जैसलमेर और भी बहुत कुछ — एक गाड़ी और ऐसे ड्राइवर के साथ जो रास्ता जानता है। दिन-ब-दिन प्लान, जाने से पहले दाम पक्का।',
  ...pageMetadata('/', 'hi'),
};

export async function generateMetadata(): Promise<Metadata> {
  const own = (await sitePhotos())['home-hero'];
  if (!own) return homeMetadata;
  const base = baseMetadata('hi', '', '');
  return { ...homeMetadata,
    openGraph: { ...base.openGraph, images: [{ url: own.variants.og, width: 1200, height: 630, alt: own.alt.hi }] },
    twitter: { ...base.twitter, images: [own.variants.og] },
  };
}

export const revalidate = 86400;

export default function HindiHomePage() {
  return <Home locale="hi" />;
}
