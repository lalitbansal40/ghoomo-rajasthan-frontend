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
    let visible = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const play = () => {
      if (once) return;
      const running = visible && !document.hidden && !reduced.matches && el.dataset.motion === 'on';
      el.dataset.play = running ? 'running' : 'paused';
      // CSS outside an SVG image cannot pause its wheel keyframes. Switch to the cached
      // still drawing too, so offscreen/hidden/reduced-motion means no decorative loop.
      for (const car of el.querySelectorAll<HTMLImageElement>('img[data-moving-src]')) {
        const src = running ? car.dataset.movingSrc! : '/scene/car.svg';
        if (car.getAttribute('src') !== src) car.setAttribute('src', src);
      }
    };
    const seen = new IntersectionObserver(([entry]) => {
      if (once) {
        if (entry.isIntersecting) {
          el.dataset.settled = '1';
          seen.disconnect();
        }
        return;
      }
      visible = entry.isIntersecting;
      play();
    });
    document.addEventListener('visibilitychange', play);
    reduced.addEventListener('change', play);
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
      document.removeEventListener('visibilitychange', play);
      reduced.removeEventListener('change', play);
      seen.disconnect();
    };
  }, [once]);
  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
