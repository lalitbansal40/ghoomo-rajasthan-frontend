import { brand, whatsappLink } from '@/lib/site';

/** WhatsApp and call — the two ways to reach us until booking opens. Big enough for a thumb. */
export function ContactButtons({ message }: { message?: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-royal px-6 text-lg font-semibold text-white shadow-sm transition hover:bg-royal/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        WhatsApp karo
      </a>
      <a
        href={brand.phoneHref}
        className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-maroon px-6 text-lg font-semibold text-maroon transition hover:bg-maroon hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Call karo · {brand.phone}
      </a>
    </div>
  );
}
