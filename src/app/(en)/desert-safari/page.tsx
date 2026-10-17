import type { Metadata } from 'next';
import { SafariPage } from '../../_safari/SafariPage';
import { safariMetadata } from '../../_safari/meta';

// The car fares on the page come from the backend — a day old at most.
export const revalidate = 86400;
export const metadata: Metadata = safariMetadata('en');

export default function DesertSafariPage() {
  return <SafariPage locale="en" />;
}
