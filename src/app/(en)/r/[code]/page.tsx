import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { env } from '@/lib/env';
import { resumePath, type ResumeLead } from '@/lib/whatsapp-links';

/**
 * /r/<code> — the "Booking karein" button under the unfinished-form reminder (owner, 21 Oct
 * 2026). Its whole job is to put somebody back where they stopped: the same trip and car on
 * the booking page, which prices it afresh. A code that is not a Ghoomo Rajasthan lead (the
 * backend's /public/ghoomo/lead answers only those), an old one or a dead backend lands on the
 * booking widget — never an error page.
 */
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your booking', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function ResumeBooking({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  let lead: ResumeLead | null = null;
  if (/^[A-Za-z0-9]{4,40}$/.test(code)) {
    try {
      const res = await fetch(`${env.apiBaseUrl}/public/ghoomo/lead/${encodeURIComponent(code)}`, {
        cache: 'no-store',
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(10000),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.ok) lead = body.data as ResumeLead;
    } catch {
      /* the widget below — a dead backend must not show a customer a stack trace */
    }
  }
  redirect(resumePath(lead, Date.now()));
}
