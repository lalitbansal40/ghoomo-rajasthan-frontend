import type { ReleaseApproval } from './release-contract';

/**
 * Intentionally empty: no real content/rights approval has been supplied.
 * Add BOTH concrete locale paths only after the named owner accepts the exact revision and
 * rights/terms evidence. Static revision comes from release-content.ts; packages use the current
 * approved CMS contentRevision. This file cannot override sample/held/publication restrictions.
 */
export const RELEASE_APPROVALS: readonly ReleaseApproval[] = [];
