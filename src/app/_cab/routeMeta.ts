import type { Metadata } from 'next';
import { dict, type Locale } from '@/i18n';
import type { GhoomoRoute } from '@/content/routes/list';
import { alternates } from '@/lib/seo';
import { routeFares } from '@/lib/route-fares';
import { routeDescription, routeIndexable, routeNames } from './RoutePage';

/**
 * A route page's title, description and robots. The title says what the page is in the words
 * people search ("Jaipur to Udaipur cab"), with as much after it as fits in 60 characters
 * (with the " · Ghoomo Rajasthan" the layout adds). A held route, or one without words of our
 * own, is noindex — before and after launch.
 */
export async function routeMetadata(route: GhoomoRoute, locale: Locale): Promise<Metadata> {
  const { from, to } = routeNames(route, locale);
  // "Ranthambore (Sawai Madhopur)" reads well on the page; in a title the bracket is dropped if it will not fit.
  const full = dict(locale).route.title(from, to);
  const short = dict(locale).route.title(from.replace(/ \(.*\)$/, ''), to.replace(/ \(.*\)$/, ''));
  const tails = locale === 'hi' ? [' — गाड़ी के हिसाब से किराया', ''] : [' — fares by car, sights on the way', ' — fares by car', ''];
  const suffix = locale === 'hi' ? ' · घूमो राजस्थान' : ' · Ghoomo Rajasthan';
  const base = [...(full + suffix)].length <= 60 ? full : short;
  const title = base + (tails.find((tail) => [...(base + tail + suffix)].length <= 60) ?? '');
  const { oneway } = await routeFares(route);
  return {
    title,
    description: routeDescription(route, oneway, locale),
    alternates: alternates(`/cab/${route.slug}`, locale),
    ...(routeIndexable(route) ? {} : { robots: { index: false, follow: true } }),
  };
}
