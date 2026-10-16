import { dict, type Locale } from '@/i18n';
import type { DayPlan } from '@/content/packages';
import { Icon } from './Icon';

/**
 * A tour, day by day: a gold day-number on a line that joins the days, the day's title, then
 * morning / afternoon / evening and where the night is spent. From content/packages DayPlan.
 */
export function ItineraryTimeline({ days, locale }: { days: DayPlan[]; locale: Locale }) {
  const t = dict(locale);
  const parts: Array<[keyof DayPlan, string, 'sun' | 'clock' | 'moon']> = [
    ['morning', t.pkg.morning, 'sun'],
    ['afternoon', t.pkg.afternoon, 'clock'],
    ['evening', t.pkg.evening, 'moon'],
  ];
  return (
    <ol className="relative">
      {days.map((d, i) => (
        <li key={d.day} className="relative flex gap-4 pb-8 last:pb-0">
          {i < days.length - 1 ? (
            <span aria-hidden className="absolute left-5 top-11 bottom-0 w-0.5 -translate-x-1/2 bg-gold-300" />
          ) : null}
          <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-500 font-bold text-ink ring-4 ring-ivory">
            <span className="sr-only">{t.pkg.day(d.day)}</span>
            <span aria-hidden>{d.day}</span>
          </span>
          <div className="min-w-0 flex-1 pt-1.5">
            <h3 className="text-h3 text-royal-700">{d.title}</h3>
            <dl className="mt-2 flex flex-col gap-2">
              {parts.map(([key, label, icon]) =>
                d[key] ? (
                  <div key={key} className="flex gap-2">
                    <dt className="flex w-28 shrink-0 items-center gap-1.5 text-small font-semibold text-gold-700">
                      <Icon name={icon} size={16} />
                      {label}
                    </dt>
                    <dd className="min-w-0">{d[key] as string}</dd>
                  </div>
                ) : null,
              )}
              {d.stay ? (
                <div className="flex gap-2">
                  <dt className="flex w-28 shrink-0 items-center gap-1.5 text-small font-semibold text-maroon-600">
                    <Icon name="mapPin" size={16} />
                    {t.pkg.stay}
                  </dt>
                  <dd className="font-semibold">{d.stay}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </li>
      ))}
    </ol>
  );
}
