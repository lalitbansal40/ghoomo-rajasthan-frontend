'use client';

import { useEffect } from 'react';

/**
 * Open the dialer, once, as soon as the call page is on screen (app/(en)/c — a WhatsApp URL
 * button cannot be a tel: link, so it opens that page and this hands the number to the phone).
 *
 * `window.location.href`, because Next's redirect() refuses a tel: outright. A browser may
 * ignore it without a tap, and some in-app webviews block it — the page always draws the
 * number as a real link too, and then that link is the whole of the page's job.
 */
export function DialNow({ href }: { href: string }) {
  useEffect(() => {
    // One attempt. A retry would reopen the dialer every time it was dismissed.
    window.location.href = href;
  }, [href]);
  return null;
}
