import type { RouteText } from './types.ts';
import { BEYOND_A } from './beyond-a.ts';
import { BEYOND_B } from './beyond-b.ts';
import { BEYOND_C } from './beyond-c.ts';
import { BEYOND_D } from './beyond-d.ts';

/**
 * Hello My Cab's roads with neither end in Rajasthan (Phase 3, batch 4 — owner: "saare
 * routes"). Each page also points the traveller into Rajasthan. The six held NCR hops have
 * no words, so they stay out of search (content/routes/list.ts HELD).
 */
export const BEYOND: Record<string, RouteText> = { ...BEYOND_A, ...BEYOND_B, ...BEYOND_C, ...BEYOND_D };
