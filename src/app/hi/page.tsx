import type { Metadata } from 'next';
import { dict } from '@/i18n';
import { alternates } from '@/lib/seo';
import { ComingSoon } from '../_home/ComingSoon';

const t = dict('hi');

export const metadata: Metadata = {
  title: { absolute: `${t.brand.name} — ${t.common.comingSoon}` },
  description: t.brand.tagline,
  alternates: alternates('/', 'hi'),
};

export default function HindiHome() {
  return <ComingSoon locale="hi" />;
}
