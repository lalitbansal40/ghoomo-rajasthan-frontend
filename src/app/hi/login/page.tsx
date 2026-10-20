import type { Metadata } from 'next';
import { LoginPage } from '@/app/_account/LoginPage';

// A sign-in form: never cached, never indexed.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'साइन इन', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function HindiLogin({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <LoginPage locale="hi" next={(await searchParams).next} />;
}
