/**
 * The site's own small icons (24 × 24, drawn in currentColor) — no icon library. Decorative:
 * the button or link around an icon carries the words (aria-label when there are none).
 */
const PATHS = {
  whatsapp:
    'M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 1.8a7.9 7.9 0 1 1-4.1 14.7l-.3-.2-3 .8.8-2.9-.2-.3A7.9 7.9 0 0 1 12 4Zm-3.2 3.9c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.4c.2.2 2.3 3.5 5.6 4.8 2.8 1.1 3.3.9 3.9.8.6-.1 2-.8 2.2-1.6.3-.8.3-1.4.2-1.6l-.6-.4-2-1c-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-.9-2.3c-.2-.6-.5-.6-.7-.6h-.6Z',
  phone: 'M6.6 2.5h2.6l1.4 4.6-2 1.6a12 12 0 0 0 6.7 6.7l1.6-2 4.6 1.4v2.6c0 1.2-1 2.1-2.2 2A17.6 17.6 0 0 1 4.6 4.7c-.1-1.2.8-2.2 2-2.2Z',
  arrow: 'M4 12h15M13 6l6 6-6 6',
  check: 'M4.5 12.5l4.5 4.5 10.5-11',
  cross: 'M6 6l12 12M18 6 6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  calendar: 'M4 6.5h16v13H4zM4 10.5h16M8.5 3.5v5M15.5 3.5v5',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.3a3.5 3.5 0 0 1 0 6.4M18.5 14.8c1.8.8 2.8 2.6 3 5.2',
  car: 'M3.5 16.5V12l2-5h13l2 5v4.5M3.5 16.5h17M6.5 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM5.5 12h13',
  mapPin: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Zm0-8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  sun: 'M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8',
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5v.5',
  alert: 'M12 3.5 2.5 20h19L12 3.5ZM12 10v4.5M12 17.2v.3',
} as const;

/** Icons drawn filled rather than stroked. */
const FILLED = new Set(['whatsapp', 'phone']);

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  const filled = FILLED.has(name);
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? undefined : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
