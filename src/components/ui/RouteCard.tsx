import Link from 'next/link';
import { dict, formatRupees, type Locale } from '@/i18n';
import { Badge } from './Badge';
import { Icon } from './Icon';

/**
 * A road between two cities — A → B, the distance, the lowest fare (from the backend's own
 * fares, lib/api.ts, in Phase 3). `sample` marks made-up numbers (the style guide).
 */
export function RouteCard({
  from,
  to,
  km,
  fromRupees,
  href,
  locale,
  sample = false,
}: {
  from: string;
  to: string;
  km?: number | null;
  fromRupees?: number | null;
  href: string;
  locale: Locale;
  sample?: boolean;
}) {
  const t = dict(locale);
  return (
    <Link
      href={href}
      className="gr-shine gr-lift group flex min-w-0 items-center gap-4 rounded-[var(--radius-md)] bg-surface p-4 shadow-card ring-1 ring-line/5 hover:ring-edge-strong"
    >
      <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-tint text-link">
        <Icon name="car" size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-h3 truncate text-heading">
          {from} <span className="text-gold-text">→</span> {to}
        </p>
        <p className="text-small text-subtle">
          {[km ? t.pkg.km(km) : null, fromRupees ? t.fare.fromAmount(formatRupees(fromRupees)) : null].filter(Boolean).join(' · ')}
          {sample ? (
            <Badge tone="sample" className="ml-2 align-middle">
              {t.pkg.sample}
            </Badge>
          ) : null}
        </p>
      </div>
      <Icon name="arrow" className="text-link transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
