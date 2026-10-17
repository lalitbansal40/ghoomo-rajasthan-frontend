import type { Metadata } from 'next';
import { alternates } from '@/lib/seo';
import { AboutPage } from '../../_about/AboutPage';

export const metadata: Metadata = {
  title: 'About us — a Hello My Cab brand',
  description: 'Who runs Ghoomo Rajasthan, how a trip with us works, and how our drivers are verified before they take a booking.',
  alternates: alternates('/about', 'en'),
};

export default function About() {
  return <AboutPage locale="en" />;
}
