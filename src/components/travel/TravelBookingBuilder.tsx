'use client';
import { useRef, useState } from 'react';
import { localePath, type Locale } from '@/i18n';
import { env } from '@/lib/env';
import { parseTravelProduct, parseTravelOffer, travelDayAfter, travelItemTotal, type TravelProduct, type TravelOffer, type TravelItemInput } from '@/lib/travel-contract';
import { TravelLogin } from './TravelLogin';
type CartItem = { product: TravelProduct; offer: TravelOffer; input: TravelItemInput };
const draft = (p: TravelProduct | null, o: TravelOffer | null): TravelItemInput => ({
  offerId: o?.id ?? '', offerRevision: o?.revision ?? 0, startDate: o?.firstDate ?? '',
  endDate: o ? travelDayAfter(o.firstDate, p?.kind === 'hotel' ? 1 : (p?.content.days ?? 1) - 1) : '',
  adults: 1, children: 0, infants: 0, rooms: p?.kind === 'hotel' ? [{ adults: 1, childAges: [] }] : [],
});
export function TravelBookingBuilder({ locale, products, initial }: {
  locale: Locale; products: TravelProduct[]; initial?: { product: TravelProduct; offers: TravelOffer[]; checkoutEnabled: boolean };
}) {
  const hi = locale === 'hi'; const [product, setProduct] = useState(initial?.product ?? null);
  const [offers, setOffers] = useState(initial?.offers ?? []), [offer, setOffer] = useState<TravelOffer | null>(initial?.offers[0] ?? null);
  const [input, setInput] = useState<TravelItemInput>(draft(initial?.product ?? null, initial?.offers[0] ?? null));
  const [checkout, setCheckout] = useState(initial?.checkoutEnabled ?? false), [cart, setCart] = useState<CartItem[]>([]);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [accepted, setAccepted] = useState(false), [login, setLogin] = useState(false);
  const command = useRef<{ body: string; key: string } | null>(null); const selection = useRef(0);
  const money = (paise: number) => new Intl.NumberFormat(hi ? 'hi-IN' : 'en-IN', { style: 'currency', currency: 'INR' }).format(paise / 100);
  const total = cart.reduce((n, i) => n + (travelItemTotal(i.product.kind, i.offer, i.input) ?? 0), 0);
  const field = 'mt-1 min-h-12 w-full rounded-lg border border-control bg-surface px-3';
  async function choose(slug: string) {
    const requestId = ++selection.current; setError(''); setBusy(true); setProduct(null); setAccepted(false);
    try {
      const r = await fetch(`${env.apiBaseUrl}/public/ghoomo/travel/products/${encodeURIComponent(slug)}`, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      const body = await r.json(); if (!r.ok || !body?.ok) throw Error();
      const p = parseTravelProduct(body.data.product);
      if (!Array.isArray(body.data.offers) || body.data.offers.length > 100) throw Error();
      const os = body.data.offers.map((o: unknown) => parseTravelOffer(o, p));
      if (selection.current !== requestId) return;
      setProduct(p); setOffers(os); setOffer(os[0] ?? null); setInput(draft(p, os[0] ?? null)); setCheckout(body.data.checkoutEnabled === true);
    } catch { if (selection.current === requestId) setError(hi ? 'विकल्प अभी उपलब्ध नहीं हैं।' : 'These options are unavailable right now.'); }
    finally { if (selection.current === requestId) setBusy(false); }
  }
  function add() {
    if (!product || !offer) return; const amount = travelItemTotal(product.kind, offer, input);
    if (!amount || product.kind !== 'hotel' && input.endDate !== travelDayAfter(input.startDate, product.content.days - 1) || input.startDate < offer.firstDate || input.startDate > offer.lastDate || cart.length >= 5) {
      setError(hi ? 'तारीख, यात्रियों और कमरों की जानकारी जाँचें। अधिकतम 5 विकल्प जोड़ें।' : 'Check your dates, party and room occupants. Add at most five items.'); return;
    }
    setCart([...cart, { product, offer, input: structuredClone(input) }]); setAccepted(false); setError('');
  }
  async function reserve() {
    if (busy || !cart.length || !accepted) return; setBusy(true); setError('');
    const body = JSON.stringify({ items: cart.map(i => i.input), expectedTotalPaise: total, termsAccepted: true, language: locale });
    if (command.current?.body !== body) command.current = { body, key: crypto.randomUUID() };
    try {
      const r = await fetch('/api/travel/reservations', { method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(25000),
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': command.current.key }, body });
      if (r.status === 401) { setLogin(true); return; }
      const data = await r.json(); if (!r.ok || !data?.ok || !/^[a-f\d]{24}$/i.test(data.data?.id ?? '')) {
        if (['PRICE_CHANGED', 'OFFER_CHANGED', 'SOLD_OUT', 'PRODUCT_UNAVAILABLE', 'BOOKING_CUTOFF'].includes(data?.error?.code))
          throw Error(hi ? 'कीमत या उपलब्धता बदल गई है। वर्तमान विकल्प दोबारा चुनें।' : 'Price or availability changed. Select the current options again.');
        throw Error(hi ? 'बुकिंग की पुष्टि नहीं हुई। वही विवरण रखकर दोबारा कोशिश करें।' : 'Booking was not confirmed. Keep the same details and retry safely.');
      }
      window.location.assign(localePath(`/travel-bookings/${data.data.id}`, locale));
    } catch (e) { setError(e instanceof Error && e.name !== 'TimeoutError' ? e.message : hi ? 'उत्तर नहीं मिला। उसी विवरण से दोबारा कोशिश करें।' : 'The result is uncertain. Retry with the same details.'); }
    finally { setBusy(false); }
  }
  return <div className="space-y-8">
    <section className="space-y-4 rounded-xl border border-edge bg-alternate/20 p-5" aria-label={hi ? 'यात्रा के विकल्प' : 'Trip options'}>
      <label className="block font-semibold">{hi ? 'टूर, ग्रुप या होटल चुनें' : 'Choose a tour, group departure or hotel'}
        <select className={field} value={product?.slug ?? ''} disabled={busy} onChange={e => void choose(e.target.value)}>
          <option value="" disabled>{hi ? 'विकल्प चुनें' : 'Select an option'}</option>
          {[...new Map([...products, ...(initial ? [initial.product] : [])].map(p => [p.slug, p])).values()].map(p => <option key={p.id} value={p.slug}>{p.content[locale].title}</option>)}
        </select>
      </label>
      {product ? <p>{product.content[locale].summary}</p> : null}
      {product && !offers.length ? <p role="status">{hi ? 'इन तारीखों के लिए अभी बिक्री योग्य विकल्प उपलब्ध नहीं है।' : 'No contracted booking options are available for this product right now.'}</p> : null}
      {product && offer ? <>
        <label className="block">{hi ? 'दर / प्रस्थान' : 'Rate plan / departure'}<select className={field} value={offer.id} onChange={e => { const o = offers.find(o => o.id === e.target.value)!; setOffer(o); setInput(draft(product, o)); }}>
          {offers.map(o => <option key={o.id} value={o.id}>{o.label[locale]} · {money(o.amountPaise)} · {o.firstDate}</option>)}
        </select></label>
        <p className="text-sm">{hi ? 'दर का आधार: ' : 'Rate basis: '}{offer.unit === 'per_person' ? (hi ? 'प्रति यात्री' : 'per traveler') : offer.unit === 'per_room_night' ? (hi ? 'प्रति कमरा, प्रति रात' : 'per room, per night') : (hi ? 'पूरी यात्रा के लिए प्रति गाड़ी' : 'per vehicle for the whole tour')}. {hi ? 'दिखाए गए कुल में लागू कर शामिल हैं। पूरा भुगतान ऑनलाइन होगा।' : 'Applicable taxes are included in the displayed total. Full payment is online.'}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>{hi ? 'शुरू / चेक-इन' : 'Start / check-in'}<input type="date" className={field} min={offer.firstDate} max={offer.lastDate} value={input.startDate} disabled={product.kind === 'group'} onChange={e => setInput({ ...input, startDate: e.target.value, endDate: travelDayAfter(e.target.value, product.kind === 'hotel' ? 1 : product.content.days - 1) })} /></label>
          <label>{hi ? 'समाप्त / चेक-आउट' : 'End / check-out'}<input type="date" className={field} value={input.endDate} min={input.startDate} disabled={product.kind !== 'hotel'} onChange={e => setInput({ ...input, endDate: e.target.value })} /></label>
          {(['adults', 'children', 'infants'] as const).map(k => <label key={k}>{({ adults: hi ? 'वयस्क' : 'Adults', children: hi ? 'बच्चे' : 'Children', infants: hi ? 'शिशु' : 'Infants' })[k]}<input className={field} type="number" min={k === 'adults' ? 1 : 0} max={offer.maxParty} value={input[k]} onChange={e => setInput({ ...input, [k]: Number(e.target.value) })} /></label>)}
        </div>
        {product.kind === 'hotel' ? <fieldset className="space-y-4"><legend className="font-semibold">{hi ? 'हर कमरे में यात्रियों की जानकारी' : 'Occupants in each room'}</legend>
          {input.rooms.map((room, i) => <div key={i} className="rounded-lg border bg-surface p-3">
            <label>{hi ? `कमरा ${i + 1}: वयस्क` : `Room ${i + 1}: adults`}<input type="number" min={1} max={offer.roomAdults} className={field} value={room.adults} onChange={e => setInput({ ...input, rooms: input.rooms.map((r, j) => j === i ? { ...r, adults: Number(e.target.value) } : r) })} /></label>
            <label className="mt-3 block">{hi ? 'बच्चों/शिशुओं की उम्र (कॉमा से अलग)' : 'Child/infant ages (comma separated)'}<input className={field} key={`${product.id}:${offer.id}:${i}`} defaultValue={room.childAges.join(',')} inputMode="numeric" placeholder={hi ? 'कोई बच्चा नहीं तो खाली छोड़ें' : 'Leave blank if none'} onBlur={e => setInput({ ...input, rooms: input.rooms.map((r, j) => j === i ? { ...r, childAges: e.target.value.trim() === '' ? [] : e.target.value.split(',').map(s => s.trim() === '' ? NaN : Number(s.trim())) } : r) })} /></label>
            {input.rooms.length > 1 ? <button type="button" className="mt-3 underline" onClick={() => setInput({ ...input, rooms: input.rooms.filter((_, j) => i !== j) })}>{hi ? 'कमरा हटाएँ' : 'Remove room'}</button> : null}
          </div>)}
          {input.rooms.length < 10 ? <button type="button" className="min-h-12 underline" onClick={() => setInput({ ...input, rooms: [...input.rooms, { adults: 1, childAges: [] }] })}>{hi ? 'एक और कमरा जोड़ें' : 'Add another room'}</button> : null}
          <p className="text-sm">{hi ? 'कमरों के यात्री ऊपर दिए कुल से मिलने चाहिए।' : 'Room occupants must match the total party entered above.'}</p>
        </fieldset> : null}
        <details><summary className="cursor-pointer font-semibold">{hi ? 'भुगतान और रद्द करने की शर्तें' : 'Payment and cancellation terms'}</summary><p className="mt-3 whitespace-pre-wrap">{offer.terms[locale]}</p><p className="mt-3 whitespace-pre-wrap">{offer.cancellation[locale]}</p></details>
        <button type="button" className="min-h-12 rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50" disabled={!checkout || busy} onClick={add}>{hi ? 'अपनी यात्रा में जोड़ें' : 'Add to your trip'}</button>
        {!checkout ? <p role="status">{hi ? 'ऑनलाइन चेकआउट अभी उपलब्ध नहीं है।' : 'Online checkout is not available yet.'}</p> : null}
      </> : null}
    </section>
    {cart.length ? <section className="space-y-4 rounded-xl border border-link/20 bg-surface p-5" aria-label={hi ? 'आपकी यात्रा' : 'Your trip'}>
      <h2 className="text-h3 text-link">{hi ? 'आपकी यात्रा' : 'Your trip'}</h2>
      <ol className="space-y-4">{cart.map((i, n) => <li className="border-b pb-3" key={n}><strong>{i.product.content[locale].title}</strong><p>{i.input.startDate} → {i.input.endDate}</p><p>{money(travelItemTotal(i.product.kind, i.offer, i.input) ?? 0)}</p><details><summary className="cursor-pointer underline">{hi ? 'इस विकल्प की शर्तें' : 'Terms for this item'}</summary><p className="whitespace-pre-wrap">{i.offer.terms[locale]}</p><p className="mt-3 whitespace-pre-wrap">{i.offer.cancellation[locale]}</p></details><button type="button" className="min-h-11 underline" disabled={busy} onClick={() => { setCart(cart.filter((_, j) => j !== n)); setAccepted(false); }}>{hi ? 'हटाएँ' : 'Remove'}</button></li>)}</ol>
      <p className="text-lg font-bold">{hi ? 'कुल ऑनलाइन भुगतान' : 'Total online payment'}: {money(total)}</p>
      <p>{hi ? 'अगले चरण में उपलब्धता दोबारा जाँची जाएगी। भुगतान से पहले बुकिंग की पुष्टि नहीं होगी।' : 'Availability is rechecked in the next step. Your booking is confirmed after verified payment against available inventory.'}</p>
      <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 size-5" checked={accepted} onChange={e => setAccepted(e.target.checked)} /><span>{hi ? 'मैंने चुने गए हर विकल्प की भुगतान और रद्द करने की शर्तें पढ़कर स्वीकार की हैं।' : 'I have read and accept the payment and cancellation terms of every selected item.'}</span></label>
      <button type="button" disabled={busy || !accepted} onClick={() => void reserve()} className="min-h-12 rounded-lg bg-action px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? (hi ? 'कृपया प्रतीक्षा करें…' : 'Please wait…') : (hi ? 'बुकिंग और भुगतान के लिए आगे बढ़ें' : 'Continue to booking and payment')}</button>
    </section> : null}
    {login ? <TravelLogin locale={locale} onVerified={() => { setLogin(false); setError(hi ? 'सत्यापन हो गया। अब बुकिंग के लिए आगे बढ़ें।' : 'Verified. Continue to booking when ready.'); }} /> : null}
    {error ? <p role="alert" className="rounded-lg border border-accent bg-surface p-4">{error}</p> : null}
  </div>;
}
