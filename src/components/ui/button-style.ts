const VARIANT = {
  primary: 'bg-primary text-white shadow-card hover:bg-primary-hover active:bg-primary-active',
  secondary: 'border-2 border-accent text-accent hover:bg-action hover:text-white active:bg-action-hover',
  ghost: 'text-link hover:bg-tint active:bg-tint-hover',
  whatsapp: 'bg-success-fill text-white shadow-card hover:brightness-110 active:brightness-95',
  call: 'border-2 border-link text-link hover:bg-tint active:bg-tint-hover',
} as const;
const SIZE = {
  sm: 'min-h-10 px-4 text-[0.9375rem] gap-1.5',
  md: 'min-h-12 px-6 text-base gap-2',
  lg: 'min-h-14 px-8 text-lg gap-2.5',
} as const;
export type ButtonStyle = {
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  full?: boolean;
  className?: string;
};

export function buttonClass({
  variant = 'primary',
  size = 'md',
  full = false,
  className = '',
}: ButtonStyle) {
  return [
    'inline-flex max-w-full items-center justify-center rounded-full font-semibold leading-none',
    // A gold shine across it on hover, focus or tap (globals.css) — not on the plain ghost link.
    variant === 'ghost' ? '' : 'gr-shine',
    'transition-[background-color,color,filter,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)]',
    'active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    VARIANT[variant],
    SIZE[size],
    full ? 'w-full' : '',
    className,
  ].join(' ');
}
