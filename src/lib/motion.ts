import { PRIVATE_PATH } from './indexing-policy.ts';

/**
 * The desert scene's motion — one switch and one rule (owner, 21 Oct 2026, Ghoomo v2 Phase 4,
 * decision 1 A: the home hero fully alive, every other public page a small still scene, sand
 * settling between sections, a gold shine on buttons and cards).
 *
 * `MOTION_ON = false` is the rollback: every scene still drawn, nothing moves — the look stays.
 *
 * Where somebody is booking, paying, signing in or reading their own booking nothing ever moves
 * (a page that is doing a job is not decoration). Everywhere else motion is still only
 * `transform` / `opacity`, and stops for anyone whose phone asks for less (globals.css), off
 * screen, and in a hidden tab (data-play, components/scene/SettleOnView.tsx).
 */
export const MOTION_ON = true;

/** The enquiry form and the CMS preview are jobs too, though search may see them. */
const BUSY_PATH = /^\/(?:hi(?:\/|$))?(?:enquiry|preview)(?:\/|$)/;

/** May this page move at all? */
export function motionAllowed(path: string): boolean {
  return MOTION_ON && !PRIVATE_PATH.test(path) && !BUSY_PATH.test(path);
}

/** What a scene's wrapper carries: `data-motion="on"` lets its keyframes run (globals.css). */
export const motionAttr = (path: string): { 'data-motion': 'on' | 'off' } => ({
  'data-motion': motionAllowed(path) ? 'on' : 'off',
});
