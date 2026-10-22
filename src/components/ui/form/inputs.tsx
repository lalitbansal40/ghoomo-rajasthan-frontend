import type { ComponentProps } from 'react';
import { controlClass, describe } from './Field';

type Base = { id: string; error?: string | null; help?: string };

/** A line of text — a name. `autoComplete` from the caller (name, email…). */
export function TextInput({ id, error, help, className = '', ...rest }: Base & Omit<ComponentProps<'input'>, 'id'>) {
  return <input id={id} name={rest.name ?? id} {...describe(id, error, help)} {...rest} className={`${controlClass(!!error)} ${className}`} />;
}

/**
 * An Indian mobile number: a fixed +91 in front, ten digits, the number keypad on a phone, and
 * the phone's own autofill for a national number.
 */
export function PhoneInput({ id, error, help, className = '', ...rest }: Base & Omit<ComponentProps<'input'>, 'id' | 'type'>) {
  return (
    <div className={`flex items-stretch ${className}`}>
      <span className="grid min-h-12 place-items-center rounded-l-[var(--radius-sm)] border border-r-0 border-edge-strong bg-soft px-3 font-semibold text-subtle">
        +91
      </span>
      <input
        id={id}
        name={rest.name ?? id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        pattern="[6-9][0-9]{9}"
        {...describe(id, error, help)}
        {...rest}
        className={`${controlClass(!!error)} rounded-l-none`}
      />
    </div>
  );
}

/** Today's date in India (YYYY-MM-DD) — a date field's `min`. Outside the component: React
 *  renders must be pure, so the caller reads the clock and passes it in. */
export const indiaToday = (now: number) => new Date(now + 5.5 * 3600_000).toISOString().slice(0, 10);

/** A date — the phone's own picker; `min` (usually indiaToday) keeps past dates out. */
export function DateInput({ id, error, help, className = '', min, ...rest }: Base & { min: string } & Omit<ComponentProps<'input'>, 'id' | 'type' | 'min'>) {
  return (
    <input
      id={id}
      name={rest.name ?? id}
      type="date"
      min={min}
      {...describe(id, error, help)}
      {...rest}
      className={`${controlClass(!!error)} ${className}`}
    />
  );
}

/** A native select — the phone's own list, the most usable there is. */
export function Select({
  id,
  error,
  help,
  options,
  placeholder,
  className = '',
  ...rest
}: Base & { options: Array<{ value: string; label: string }>; placeholder?: string } & Omit<ComponentProps<'select'>, 'id'>) {
  return (
    <select id={id} name={rest.name ?? id} {...describe(id, error, help)} {...rest} className={`${controlClass(!!error)} ${className}`}>
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Several lines — "anything we should know". */
export function Textarea({ id, error, help, className = '', ...rest }: Base & Omit<ComponentProps<'textarea'>, 'id'>) {
  return (
    <textarea
      id={id}
      name={rest.name ?? id}
      rows={rest.rows ?? 4}
      {...describe(id, error, help)}
      {...rest}
      className={`${controlClass(!!error)} py-3 ${className}`}
    />
  );
}

/** Ten digits, starting 6–9 — an Indian mobile. Spaces and a +91 / 0 in front are forgiven. */
export function validIndianMobile(raw: string): string | null {
  const d = raw.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}
