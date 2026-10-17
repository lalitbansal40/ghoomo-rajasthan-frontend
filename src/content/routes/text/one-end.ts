import type { RouteText } from './types.ts';
import { ONE_END_A } from './one-end-a.ts';
import { ONE_END_B } from './one-end-b.ts';
import { ONE_END_C } from './one-end-c.ts';
import { ONE_END_D } from './one-end-d.ts';
import { ONE_END_E } from './one-end-e.ts';
import { ONE_END_F } from './one-end-f.ts';
import { ONE_END_G } from './one-end-g.ts';

/**
 * The 48 roads with one end in Rajasthan (Phase 3, batch 3) — Delhi, Delhi Airport, Noida,
 * Agra, Haridwar and Chandigarh to Jaipur, Ajmer, Kota and Sikar, and back. Split by the far
 * end so each file stays readable.
 */
export const ONE_END: Record<string, RouteText> = {
  ...ONE_END_A,
  ...ONE_END_B,
  ...ONE_END_C,
  ...ONE_END_D,
  ...ONE_END_E,
  ...ONE_END_F,
  ...ONE_END_G,
};
