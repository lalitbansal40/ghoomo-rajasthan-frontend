import type { GhoomoRoute } from './list.ts';
import { ROUTE_TEXT } from './text/index.ts';

/**
 * Whether search engines may see a route page: it has words of our own, and it is not held.
 * The route page's robots, its structured data and the sitemap all ask this one question.
 */
export const routeIndexable = (route: GhoomoRoute) => !route.held && Boolean(ROUTE_TEXT[`${route.pickup}-${route.drop}`]);
