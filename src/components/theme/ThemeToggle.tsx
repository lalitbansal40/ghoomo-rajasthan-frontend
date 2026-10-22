'use client';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { chooseTheme, serverThemeSnapshot, subscribeTheme, themeSnapshot } from '@/lib/theme-browser';
import { THEME_ENABLED, type ThemeMode } from '@/lib/theme';
import { HEADER_PANEL, openHeaderPanel } from '@/lib/header-panel';
import { Icon } from '@/components/ui/Icon';
import type { Dictionary } from '@/i18n/en';

export function ThemeToggle({ t, headerRow = false }: { t: Dictionary['theme']; headerRow?: boolean }) {
  const state = useSyncExternalStore(subscribeTheme, themeSnapshot, serverThemeSnapshot);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), panel = useRef<HTMLFieldSetElement>(null);
  const id = useId();
  useEffect(() => {
    const other = (e: Event) => { if ((e as CustomEvent).detail !== id) setOpen(false); };
    document.addEventListener(HEADER_PANEL, other);
    return () => document.removeEventListener(HEADER_PANEL, other);
  }, [id]);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLInputElement>('input:checked')?.focus();
    const outside = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    box.current?.addEventListener('keydown', key);
    const el = box.current;
    return () => { document.removeEventListener('pointerdown', outside); el?.removeEventListener('keydown', key); };
  }, [open]);
  if (!THEME_ENABLED) return null;
  return <div ref={box} className={`gr-theme-control relative ${headerRow ? 'max-sm:static' : ''}`} data-ready={state.ready || undefined}>
    <button ref={trigger} type="button" disabled={!state.ready} aria-expanded={open} aria-controls={id}
      aria-label={`${t.label}: ${t[state.mode]}${state.mode === 'auto' ? ` (${t[state.theme]})` : ''}`}
      onClick={() => { if (!open) openHeaderPanel(id); setOpen(!open); }}
      className="flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-2 text-heading hover:bg-tint">
      <Icon name={state.ready ? state.theme === 'dark' ? 'moon' : 'sun' : 'clock'} size={20} />
      <span className="text-small font-semibold">{t.label}</span>
    </button>
    {open ? <fieldset id={id} ref={panel} className="absolute right-0 top-full z-50 mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-edge bg-surface p-3 text-content shadow-raised">
      <legend className="sr-only">{t.label}</legend>
      {(['auto', 'light', 'dark'] as const).map((mode: ThemeMode) => <label key={mode} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 hover:bg-tint">
        <input type="radio" name={id} value={mode} checked={state.mode === mode} onChange={() => chooseTheme(mode)} />
        <Icon name={mode === 'auto' ? 'clock' : mode === 'dark' ? 'moon' : 'sun'} size={18} />{t[mode]}
      </label>)}
      <p className="mt-2 text-small text-subtle">{t.helper}</p>
      <button type="button" className="mt-2 min-h-11 w-full rounded-lg text-link hover:bg-tint" onClick={() => { setOpen(false); trigger.current?.focus(); }}>{t.close}</button>
    </fieldset> : null}
  </div>;
}
