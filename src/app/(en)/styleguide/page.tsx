import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { StyleguideView } from '../../_styleguide/StyleguideView';

/** The page is static: the date field's earliest day is the build's (next.config env.BUILD_TIME). */
const BUILT = Date.parse(process.env.BUILD_TIME ?? '2026-10-16T00:00:00Z');

export const metadata: Metadata = {
  title: 'Style guide',
  ...pageMetadata('/styleguide', 'en'),
  // For the team: never indexed, whatever SITE_LAUNCHED says.
  robots: { index: false, follow: false },
};

export default function StyleguidePage() {
  return <StyleguideView locale="en" now={BUILT} />;
}
