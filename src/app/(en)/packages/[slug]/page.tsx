import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { catalogPackage as packageBySlug } from '@/lib/catalog';
import { alternates, pageRobots } from '@/lib/seo';
import { packageIndexable } from '@/lib/indexing-policy';
import { TourPage, tourDescription } from '../../../_tours/TourPage';

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const pkg = await packageBySlug((await params).slug);
  if (!pkg) return {};
  return {
    title: pkg.seoTitle || `${pkg.name} — ${pkg.days}D/${pkg.nights}N tour`,
    description: tourDescription(pkg, 'en'),
    alternates: alternates(`/packages/${pkg.slug}`, 'en', packageIndexable(pkg)),
    robots: pageRobots(packageIndexable(pkg)),
  };
}

export default async function TourPageEn({ params }: { params: Promise<{ slug: string }> }) {
  const pkg = await packageBySlug((await params).slug);
  if (!pkg) notFound();
  return <TourPage pkg={pkg} locale="en" />;
}
