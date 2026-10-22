import type { Locale } from '@/i18n';
import { dict } from '@/i18n';
export function CatalogNotice({ unavailable, locale }: { unavailable: boolean; locale: Locale }) {
  return unavailable ? <p role="status" className="my-4 rounded-2xl bg-sand-soft p-4">{dict(locale).catalog.unavailable}</p> : null;
}
