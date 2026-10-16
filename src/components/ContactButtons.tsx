import { Button } from '@/components/ui/Button';
import { dict, type Locale } from '@/i18n';
import { brand, whatsappLink } from '@/lib/site';

/** WhatsApp and call — the two ways to reach us until booking opens. Side by side on wider screens. */
export function ContactButtons({ locale = 'en', message }: { locale?: Locale; message?: string }) {
  const t = dict(locale);
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Button variant="whatsapp" size="lg" href={whatsappLink(message ?? t.cta.whatsappMessage)}>
        {t.cta.whatsapp}
      </Button>
      <Button variant="call" size="lg" href={brand.phoneHref}>
        {t.cta.call} · {brand.phone}
      </Button>
    </div>
  );
}
