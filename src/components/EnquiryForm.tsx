'use client';

import { useState } from 'react';
import { postGhoomo } from '@/lib/api';
import { indianMobile, validEnquiryDate } from '@/lib/enquiry';
import { dict, type Locale } from '@/i18n';

type EnquiryType = 'package' | 'safari' | 'cab' | 'custom';

export function EnquiryForm({ locale, initialType = 'custom', productSlug = 'custom-trip', productLabel = '' }: {
  locale: Locale; initialType?: EnquiryType; productSlug?: string; productLabel?: string;
}) {
  const t = dict(locale).enquiry;
  const [type, setType] = useState<EnquiryType>(initialType);
  const [date, setDate] = useState('');
  const [flexible, setFlexible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [travellers, setTravellers] = useState('2');
  const [vehicleType, setVehicleType] = useState('');
  const [message, setMessage] = useState(productLabel ? `${dict(locale).enquiry.selected}: ${productLabel}` : '');
  const [consent, setConsent] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || done) return;
    setError('');
    if (!name.trim() || !date && !flexible || !travellers) return setError(t.required);
    const digits = indianMobile(phone);
    if (!digits) return setError(t.phoneError);
    if (!consent) return setError(t.consentError);
    const travelDate = flexible ? 'flexible' : date;
    if (travelDate !== 'flexible' && !validEnquiryDate(travelDate, new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }))) return setError(t.dateError);
    setBusy(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      await postGhoomo('/booking/enquiry', {
        name: name.trim(), phone: digits, enquiryType: type,
        productSlug: /^[a-z0-9-]{1,100}$/.test(productSlug) ? productSlug : 'custom-trip',
        travelDate, travellers: Number(travellers), ...(vehicleType ? { vehicleType } : {}),
        ...(message.trim() ? { message: message.trim().slice(0, 500) } : {}), language: locale, consent: true,
      }, controller.signal);
      setDone(true);
    } catch {
      setError(t.retry);
    } finally {
      window.clearTimeout(timeout);
      setBusy(false);
    }
  }

  if (done) return <div role="status" className="rounded-xl border border-forest/30 bg-forest/5 p-5 text-ink">{t.success}</div>;
  const field = 'min-h-12 w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal';
  const label = 'flex flex-col gap-2 text-sm font-semibold text-ink';
  return <form onSubmit={submit} className="space-y-5" noValidate>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className={label}>{t.name}<input className={field} autoComplete="name" maxLength={60} required value={name} onChange={e => setName(e.target.value)} /></label>
      <label className={label}>{t.phone}<input className={field} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={16} aria-describedby="enquiry-phone-help" required value={phone} onChange={e => setPhone(e.target.value)} /><span id="enquiry-phone-help" className="font-normal text-muted">{locale === 'hi' ? '10 अंकों का भारतीय मोबाइल नंबर' : '10-digit Indian mobile number'}</span></label>
      <label className={label}>{t.type}<select className={field} value={type} onChange={e => setType(e.target.value as EnquiryType)}><option value="package">{t.package}</option><option value="safari">{t.safari}</option><option value="cab">{t.cab}</option><option value="custom">{t.custom}</option></select></label>
      <label className={label}>{t.travellers}<input className={field} type="number" min={1} max={50} required value={travellers} onChange={e => setTravellers(e.target.value)} /></label>
      <label className={label}>{t.date}<input className={field} type="date" disabled={flexible} min={new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })} required={!flexible} value={date} onChange={e => setDate(e.target.value)} /></label>
      <label className="flex min-h-12 items-center gap-3 self-end text-sm"><input type="checkbox" className="size-5 accent-royal" checked={flexible} onChange={e => setFlexible(e.target.checked)} />{t.flexible}</label>
      <label className={label}>{t.vehicle}<select className={field} value={vehicleType} onChange={e => setVehicleType(e.target.value)}><option value="">{t.choose}</option><option value="hatchback">{t.hatchback}</option><option value="dzire">{t.dzire}</option><option value="ertiga">{t.ertiga}</option><option value="crysta">{t.crysta}</option></select></label>
    </div>
    <label className={label}>{t.message}<textarea className={`${field} min-h-24`} maxLength={500} value={message} onChange={e => setMessage(e.target.value)} /></label>
    <label className="flex items-start gap-3 text-sm leading-6"><input className="mt-1 size-5 shrink-0 accent-royal" type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} /><span>{t.consent} <a className="text-royal underline" href={locale === 'hi' ? '/hi/privacy' : '/privacy'}>{t.privacy}</a> · <a className="text-royal underline" href={locale === 'hi' ? '/hi/terms' : '/terms'}>{t.terms}</a>.</span></label>
    {error ? <p role="alert" className="text-sm font-medium text-red-700">{error}</p> : null}
    <button className="min-h-12 w-full rounded-lg bg-royal px-5 py-3 font-semibold text-white hover:bg-royal-700 disabled:cursor-wait disabled:opacity-60 sm:w-auto" disabled={busy}>{busy ? t.sending : t.submit}</button>
  </form>;
}
