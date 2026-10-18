const VARIANT = {
  primary: 'bg-royal-600 text-white shadow-card hover:bg-royal-700 active:bg-royal-800',
  secondary: 'border-2 border-maroon-600 text-maroon-600 hover:bg-maroon-600 hover:text-white active:bg-maroon-700',
  ghost: 'text-royal-600 hover:bg-royal-50 active:bg-royal-100',
  whatsapp: 'bg-success text-white shadow-card hover:brightness-110 active:brightness-95',
  call: 'border-2 border-royal-600 text-royal-600 hover:bg-royal-50 active:bg-royal-100',
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
    'inline-flex items-center justify-center rounded-full font-semibold leading-none',
    'transition-[background-color,color,filter,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)]',
    'active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    VARIANT[variant],
    SIZE[size],
    full ? 'w-full' : '',
    className,
  ].join(' ');
}
