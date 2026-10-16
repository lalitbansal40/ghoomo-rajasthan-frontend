import { dict, type Locale } from '@/i18n';
import { Icon } from './Icon';

/** What the price covers ✓ and what it does not ✗ — two lists side by side, one under the other on a phone. */
export function IncludesList({ includes, excludes, locale }: { includes: readonly string[]; excludes: readonly string[]; locale: Locale }) {
  const t = dict(locale);
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <h3 className="text-h3 text-success">{t.pkg.includes}</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {includes.map((x) => (
            <li key={x} className="flex gap-2">
              <Icon name="check" className="mt-0.5 text-success" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-h3 text-maroon-600">{t.pkg.excludes}</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {excludes.map((x) => (
            <li key={x} className="flex gap-2">
              <Icon name="cross" className="mt-0.5 text-maroon-600" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
