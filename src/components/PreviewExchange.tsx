'use client';
import { useEffect, useRef, useState } from 'react';
import { dict, type Locale } from '@/i18n';
export function PreviewExchange({ locale }: { locale: Locale }) {
  const credentials = useRef<{ token: string; exchangeKey: string } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const supplied = new URLSearchParams(location.hash.slice(1)).get('grant');
    if (!credentials.current && supplied) credentials.current = { token: supplied, exchangeKey: crypto.randomUUID() };
    history.replaceState(null, '', location.pathname);
    if (!credentials.current) { queueMicrotask(() => setFailed(true)); return; }
    const { token, exchangeKey } = credentials.current; let cancelled = false;
    const run = async () => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await fetch('/preview/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, exchangeKey }), cache: 'no-store' });
          const body = await response.json();
          if (!response.ok || !body.path?.startsWith(`/preview/${locale}/packages/`)) { if (!cancelled) setFailed(true); return; }
          if (!cancelled) location.replace(body.path); return;
        } catch { if (attempt === 1 && !cancelled) setFailed(true); }
      }
    };
    void run(); return () => { cancelled = true; };
  }, [locale]);
  return <p role="status">{failed ? dict(locale).catalog.unavailable : dict(locale).catalog.preview}</p>;
}
