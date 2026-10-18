import { dict, type Locale } from '@/i18n';
import { PriceTagView } from './PriceTagView';
import { PACKAGES_ARE_SAMPLE } from '@/content/packages';

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
  rupees?: number;
  vehicle?: string;
  locale: Locale;
  sample?: boolean;
  gst?: boolean;
  className?: string;
}) {
  const t = dict(locale);
  return <PriceTagView rupees={rupees} vehicle={vehicle} sample={sample} gst={gst} className={className}
    labels={{ from: t.pkg.from, samplePrice: t.pkg.samplePrice, onRequest: t.catalog.onRequest, gstExtra: t.pkg.gstExtra }} />;
}
