import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PACKAGES, packageBySlug } from '@/content/packages';
import { alternates } from '@/lib/seo';
import { TourPage, tourDescription } from '../../../_tours/TourPage';

export const dynamicParams = false;
export function generateStaticParams() {
  return PACKAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const pkg = packageBySlug((await params).slug);
  if (!pkg) return {};
  return {
    title: `${pkg.hi.name} — ${pkg.days} दिन / ${pkg.nights} रात राजस्थान टूर`,
    description: tourDescription(pkg, 'hi'),
    alternates: alternates(`/packages/${pkg.slug}`, 'hi'),
  };
}

export default async function TourPageHi({ params }: { params: Promise<{ slug: string }> }) {
  const pkg = packageBySlug((await params).slug);
  if (!pkg) notFound();
  return <TourPage pkg={pkg} locale="hi" />;
}
