'use client';

import type { ReactNode } from 'react';

/**
 * A choice you can switch on and off — a car, a day, a filter. A real button with aria-pressed,
 * so a screen reader hears "pressed"; 44 px tall, a pill.
 */
export function Chip({
  pressed,
  onChange,
  children,
  className = '',
}: {
  pressed: boolean;
  onChange: (next: boolean) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onChange(!pressed)}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-[0.9375rem] font-semibold transition-colors duration-[var(--dur-fast)] ${
        pressed
          ? 'border-royal-600 bg-royal-600 text-white'
          : 'border-royal-200 bg-white text-royal-700 hover:border-royal-500 hover:bg-royal-50'
      } ${className}`}
    >
      {children}
    </button>
  );
}
