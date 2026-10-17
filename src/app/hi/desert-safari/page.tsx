// Hindi of (en)/desert-safari — the words are in content/safari.ts and i18n/hi.ts (safari).
import type { Metadata } from 'next';
import { SafariPage } from '../../_safari/SafariPage';
import { safariMetadata } from '../../_safari/meta';

export const revalidate = 86400;
export const metadata: Metadata = safariMetadata('hi');

export default function HindiDesertSafariPage() {
  return <SafariPage locale="hi" />;
}
