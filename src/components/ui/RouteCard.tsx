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
      className="group flex items-center gap-4 rounded-[var(--radius-md)] bg-white p-4 shadow-card ring-1 ring-black/5 hover:ring-royal-200"
    >
      <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-royal-50 text-royal-600">
        <Icon name="car" size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-h3 truncate text-royal-700">
          {from} <span className="text-gold-700">→</span> {to}
        </p>
        <p className="text-small text-muted">
          {[km ? t.pkg.km(km) : null, fromRupees ? `${t.pkg.from} ${formatRupees(fromRupees)}` : null].filter(Boolean).join(' · ')}
          {sample ? (
            <Badge tone="sample" className="ml-2 align-middle">
              {t.pkg.sample}
            </Badge>
          ) : null}
        </p>
      </div>
      <Icon name="arrow" className="text-royal-600 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
