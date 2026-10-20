import type { Metadata } from 'next';
import { LoginPage } from '@/app/_account/LoginPage';

// A sign-in form: never cached, never indexed.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Sign in', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function Login({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <LoginPage locale="en" next={(await searchParams).next} />;
}
