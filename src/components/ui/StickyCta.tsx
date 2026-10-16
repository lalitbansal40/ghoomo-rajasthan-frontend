import type { ReactNode } from 'react';

/**
 * On a phone, the two actions that matter stay at the bottom of the screen — above the home
 * bar (safe-area). Not on wider screens, where the page's own buttons are in view. Leave room
 * for it at the page's foot (pb-24 on small screens).
 */
export function StickyCta({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-300 bg-ivory/95 px-4 pt-3 shadow-raised backdrop-blur md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex gap-3 [&>*]:flex-1">{children}</div>
    </div>
  );
}
