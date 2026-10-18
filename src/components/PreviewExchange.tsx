'use client';
import { useEffect, useRef, useState } from 'react';
import { dict, type Locale } from '@/i18n';
export function PreviewExchange({ locale, active = false }: { locale: Locale; active?: boolean }) {
  const credentials = useRef<{ token: string; exchangeKey: string } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false; let generation = 0; let controller: AbortController | null = null;
    const exchange = () => {
      const supplied = new URLSearchParams(location.hash.slice(1)).get('grant');
      if (supplied && supplied !== credentials.current?.token) credentials.current = { token: supplied, exchangeKey: crypto.randomUUID() };
      if (supplied) history.replaceState(null, '', location.pathname);
      if (!credentials.current) { if (!active) queueMicrotask(() => { if (!cancelled) setFailed(true); }); return; }
      // An open tab can receive another capability through a fragment-only navigation.
      // Retain the same UUID for an ambiguous exchange or React's effect replay.
      const current = ++generation; controller?.abort(); controller = new AbortController(); const signal = controller.signal; const { token, exchangeKey } = credentials.current;
      queueMicrotask(() => { if (!cancelled && current === generation) setFailed(false); });
      const run = async () => {
        for (let attempt = 0; attempt < 2; attempt++) {
          if (cancelled || current !== generation || signal.aborted) return;
          try {
            const response = await fetch('/preview/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, exchangeKey }), cache: 'no-store', signal });
            const body = await response.json();
            if (cancelled || current !== generation) return;
            if (!response.ok || !body.path?.startsWith(`/preview/${locale}/packages/`)) { setFailed(true); return; }
            location.replace(body.path); return;
          } catch { if (signal.aborted) return; if (attempt === 1 && !cancelled && current === generation) setFailed(true); }
        }
      };
      void run();
    };
    window.addEventListener('hashchange', exchange); exchange();
    return () => { cancelled = true; controller?.abort(); window.removeEventListener('hashchange', exchange); };
  }, [locale, active]);
  if (active) return null;
  return <p role="status">{failed ? dict(locale).catalog.unavailable : dict(locale).catalog.preview}</p>;
}
