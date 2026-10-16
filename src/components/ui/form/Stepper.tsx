'use client';

import { Icon } from '../Icon';

/**
 * How many — people, days. − and + of 48 px either side of the number; the number is announced
 * when it changes (aria-live). A hidden input carries it in a form.
 */
export function Stepper({
  id,
  name,
  value,
  onChange,
  min = 1,
  max = 50,
  decreaseLabel,
  increaseLabel,
}: {
  id: string;
  name?: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  decreaseLabel: string;
  increaseLabel: string;
}) {
  const btn =
    'grid h-12 w-12 place-items-center rounded-full border border-royal-200 bg-white text-royal-700 hover:bg-royal-50 disabled:opacity-40';
  return (
    <div className="flex items-center gap-3" role="group" aria-labelledby={`${id}-label`}>
      <button type="button" className={btn} aria-label={decreaseLabel} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        <Icon name="minus" />
      </button>
      <output id={id} aria-live="polite" className="min-w-10 text-center text-h3 tabular-nums">
        {value}
      </output>
      <button type="button" className={btn} aria-label={increaseLabel} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        <Icon name="plus" />
      </button>
      <input type="hidden" name={name ?? id} value={value} />
    </div>
  );
}
