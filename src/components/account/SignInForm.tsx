'use client';

import { useState } from 'react';
import { dict, type Locale } from '@/i18n';
import { indianMobile } from '@/lib/enquiry';

/**
 * Sign in to Ghoomo Rajasthan with a one-time code (hellomycabs.com's SignInForm, owner 20 Oct
 * 2026: "login signup wali thing … isme bhi wo customer create hoga"). A new number becomes a
 * Ghoomo account — never the Hello My Cab one on the same number. Back to `next` when done.
 */
export function SignInForm({ locale, next }: { locale: Locale; next: string }) {
  const t = dict(locale).account;
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const mobile = indianMobile(phone);
    if (!mobile) return setError(t.invalidPhone);
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/auth/otp', { method: 'POST', cache: 'no-store', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone: mobile }) });
      const b = await r.json().catch(() => null);
      if (r.status === 429) throw new Error('tooMany');
      if (!r.ok || !b?.ok) throw new Error('failed');
      setSentTo(mobile); setIsNew(b.data?.isNewUser === true); setCode('');
    } catch (err) { setError(err instanceof Error && err.message === 'tooMany' ? t.tooMany : t.failed); }
    finally { setBusy(false); }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{4,8}$/.test(code)) return setError(t.invalidCode);
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/auth/session', { method: 'POST', cache: 'no-store', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone: sentTo, code, ...(name.trim() ? { name: name.trim() } : {}) }) });
      const b = await r.json().catch(() => null);
      if (r.status === 429) throw new Error('tooMany');
      if (!r.ok || !b?.ok) throw new Error(String(b?.error?.code ?? '').startsWith('OTP_') ? 'wrongCode' : 'failed');
      window.location.assign(next);
    } catch (err) {
      const m = err instanceof Error ? err.message : 'failed';
      setError(m === 'tooMany' ? t.tooMany : m === 'wrongCode' ? t.wrongCode : t.failed);
      setBusy(false);
    }
  }

  const field = 'min-h-12 w-full rounded-lg border border-control bg-surface px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link';
  const label = 'flex flex-col gap-1.5 text-sm font-semibold';
  const button = 'min-h-12 w-full rounded-full bg-primary px-6 font-semibold text-white hover:bg-primary-hover disabled:opacity-60';
  return (
    <div className="rounded-2xl border border-edge bg-surface p-5 shadow-card sm:p-7">
      {!sentTo ? (
        <form onSubmit={send} noValidate className="space-y-4">
          <label className={label}>{t.phone}<input className={field} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} value={phone} onChange={(e) => setPhone(e.target.value)} autoFocus /></label>
          <button className={button} disabled={busy}>{busy ? t.sending : t.send}</button>
        </form>
      ) : (
        <form onSubmit={verify} noValidate className="space-y-4">
          <p role="status" className="text-sm">{t.sent(sentTo)} <button type="button" className="ml-1 font-semibold text-link underline" onClick={() => { setSentTo(''); setError(''); }}>{t.change}</button></p>
          <label className={label}>{t.code}<input className={field} type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} autoFocus /></label>
          {isNew ? <label className={label}>{t.name}<input className={field} autoComplete="name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} /></label> : null}
          <button className={button} disabled={busy}>{busy ? t.sending : t.verify}</button>
          <button type="button" className="min-h-11 w-full font-semibold text-link" disabled={busy} onClick={() => void send()}>{t.resend}</button>
        </form>
      )}
      {error ? <p role="alert" className="mt-4 rounded-lg bg-error-surface p-3 text-sm text-accent-strong">{error}</p> : null}
      <p className="mt-5 text-sm text-subtle">{t.separate}</p>
    </div>
  );
}
