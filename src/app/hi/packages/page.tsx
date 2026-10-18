// Hindi of (en)/packages/page.tsx — the words are in content/packages (hi:) and i18n/hi.ts; owner to read.
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { catalog } from '@/lib/catalog';
import { packageIndexable } from '@/lib/indexing-policy';
import { ToursList } from '../../_tours/ToursList';

const baseMetadata: Metadata = {
  title: 'गाड़ी और ड्राइवर के साथ राजस्थान टूर पैकेज',
  description:
    'गाड़ी और ड्राइवर के साथ राजस्थान की यात्रा योजनाएँ देखें। हर टूर का रूट, शामिल सेवाएँ और किराए की शर्तें पढ़ें या अपनी यात्रा की जानकारी भेजें।',
  ...pageMetadata('/packages', 'hi'),
};

export async function generateMetadata(): Promise<Metadata> {
  const state = await catalog();
  const eligible = !state.unavailable && state.packages.some(packageIndexable);
  return { ...baseMetadata, ...pageMetadata('/packages', 'hi', eligible) };
}

export default function HindiToursPage() {
  return <ToursList locale="hi" />;
}
