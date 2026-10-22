import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

/** A message in the page: success, warning, error or info — colour AND an icon, never colour alone. */
const TONE: Record<'success' | 'warning' | 'error' | 'info', { box: string; icon: IconName; role: 'status' | 'alert' }> = {
  success: { box: 'bg-success-surface text-positive ring-positive/30', icon: 'check', role: 'status' },
  warning: { box: 'bg-warning-surface text-content ring-sun-500/50', icon: 'alert', role: 'status' },
  error: { box: 'bg-error-surface text-accent-strong ring-accent/30', icon: 'alert', role: 'alert' },
  info: { box: 'bg-tint text-heading ring-edge-strong', icon: 'info', role: 'status' },
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
