import { Badge } from './Badge';
import { formatRupees } from '@/i18n/money';

export type PriceLabels = {
  from: string;
  samplePrice: string;
  onRequest: string;
  gstExtra: string;
};

/** Small price renderer shared with the picker; dictionaries and sample catalogs stay on the server. */
export function PriceTagView({
  rupees,
  vehicle,
  sample = false,
  gst = false,
  className = '',
  labels,
}: {
  rupees?: number;
  vehicle?: string;
  sample?: boolean;
  gst?: boolean;
  className?: string;
  labels: PriceLabels;
}) {
  const amount = rupees == null ? labels.onRequest : formatRupees(rupees, true);
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-small text-muted">{rupees == null ? null : labels.from}</span>
        {sample ? <Badge tone="sample">{labels.samplePrice}</Badge> : null}
      </div>
      <span className="text-price text-maroon-600">{amount}</span>
      <span className="text-small text-muted">
        {[vehicle, gst ? labels.gstExtra : null].filter(Boolean).join(' · ')}
      </span>
    </div>
  );
}
