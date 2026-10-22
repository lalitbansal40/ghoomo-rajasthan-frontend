'use client';
import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { localePath, type Locale } from '@/i18n';
import { TravelLogin } from './TravelLogin';
import { actualTravelDate, travelNights } from '@/lib/travel-contract';
const cities = ['JAIPUR', 'UDAIPUR', 'JODHPUR', 'JAISALMER', 'BIKANER', 'AJMER', 'PUSHKAR', 'KOTA', 'SAWAI_MADHOPUR'];
const cityNames: Record<string, string> = { JAIPUR: 'जयपुर', UDAIPUR: 'उदयपुर', JODHPUR: 'जोधपुर', JAISALMER: 'जैसलमेर', BIKANER: 'बीकानेर', AJMER: 'अजमेर', PUSHKAR: 'पुष्कर', KOTA: 'कोटा', SAWAI_MADHOPUR: 'सवाई माधोपुर' };
/** Custom requirements remain optional; published inventory uses direct booking above. No invented instant custom fare. */
export function TravelCustomRequest({ locale }: { locale: Locale }) {
  const hi = locale === 'hi', label = (en: string, hindi: string) => hi ? hindi : en;
  const [destinations, setDestinations] = useState<string[]>([]), [flexible, setFlexible] = useState(true);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [reference, setReference] = useState('');
  const [receipt, setReceipt] = useState<{ reference: string; claimToken: string; name: string; phone: string } | null>(null), [login, setLogin] = useState(false);
  const claimCommand = useRef<string | null>(null);
  const command = useRef<{ body: string; key: string } | null>(null), alert = useRef<HTMLParagraphElement>(null);
  const input = 'mt-1 min-h-12 w-full rounded-lg border p-3';
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const f = new FormData(event.currentTarget), value = (k: string) => String(f.get(k) ?? '').trim();
    const days = Number(value('days')), adults = Number(value('adults')), children = Number(value('children')), infants = Number(value('infants'));
    const startDate = flexible ? null : value('startDate'), endDate = flexible ? null : value('endDate');
    const mobile = value('phone').replace(/[ +()-]/g, '');
    const budgetText = value('budget'), budget = budgetText === '' ? null : Math.round(Number(budgetText) * 100);
    if (!/^(?:91)?[6-9]\d{9}$/.test(mobile) || !destinations.length || !Number.isInteger(days) || days < 1 || days > 30 ||
      adults < 1 || adults + children + infants > 50 || !flexible && (!actualTravelDate(startDate!) || !actualTravelDate(endDate!) || travelNights(startDate!, endDate!) + 1 !== days) ||
      budget !== null && (!Number.isSafeInteger(budget) || budget <= 0 || budget > 1_000_000_000)) {
      setError(label('Check mobile, ordered destinations, dates, duration, party and optional budget.', 'मोबाइल, गंतव्यों का क्रम, तारीख, अवधि, यात्री और वैकल्पिक बजट जाँचें।')); alert.current?.focus(); return;
    }
    const body = JSON.stringify({ kind: 'custom', name: value('name'), phone: value('phone'), language: locale,
      startCity: value('startCity'), endCity: value('endCity'), destinations, flexible, startDate, endDate, days, adults, children, infants, rooms: [],
      budget: budget === null ? null : { amountPaise: budget, currency: 'INR', basis: value('budgetBasis') },
      transport: value('transport'), accommodation: value('accommodation'), interests: value('interests').split(',').map(s => s.trim()).filter(Boolean),
      message: value('message'), contactPreference: value('contactPreference'), consent: f.get('consent') === 'on' });
    if (command.current?.body !== body) command.current = { body, key: crypto.randomUUID() };
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/travel/requests', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': command.current.key }, body, signal: AbortSignal.timeout(25000) });
      const b = await r.json(); if (!r.ok || !b?.ok || typeof b.data?.reference !== 'string' || typeof b.data?.claimToken !== 'string') throw Error();
      setReceipt({ reference: b.data.reference, claimToken: b.data.claimToken, name: value('name'), phone: value('phone') });
      setReference(b.data.reference);
    } catch { setError(label('Receipt not confirmed. Keep the same details and retry; the same command will not create another request.', 'प्राप्ति की पुष्टि नहीं हुई। उन्हीं विवरणों से फिर कोशिश करें; उसी कार्य से दूसरी रिक्वेस्ट नहीं बनेगी।')); }
    finally { setBusy(false); }
  }
  async function openRequest() {
    if (!receipt || busy) return; setBusy(true); setError(''); claimCommand.current ??= crypto.randomUUID();
    try {
      const r = await fetch('/api/travel/requests/claim', { method: 'POST', signal: AbortSignal.timeout(25000), headers: { 'Content-Type': 'application/json', 'Idempotency-Key': claimCommand.current }, body: JSON.stringify({ reference: receipt.reference, claimToken: receipt.claimToken }) });
      if (r.status === 401) { setLogin(true); return; }
      const b = await r.json(); if (!r.ok || !b?.ok || !/^[a-f\d]{24}$/i.test(b.data?.id ?? '')) throw Error();
      window.location.assign(localePath(`/trip-requests/${b.data.id}`, locale));
    } catch { setError(label('Could not link this receipt. Verify the mobile used for this request and retry from this tab, or contact support with the reference.', 'इस रसीद को खाते से नहीं जोड़ सके। इसी रिक्वेस्ट का मोबाइल सत्यापित करके इसी टैब से दोबारा कोशिश करें, या संदर्भ के साथ सहायता से संपर्क करें।')); }
    finally { setBusy(false); }
  }
  const cityOptions = cities.map(c => <option key={c} value={c}>{hi ? cityNames[c] : c.replaceAll('_', ' ')}</option>);
  if (reference) return <div role="status" className="space-y-3 rounded-xl border p-5"><h2 className="text-h3">{label('Custom requirements received', 'कस्टम यात्रा के विवरण मिल गए')}</h2><p>{reference}</p><p>{label('This is not a confirmed booking. Verify the mobile used for this request to link the receipt to your account and review your quote.', 'यह पुष्टि की गई बुकिंग नहीं है। इसी रिक्वेस्ट का मोबाइल सत्यापित करके रसीद अपने खाते से जोड़ें और कोटेशन देखें।')}</p><p>{label('Keep this tab open while verifying. Your receipt proof stays in this tab only; it is not put in links or browser storage.', 'सत्यापन के दौरान यह टैब खुला रखें। रसीद का प्रमाण केवल इसी टैब में है; लिंक या ब्राउज़र स्टोरेज में नहीं रखा जाता।')}</p>
    <button disabled={busy} className="min-h-12 rounded-lg bg-primary px-5 py-3 text-white" onClick={() => void openRequest()}>{label('Verify mobile and view my quote', 'मोबाइल सत्यापित करके कोटेशन देखें')}</button>
    {login ? <TravelLogin locale={locale} initialName={receipt?.name} initialPhone={receipt?.phone} onVerified={() => { setLogin(false); void openRequest(); }} /> : null}
    <Link className="inline-block underline" href={localePath('/trip-requests', locale)}>{label('Previously linked requests', 'पहले खाते से जोड़ी गई रिक्वेस्ट')}</Link>{error ? <p role="alert">{error}</p> : null}
  </div>;
  return <details className="rounded-xl border bg-surface p-5"><summary className="min-h-11 cursor-pointer font-semibold">{label('Need a different itinerary? Share custom requirements', 'अलग यात्रा चाहिए? कस्टम यात्रा के विवरण दें')}</summary>
    <p className="my-4">{label('Use direct booking above for published options. Custom requirements need a reviewed quote; no price or supplier confirmation is promised here.', 'प्रकाशित विकल्प ऊपर से सीधे बुक करें। अलग विवरण के लिए समीक्षा किया हुआ कोटेशन चाहिए; यहाँ कीमत या आपूर्तिकर्ता की पुष्टि का वादा नहीं है।')}</p>
    <form onSubmit={submit} className="space-y-4">
      <fieldset disabled={busy} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2"><label>{label('Name', 'नाम')}<input name="name" required autoComplete="name" maxLength={60} className={input} /></label><label>{label('Indian mobile', 'भारतीय मोबाइल')}<input name="phone" required type="tel" autoComplete="tel" maxLength={20} className={input} /></label>
          <label>{label('Start city', 'शुरुआती शहर')}<select name="startCity" className={input}>{cityOptions}</select></label><label>{label('End city', 'अंतिम शहर')}<select name="endCity" className={input}>{cityOptions}</select></label></div>
        <label className="block">{label('Add destinations in preferred order', 'पसंदीदा क्रम में गंतव्य जोड़ें')}<select value="" className={input} onChange={e => { if (e.target.value && !destinations.includes(e.target.value)) setDestinations([...destinations, e.target.value]); }}><option value="">{label('Select a destination', 'गंतव्य चुनें')}</option>{cityOptions}</select></label>
        <ol>{destinations.map((c, i) => <li key={c} className="flex flex-wrap items-center gap-3">{i + 1}. {hi ? cityNames[c] : c.replaceAll('_', ' ')}<button type="button" className="min-h-11 underline" disabled={i === 0} onClick={() => setDestinations(d => { const next = [...d]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; return next; })}>{label('Move up', 'ऊपर करें')}</button><button type="button" className="min-h-11 underline" onClick={() => setDestinations(destinations.filter(v => v !== c))}>{label('Remove', 'हटाएँ')}</button></li>)}</ol>
        <label className="flex gap-3"><input type="checkbox" checked={flexible} onChange={e => setFlexible(e.target.checked)} />{label('Dates are flexible', 'तारीखें लचीली हैं')}</label>
        <div className="grid gap-4 sm:grid-cols-2">{!flexible ? <><label>{label('Start date', 'शुरू तारीख')}<input type="date" name="startDate" required className={input} /></label><label>{label('End date', 'अंत तारीख')}<input type="date" name="endDate" required className={input} /></label></> : null}
          {[['days', 'Days', 'दिन', 1, 30], ['adults', 'Adults', 'वयस्क', 1, 50], ['children', 'Children', 'बच्चे', 0, 20], ['infants', 'Infants', 'शिशु', 0, 10]].map(([k, en, hindi, min, max]) => <label key={k}>{label(String(en), String(hindi))}<input name={String(k)} required type="number" min={Number(min)} max={Number(max)} defaultValue={Number(min)} className={input} /></label>)}
          <label>{label('Budget in INR (optional)', 'रुपये में बजट (वैकल्पिक)')}<input name="budget" type="number" min="0.01" step="0.01" className={input} /></label><label>{label('Budget basis', 'बजट का आधार')}<select name="budgetBasis" className={input}><option value="whole_trip">{label('Whole trip', 'पूरी यात्रा')}</option><option value="per_person">{label('Per person', 'प्रति व्यक्ति')}</option></select></label>
          <label>{label('Transport', 'यातायात')}<select name="transport" className={input}><option value="discuss">{label('Discuss', 'चर्चा करें')}</option><option value="with_driver">{label('With driver', 'ड्राइवर सहित')}</option><option value="not_needed">{label('Not needed', 'नहीं चाहिए')}</option></select></label>
          <label>{label('Accommodation', 'ठहरना')}<select name="accommodation" className={input}>{[['discuss', 'Discuss', 'चर्चा करें'], ['not_needed', 'Not needed', 'नहीं चाहिए'], ['standard', 'Standard', 'सामान्य'], ['premium', 'Premium', 'प्रीमियम']].map(([v, en, hindi]) => <option key={v} value={v}>{label(en, hindi)}</option>)}</select></label></div>
        <label className="block">{label('Interests, comma separated (optional)', 'रुचियाँ, कॉमा से अलग (वैकल्पिक)')}<input name="interests" maxLength={300} className={input} /></label><label className="block">{label('Other requirements (optional; no sensitive document or health numbers)', 'अन्य जानकारी (वैकल्पिक; संवेदनशील दस्तावेज़ या स्वास्थ्य नंबर न दें)')}<textarea name="message" maxLength={500} className={input} /></label>
        <label className="block">{label('Service contact preference', 'इस सेवा के लिए संपर्क')}<select name="contactPreference" className={input}><option value="phone">{label('Phone', 'फोन')}</option><option value="whatsapp">WhatsApp</option></select></label>
        <label className="flex gap-3"><input name="consent" type="checkbox" required /><span>{label('I agree to be contacted about this trip and to the privacy policy.', 'मैं इस यात्रा के बारे में संपर्क और गोपनीयता नीति से सहमत हूँ।')} <Link href={localePath('/privacy', locale)} className="underline">{label('Privacy policy', 'गोपनीयता नीति')}</Link></span></label>
        <button className="min-h-12 rounded-lg bg-primary px-5 py-3 text-white" type="submit">{busy ? label('Saving…', 'सेव हो रहा है…') : label('Send custom requirements', 'कस्टम यात्रा के विवरण भेजें')}</button>
      </fieldset>
      <p ref={alert} tabIndex={-1} role={error ? 'alert' : undefined}>{error}</p>
    </form>
  </details>;
}
