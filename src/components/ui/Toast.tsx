'use client';

import { useEffect } from 'react';
import { Icon } from './Icon';

/**
 * A short note that comes and goes — "added", "sent". Polite (it does not interrupt a screen
 * reader), gone after 4 s, and closable. Only imported where something happens in the browser.
 */
export function Toast({
  message,
  open,
  onClose,
  closeLabel,
  tone = 'success',
}: {
  message: string;
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  tone?: 'success' | 'error';
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [open, onClose]);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      {open ? (
        <div
          className={`pointer-events-auto flex items-center gap-3 rounded-full px-5 py-3 text-white shadow-raised ${
            tone === 'success' ? 'bg-success-fill' : 'bg-action'
          }`}
        >
          <Icon name={tone === 'success' ? 'check' : 'alert'} />
          <span className="font-semibold">{message}</span>
          <button type="button" onClick={onClose} aria-label={closeLabel} className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface/15">
            <Icon name="close" size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
