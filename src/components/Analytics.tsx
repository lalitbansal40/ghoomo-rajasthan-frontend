import Script from 'next/script';
import { env } from '@/lib/env';

/**
 * Plausible (as on hellomycabs.com): about a kilobyte, no cookie, so no consent banner.
 * Renders nothing when NEXT_PUBLIC_ANALYTICS_DOMAIN is empty — every environment but
 * production — so local and preview visits never land in the real numbers.
 */
export function Analytics() {
  if (!env.analyticsDomain) return null;
  return (
    <Script
      defer
      data-domain={env.analyticsDomain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
