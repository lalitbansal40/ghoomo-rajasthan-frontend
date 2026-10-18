'use client';
import { useParams } from 'next/navigation';
import { PreviewExchange } from '@/components/PreviewExchange';
import { dict, type Locale } from '@/i18n';

// A fragment is unavailable to the server. A new grant must be exchangeable even
// when the current cookie belongs to another package or language. No draft data
// is emitted in this 404 response; a valid exchange reloads the bound resource.
export default function PreviewNotFound() {
  const params = useParams(); const locale: Locale = params.locale === 'hi' ? 'hi' : 'en';
  return <main className="mx-auto max-w-4xl p-6"><h1>{dict(locale).catalog.preview}</h1><PreviewExchange locale={locale} /></main>;
}
