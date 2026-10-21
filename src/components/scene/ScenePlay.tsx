'use client';

import { useEffect, useRef } from 'react';

/**
 * Plays a scene only while it is on screen (`data-play`, globals.css) — a loop scrolled away is
 * paused, not left running. With `once`, marks it `data-settled` the first time it is seen
 * (the sand settling between sections) and lets go.
 *
 * The page works without it: no script, no observer → the scene simply plays (or stays still
 * under reduced motion, which CSS alone decides).
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
    seen.observe(el);
    return () => seen.disconnect();
  }, [once]);
  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
