'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * On a phone, the two actions that matter stay at the bottom of the screen — above the home
 * bar (safe-area). Not on wider screens, where the page's own buttons are in view. Leave room
 * for its actual height after the footer, including text scaling, wrapping and safe-area.
 */
export function StickyCta({ children }: { children: ReactNode }) {
  const bar = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  useLayoutEffect(() => {
    const element = bar.current;
    if (!element) return;
    const measure = () => setHeight(element.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <>
    <div aria-hidden="true" className="h-24 md:hidden" style={height === undefined ? undefined : { height }} />
    <div ref={bar} className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-300 bg-ivory/95 px-4 pt-3 shadow-raised backdrop-blur md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-wrap gap-3 [&>*]:min-w-0 [&>*]:flex-[1_1_8rem]">{children}</div>
    </div>
    </>
  );
}
