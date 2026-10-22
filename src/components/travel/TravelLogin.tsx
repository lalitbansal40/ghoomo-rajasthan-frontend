'use client';
import { useState } from 'react';
import type { Locale } from '@/i18n';
import { indianMobile } from '@/lib/enquiry';

export function TravelLogin({ locale, onVerified, initialPhone = '', initialName = '' }: { locale: Locale; onVerified: () => void; initialPhone?: string; initialName?: string }) {
  const hi = locale === 'hi'; const [phone, setPhone] = useState(initialPhone), [name, setName] = useState(initialName), [code, setCode] = useState('');
  const [sent, setSent] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault(); if (busy) return; setError(''); const mobile = indianMobile(phone);
    if (!mobile || !/^(?:\+?91[ -]?)?[6-9][\d -]{9,14}$/.test(phone) || !name.trim()) { setError(hi ? 'नाम और सही भारतीय मोबाइल नंबर भरें।' : 'Enter your name and a valid Indian mobile number.'); return; }
    setBusy(true);
    try {
      const r = await fetch(sent ? '/api/auth/session' : '/api/auth/otp', { method: 'POST', cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: mobile, ...(sent ? { code, name } : {}) }) });
      const b = await r.json(); if (!r.ok || !b?.ok) throw Error();
      if (sent) onVerified(); else { setSent(true); setPhone(mobile); }
    } catch { setError(hi ? 'सत्यापन नहीं हुआ। कृपया दोबारा कोशिश करें।' : 'Verification failed. Please try again.'); }
    finally { setBusy(false); }
  }
  return <form data-travel-signin aria-label={hi ? 'मोबाइल से सुरक्षित लॉगिन' : 'Secure mobile sign-in'} onSubmit={submit} className="space-y-4 rounded-xl border border-edge bg-surface p-5">
    <h2 className="text-h3 text-link">{hi ? 'मोबाइल से सुरक्षित लॉगिन' : 'Secure mobile sign-in'}</h2>
    <label className="block">{hi ? 'नाम' : 'Name'}<input required autoComplete="name" maxLength={60} value={name} onChange={e => setName(e.target.value)} className="mt-1 min-h-12 w-full rounded-lg border px-3" /></label>
    <label className="block">{hi ? 'मोबाइल नंबर' : 'Mobile number'}<input required autoComplete="tel" inputMode="tel" maxLength={18} disabled={sent} value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 min-h-12 w-full rounded-lg border px-3" /></label>
    {sent ? <label className="block">{hi ? 'ओटीपी' : 'OTP'}<input required autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{4,8}" maxLength={8} value={code} onChange={e => setCode(e.target.value)} className="mt-1 min-h-12 w-full rounded-lg border px-3" /></label> : null}
    <button disabled={busy} className="min-h-12 rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? (hi ? 'कृपया प्रतीक्षा करें…' : 'Please wait…') : sent ? (hi ? 'सत्यापित करें' : 'Verify') : (hi ? 'ओटीपी भेजें' : 'Send OTP')}</button>
    {sent ? <button type="button" disabled={busy} onClick={() => { setSent(false); setCode(''); }} className="ml-4 underline">{hi ? 'नंबर बदलें' : 'Change number'}</button> : null}
    {error ? <p role="alert">{error}</p> : null}
  </form>;
}
