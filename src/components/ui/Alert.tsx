import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

/** A message in the page: success, warning, error or info — colour AND an icon, never colour alone. */
const TONE: Record<'success' | 'warning' | 'error' | 'info', { box: string; icon: IconName; role: 'status' | 'alert' }> = {
  success: { box: 'bg-[#E8F3EC] text-success ring-success/30', icon: 'check', role: 'status' },
  warning: { box: 'bg-gold-100 text-ink ring-sun-500/50', icon: 'alert', role: 'status' },
  error: { box: 'bg-maroon-50 text-maroon-700 ring-maroon-600/30', icon: 'alert', role: 'alert' },
  info: { box: 'bg-royal-50 text-royal-700 ring-royal-200', icon: 'info', role: 'status' },
};

export function Alert({ tone = 'info', title, children }: { tone?: keyof typeof TONE; title?: string; children: ReactNode }) {
  const t = TONE[tone];
  return (
    <div role={t.role} className={`flex gap-3 rounded-[var(--radius-md)] p-4 ring-1 ${t.box}`}>
      <Icon name={t.icon} className="mt-0.5" />
      <div>
        {title ? <p className="font-bold">{title}</p> : null}
        <div className={title ? 'mt-0.5' : ''}>{children}</div>
      </div>
    </div>
  );
}
