'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { localePath, type Locale } from '@/i18n';
import { TravelLogin } from './TravelLogin';
import type { TravelItemInput } from '@/lib/travel-contract';
type RequestRow = { id: string; reference: string; revision: number; status: string; activeQuoteId: string | null };
type Words = { title: string; itinerary: Array<{ day: number; title: string; details: string }>; includes: string[]; excludes: string[]; terms: string; cancellation: string; availabilityNote: string };
type Quote = { id: string; revision: number; digest: string; totalPaise: number; status: string; content: { en: Words; hi: Words; validUntil: string; termsVersion: string; bookingItems?: TravelItemInput[]; lines: Array<{ label: { en: string; hi: string }; quantity: number; amountPaise: number; unit: string }> } };
export function TravelQuotes({ locale, id }: { locale: Locale; id?: string }) {
  const hi = locale === 'hi', label = (en: string, hindi: string) => hi ? hindi : en;
  const [rows, setRows] = useState<RequestRow[]>([]), [detail, setDetail] = useState<{ request: RequestRow; quotes: Quote[] } | null>(null);
  const [login, setLogin] = useState(false), [error, setError] = useState(''), [busy, setBusy] = useState(false), [accepted, setAccepted] = useState(false), [cursor, setCursor] = useState<string | null>(null);
  const command = useRef<{ body: string; key: string } | null>(null);
  const money = (v: number) => new Intl.NumberFormat(hi ? 'hi-IN' : 'en-IN', { style: 'currency', currency: 'INR' }).format(v / 100);
  const load = useCallback(async (next?: string, signal?: AbortSignal) => {
    const r = await fetch(`/api/travel/requests${id ? `/${id}` : next ? `?cursor=${encodeURIComponent(next)}` : ''}`, { cache: 'no-store', signal });
    if (signal?.aborted) return; if (r.status === 401) { setLogin(true); return; }
    const b = await r.json(); if (!r.ok || !b?.ok) throw Error(); if (signal?.aborted) return;
    setLogin(false); setError(''); if (id) setDetail(b.data); else { setRows(old => next ? [...old, ...b.data.items] : b.data.items); setCursor(b.data.cursor); }
  }, [id]);
  useEffect(() => { const controller = new AbortController(); const timer = setTimeout(() => { void load(undefined, controller.signal).catch(() => { if (!controller.signal.aborted) setError(hi ? 'कोटेशन लोड नहीं हुए।' : 'Could not load quotes.'); }); }, 0); return () => { clearTimeout(timer); controller.abort(); }; }, [load, hi]);
  async function action(quote: Quote, kind: 'accepted' | 'declined' | 'book') {
    if (!detail || !id || busy || !accepted) return; setBusy(true); setError('');
    const body = JSON.stringify(kind === 'book' ? { items: quote.content.bookingItems, quoteRequestId: id, quoteId: quote.id, quoteDigest: quote.digest, expectedTotalPaise: quote.totalPaise, language: locale, termsAccepted: true } : { expectedRevision: detail.request.revision, quoteId: quote.id, digest: quote.digest, decision: kind, termsAccepted: true });
    if (command.current?.body !== body) command.current = { body, key: crypto.randomUUID() };
    try {
      const r = await fetch(kind === 'book' ? '/api/travel/reservations' : `/api/travel/requests/${id}/decision`, { method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(25000), headers: { 'Content-Type': 'application/json', 'Idempotency-Key': command.current.key }, body });
      if (r.status === 401) { setLogin(true); return; }
      const b = await r.json(); if (!r.ok || !b?.ok) throw Error();
      if (kind === 'book') { if (!/^[a-f\d]{24}$/i.test(b.data?.id ?? '')) throw Error(); window.location.assign(localePath(`/travel-bookings/${b.data.id}`, locale)); }
      else { setAccepted(false); await load(); }
    } catch { setError(label('Result not confirmed. Refresh the current quote or retry unchanged details. Availability and prices are rechecked before payment.', 'परिणाम की पुष्टि नहीं हुई। वर्तमान कोटेशन रीफ्रेश करें या उन्हीं विवरणों से दोबारा भेजें। भुगतान से पहले उपलब्धता और कीमत दोबारा जाँची जाएगी।')); }
    finally { setBusy(false); }
  }
  const button = 'min-h-12 rounded-lg bg-royal px-5 py-3 text-white disabled:opacity-50';
  if (login) return <TravelLogin locale={locale} onVerified={() => { void load().catch(() => setError(label('Could not load.', 'लोड नहीं हुआ।'))); }} />;
  return <div className="space-y-5"><nav className="flex flex-wrap gap-4 underline"><Link href={localePath('/trip-requests', locale)}>{label('My requests and quotes', 'मेरी रिक्वेस्ट और कोटेशन')}</Link><Link href={localePath('/travel-bookings', locale)}>{label('My travel bookings', 'मेरी यात्रा बुकिंग')}</Link></nav>
    <button disabled={busy} className={button} onClick={() => void load().catch(() => setError(label('Could not refresh.', 'रीफ्रेश नहीं हुआ।')))}>{label('Refresh current status', 'वर्तमान स्थिति रीफ्रेश करें')}</button>
    {detail ? <><h2 className="text-h3">{detail.request.reference}</h2><p>{detail.request.status}</p>{detail.quotes.map(q => { const w = q.content[locale], current = detail.request.activeQuoteId === q.id; return <section key={q.id} className="space-y-4 rounded-xl border bg-white p-5"><h3 className="text-h3">{w.title}</h3><p>{label('Quote version', 'कोटेशन संस्करण')} {q.revision} · {q.status}</p><p>{label('Valid until', 'मान्य समय सीमा')}: {new Intl.DateTimeFormat(hi ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(q.content.validUntil))} IST</p>
      <ol>{w.itinerary.map(day => <li key={day.day} className="my-3"><strong>{day.day}. {day.title}</strong><p>{day.details}</p></li>)}</ol><p>{label('Included', 'शामिल')}: {w.includes.join(' · ')}</p><p>{label('Excluded', 'शामिल नहीं')}: {w.excludes.join(' · ')}</p>
      <ul>{q.content.lines.map((line, i) => <li key={i}>{line.label[locale]} × {line.quantity}: {money(line.amountPaise * line.quantity)}</li>)}</ul><p className="font-bold">{label('Total', 'कुल')}: {money(q.totalPaise)}</p><p className="whitespace-pre-wrap">{w.terms}</p><p className="whitespace-pre-wrap">{w.cancellation}</p><p>{w.availabilityNote}</p>
      {current && ['issued', 'accepted'].includes(q.status) ? <><p>{label('Quote acceptance alone does not confirm a booking. Contracted stock and the exact total must pass checkout before online payment.', 'केवल कोटेशन स्वीकार करने से बुकिंग की पुष्टि नहीं होती। ऑनलाइन भुगतान से पहले अनुबंधित उपलब्धता और वही कुल चेकआउट पर मान्य होना चाहिए।')}</p><label className="flex gap-3"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} />{label('I have reviewed this exact itinerary, total and cancellation terms.', 'मैंने इसी यात्रा, कुल राशि और रद्द करने की शर्तों की समीक्षा की है।')}</label><div className="flex flex-wrap gap-3">{q.status === 'issued' ? <><button disabled={busy || !accepted} className={button} onClick={() => void action(q, 'accepted')}>{label('Accept this quote', 'यही कोटेशन स्वीकार करें')}</button><button disabled={busy || !accepted} className={button} onClick={() => void action(q, 'declined')}>{label('Decline', 'अस्वीकार करें')}</button></> : q.content.bookingItems?.length ? <button disabled={busy || !accepted} className={button} onClick={() => void action(q, 'book')}>{label('Check availability and continue to payment', 'उपलब्धता जाँचकर भुगतान के लिए बढ़ें')}</button> : <p>{label('A supplier-backed booking option has not been attached yet. Contact support before paying.', 'अनुबंधित बुकिंग विकल्प अभी नहीं जोड़ा गया है। भुगतान से पहले सहायता से संपर्क करें।')}</p>}</div></> : null}
    </section>; })}</> : rows.length ? <ol className="space-y-3">{rows.map(r => <li key={r.id}><Link className="block rounded-xl border p-5" href={localePath(`/trip-requests/${r.id}`, locale)}>{r.reference} · {r.status}</Link></li>)}</ol> : <p>{label('No custom requests yet.', 'अभी कोई कस्टम रिक्वेस्ट नहीं है।')}</p>}
    {!id && cursor ? <button className={button} onClick={() => void load(cursor).catch(() => setError(label('Could not load more.', 'और लोड नहीं हुआ।')))}>{label('Load more', 'और दिखाएँ')}</button> : null}{error ? <p role="alert">{error}</p> : null}
  </div>;
}
