import type { Metadata } from 'next';
import { dict } from '@/i18n';
import { alternates } from '@/lib/seo';
import { ComingSoon } from '../_home/ComingSoon';

const t = dict('en');

export const metadata: Metadata = {
  title: { absolute: `${t.brand.name} — ${t.common.comingSoon.toLowerCase()}` },
  description: `${t.brand.tagline} ${t.common.comingSoon}.`,
  alternates: alternates('/', 'en'),
};

export default function Home() {
  return <ComingSoon locale="en" />;
}
