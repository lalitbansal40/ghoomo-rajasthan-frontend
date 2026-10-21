'use client';

import { useEffect, useRef } from 'react';

/**
 * Plays a scene only once the page has loaded and the browser is idle, and only while it is on
 * screen (`data-play`, globals.css) — the first paint is never kept waiting on decoration, and a
 * loop scrolled away is paused, not left running. With `once`, marks it `data-settled` the first
 * time it is seen (the sand settling between sections) and lets go.
 *
 * Without it (no script, no observer) a scene is simply drawn, still — it is decoration.
 */
export function ScenePlay({
  children,
  className = '',
  once = false,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
  'data-motion'?: 'on' | 'off';
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const seen = new IntersectionObserver(([entry]) => {
      if (once) {
        if (entry.isIntersecting) {
          el.dataset.settled = '1';
          seen.disconnect();
        }
        return;
      }
      el.dataset.play = entry.isIntersecting ? 'running' : 'paused';
    });
    // After the load and an idle moment: nothing moves while the page is still painting.
    const idle = (fn: () => void) =>
      typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 1200);
    let cancelled = false;
    const start = () => idle(() => !cancelled && seen.observe(el));
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', start);
      seen.disconnect();
    };
  }, [once]);
  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
