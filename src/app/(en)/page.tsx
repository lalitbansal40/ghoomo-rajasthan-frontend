import { sitePhotos } from '@/lib/site-photos';
import type { Metadata } from 'next';
import { baseMetadata, pageMetadata } from '@/lib/seo';
import { Home } from '../_home/Home';

const homeMetadata: Metadata = {
  title: { absolute: 'Ghoomo Rajasthan — Rajasthan tour packages with car & driver' },
  description:
    'Rajasthan tours — Jaipur, Udaipur, Jodhpur, Jaisalmer — with one car and a driver who knows the road. Day-by-day plans, the price before you go.',
  ...pageMetadata('/', 'en'),
};

// The cab fares come from the Hello My Cab backend; a day's cache, like hellomycabs.com.
export async function generateMetadata(): Promise<Metadata> {
  const own = (await sitePhotos())['home-hero'];
  if (!own) return homeMetadata;
  const base = baseMetadata('en', '', '');
  return { ...homeMetadata,
    openGraph: { ...base.openGraph, images: [{ url: own.variants.og, width: 1200, height: 630, alt: own.alt.en }] },
    twitter: { ...base.twitter, images: [own.variants.og] },
  };
}

export const revalidate = 86400;

export default function HomePage() {
  return <Home locale="en" />;
}
