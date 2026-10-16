import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

/**
 * Every button on the site: a pill (owner, 16 Oct 2026), at least 48 px tall at `md`, a visible
 * focus ring (globals.css), and the colours the contrast check passes. With `href` it is a link
 * (`Link` inside the site, `<a>` with rel for outside); otherwise a `<button>`.
 */
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
const ICON_FOR: Partial<Record<keyof typeof VARIANT, IconName>> = { whatsapp: 'whatsapp', call: 'phone' };

type Common = {
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  icon?: IconName | null;
  iconRight?: IconName;
  loading?: boolean;
  full?: boolean;
  children: ReactNode;
  className?: string;
};

export function buttonClass({
  variant = 'primary',
  size = 'md',
  full = false,
  className = '',
}: Pick<Common, 'variant' | 'size' | 'full' | 'className'>) {
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

function Inner({ icon, iconRight, loading, children, size = 'md' }: Common) {
  const s = size === 'lg' ? 22 : size === 'sm' ? 16 : 20;
  return (
    <>
      {loading ? (
        <span aria-hidden className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : icon ? (
        <Icon name={icon} size={s} />
      ) : null}
      <span className="whitespace-nowrap">{children}</span>
      {iconRight && !loading ? <Icon name={iconRight} size={s} /> : null}
    </>
  );
}

export function Button(
  props: Common &
    ({ href: string; external?: boolean } | ({ href?: undefined } & Omit<ComponentProps<'button'>, 'children' | 'className'>)),
) {
  const { variant = 'primary', size = 'md', full, className, loading = false } = props;
  const icon = props.icon === null ? undefined : (props.icon ?? ICON_FOR[variant]);
  const cls = buttonClass({ variant, size, full, className });
  const inner = <Inner {...props} icon={icon} size={size} />;

  if (props.href !== undefined) {
    const external = props.external ?? /^(https?:|tel:|mailto:)/.test(props.href);
    if (external) {
      const web = /^https?:/.test(props.href);
      return (
        <a
          href={props.href}
          className={cls}
          {...(web ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          aria-busy={loading || undefined}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={props.href} className={cls} aria-busy={loading || undefined}>
        {inner}
      </Link>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, icon: _i, iconRight: _r, loading: _l, full: _f, children: _c, className: _cn, href: _h, ...rest } = props;
  return (
    <button type="button" {...rest} className={cls} disabled={rest.disabled || loading} aria-busy={loading || undefined}>
      {inner}
    </button>
  );
}
