import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { buttonClass, type ButtonStyle } from './button-style';
export { buttonClass } from './button-style';

/**
 * Every button on the site: a pill (owner, 16 Oct 2026), at least 48 px tall at `md`, a visible
 * focus ring (globals.css), and the colours the contrast check passes. With `href` it is a link
 * (`Link` inside the site, `<a>` with rel for outside); otherwise a `<button>`.
 */
const ICON_FOR: Partial<Record<NonNullable<ButtonStyle['variant']>, IconName>> = { whatsapp: 'whatsapp', call: 'phone' };

type Common = ButtonStyle & {
  icon?: IconName | null;
  iconRight?: IconName;
  loading?: boolean;
  children: ReactNode;
};

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
