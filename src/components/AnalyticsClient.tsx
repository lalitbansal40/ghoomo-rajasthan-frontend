'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsPayload, type EventName } from '@/lib/analytics-contract';
import { PRODUCTION_ORIGIN } from '@/lib/indexing-policy';

/** No third-party auto tracker is loaded: private SPA paths never produce implicit pageviews. */
export function ManualTracker({ pathname, allowedPaths }: { pathname: string | null; allowedPaths: string[] }) {
  const lastPage = useRef<string | null>(null);
  useEffect(() => {
    let active = true;
    const send = async (name: EventName) => {
      const initial = analyticsPayload({ policy: { origin: PRODUCTION_ORIGIN, stage: 'production', launched: true },
        domain: 'ghoomorajasthan.com', href: window.location.href, referrer: document.referrer, name, allowedPaths });
      if (!initial) return;
      try {
        // Root layouts can survive SPA navigation. Recheck current publication before each send,
        // so an archived/revised package cannot keep using an old browser allowlist.
        const response = await fetch('/api/release-paths', { cache: 'no-store', credentials: 'omit',
          referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(5000) });
        if (!response.ok || !active) return;
        const fresh = await response.json();
        if (!Array.isArray(fresh?.paths) || fresh.paths.length > 1024 || !fresh.paths.every((p: unknown) => typeof p === 'string')) return;
        const body = analyticsPayload({ policy: { origin: PRODUCTION_ORIGIN, stage: 'production', launched: true },
          domain: 'ghoomorajasthan.com', href: window.location.href, referrer: document.referrer, name,
          allowedPaths: allowedPaths.filter((p) => fresh.paths.includes(p)) });
        if (!body || body.url !== initial.url || !active) return;
        // Documented Plausible Events API. Browser supplies its real UA/IP; no cookies/referrer.
        void fetch('https://plausible.io/api/event', { method: 'POST', mode: 'no-cors', credentials: 'omit',
          referrerPolicy: 'no-referrer', keepalive: true, headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(body) }).catch(() => {});
      } catch { /* Telemetry cannot break customer actions. */ }
    };
    if (pathname && allowedPaths.includes(pathname)) {
      if (lastPage.current !== pathname) send('pageview');
      lastPage.current = pathname;
    } else lastPage.current = null;
    const custom = (e: Event) => {
      const name = (e as CustomEvent).detail;
      if (['enquiry_start', 'enquiry_success', 'enquiry_error'].includes(name)) send(name);
    };
    const click = (e: MouseEvent) => {
      if (!e.isTrusted || !(e.target instanceof Element)) return;
      const anchor = e.target.closest('a'); if (!anchor) return;
      let target: URL; try { target = new URL(anchor.href, window.location.href); } catch { return; }
      if (target.protocol === 'tel:') send('phone_click');
      else if (target.protocol === 'https:' && ['wa.me', 'api.whatsapp.com'].includes(target.hostname)) send('whatsapp_click');
      else if (target.origin === window.location.origin) {
        const currentHindi = window.location.pathname === '/hi' || window.location.pathname.startsWith('/hi/');
        const targetHindi = target.pathname === '/hi' || target.pathname.startsWith('/hi/');
        if (currentHindi !== targetHindi && allowedPaths.includes(target.pathname)) send('language_switch');
        if (/^\/(?:hi\/)?packages\//.test(window.location.pathname) && /^\/(?:hi\/)?enquiry$/.test(target.pathname)) send('package_enquiry_click');
      }
    };
    document.addEventListener('click', click, true);
    window.addEventListener('ghoomo:analytics', custom);
    return () => { active = false; document.removeEventListener('click', click, true); window.removeEventListener('ghoomo:analytics', custom); };
  }, [pathname, allowedPaths]);
  return null;
}

export function AnalyticsClient({ allowedPaths }: { allowedPaths: string[] }) {
  return <ManualTracker pathname={usePathname()} allowedPaths={allowedPaths} />;
}
