import type { ReactNode } from 'react';
import { Icon } from '../Icon';

/**
 * A label above, the control, then help or the error. The control gets the ids it needs
 * (`aria-describedby`, `aria-invalid`) from `fieldIds(id)` — so a screen reader reads the help
 * and the error with the field.
 */
export const fieldIds = (id: string) => ({ help: `${id}-help`, error: `${id}-error` });

export function Field({
  id,
  label,
  required = false,
  requiredLabel,
  help,
  error,
  children,
  className = '',
}: {
  id: string;
  label: string;
  required?: boolean;
  /** "required" in the page's language, for screen readers (the * is visual only). */
  requiredLabel: string;
  help?: string;
  error?: string | null;
  children: ReactNode;
  className?: string;
}) {
  const ids = fieldIds(id);
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="font-semibold text-ink">
        {label}
        {required ? (
          <>
            <span aria-hidden className="ml-0.5 text-maroon-600">*</span>
            <span className="sr-only"> ({requiredLabel})</span>
          </>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={ids.error} className="text-small flex items-center gap-1.5 font-semibold text-maroon-600">
          <Icon name="alert" size={16} />
          {error}
        </p>
      ) : help ? (
        <p id={ids.help} className="text-small text-muted">
          {help}
        </p>
      ) : null}
    </div>
  );
}

/** The look every control shares: 48 px, a soft radius, a clear border, red when wrong. */
export const controlClass = (invalid: boolean) =>
  [
    'w-full min-h-12 rounded-[var(--radius-sm)] border bg-white px-3.5 text-base text-ink',
    'placeholder:text-muted/70 transition-colors duration-[var(--dur-fast)]',
    invalid ? 'border-maroon-600 bg-maroon-50' : 'border-royal-200 hover:border-royal-500 focus:border-royal-600',
  ].join(' ');

/** The aria props a control takes from its Field. */
export const describe = (id: string, error?: string | null, help?: string) => {
  const ids = fieldIds(id);
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? ids.error : help ? ids.help : undefined,
  } as const;
};
