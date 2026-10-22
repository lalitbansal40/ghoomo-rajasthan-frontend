'use client';

import { HEADER_PANEL, openHeaderPanel } from '@/lib/header-panel';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { Dictionary } from '@/i18n/en';
import { localePath, type Locale } from '@/i18n/path';
import { loginHref } from '@/lib/account';

/**
 * Sign in / the account menu, in the header. Read in the browser (GET /api/auth/session) so
 * every page stays static; nobody signed in costs no request to the backend (no cookie, no call).
 */
export function AccountButton({ locale, travel, t }: { locale: Locale; travel: boolean; /** From the header (server). */ t: Pick<Dictionary['account'], 'login' | 'menu' | 'myBookings' | 'tripRequests' | 'logout'> }) {
  const path = usePathname() ?? '/';
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (e: Event) => { if ((e as CustomEvent).detail !== 'account') setOpen(false); };
    document.addEventListener(HEADER_PANEL, close);
    return () => document.removeEventListener(HEADER_PANEL, close);
  }, []);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    fetch('/api/auth/session', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((b) => { if (live && b?.data?.user) setUser(b.data.user); }).catch(() => {});
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => { if (e instanceof KeyboardEvent ? e.key === 'Escape' : !box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close); };
  }, [open]);

  const round = 'grid h-11 w-11 place-items-center rounded-full border-2 border-link text-link hover:bg-tint';
  if (!user) {
    return <a href={loginHref(locale, path)} aria-label={t.login} className={round}><Icon name="users" size={20} /></a>;
  }
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' }).catch(() => undefined);
    window.location.assign(localePath('/', locale));
  }
  const item = 'block min-h-11 w-full rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-heading hover:bg-tint';
  return (
    <div ref={box} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={`${t.menu}: ${user.name || user.phone}`} onClick={() => { if (!open) openHeaderPanel('account'); setOpen((o) => !o); }} className={`${round} bg-tint font-bold`}>
        {(user.name.trim()[0] ?? '').toUpperCase() || <Icon name="users" size={20} />}
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-60 rounded-[var(--radius-md)] bg-surface p-2 shadow-raised ring-1 ring-line/5">
          <p className="px-3 py-2 text-sm text-subtle">{user.name ? `${user.name} · ` : ''}{user.phone}</p>
          <a role="menuitem" className={item} href={localePath('/my-bookings', locale)}>{t.myBookings}</a>
          {travel ? <a role="menuitem" className={item} href={localePath('/trip-requests', locale)}>{t.tripRequests}</a> : null}
          <button role="menuitem" type="button" className={item} onClick={logout}>{t.logout}</button>
        </div>
      ) : null}
    </div>
  );
}
