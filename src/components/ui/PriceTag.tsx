import { dict, formatRupees, type Locale } from '@/i18n';
import { PACKAGES_ARE_SAMPLE } from '@/content/packages';
import { Badge } from './Badge';

/**
 * "from ₹27,999" for a car — the price people compare. While the packages are samples the
 * price says so, every time (a made-up price must never read as an offer). GST is on top, as
 * the packages' own list says (content/packages EXCLUDES).
 */
export function PriceTag({
  rupees,
  vehicle,
  locale,
  sample = PACKAGES_ARE_SAMPLE,
  gst = true,
  className = '',
}: {
  rupees: number;
  vehicle?: string;
  locale: Locale;
  sample?: boolean;
  gst?: boolean;
  className?: string;
}) {
  const t = dict(locale);
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-small text-muted">{t.pkg.from}</span>
        {sample ? <Badge tone="sample">{t.pkg.samplePrice}</Badge> : null}
      </div>
      <span className="text-price text-maroon-600">{formatRupees(rupees)}</span>
      <span className="text-small text-muted">
        {[vehicle, gst ? t.pkg.gstExtra : null].filter(Boolean).join(' · ')}
      </span>
    </div>
  );
}
