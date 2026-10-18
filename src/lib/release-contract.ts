import { publicPath, UTILITY_PATH } from './indexing-policy.ts';

/** A release decision is explicit, locale-specific and bound to the reviewed content. */
export type ReleaseApproval = {
  path: string;
  revision: string | number;
  approvedBy: string;
  approvedAt: string;
  evidence: string;
};

export function releasePath(path: string): boolean {
  return publicPath(path) && (path === '/' || /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(path));
}

export function bareReleasePath(path: string): string {
  return path === '/hi' ? '/' : path.replace(/^\/hi\//, '/');
}

export function localizedReleasePath(path: string, locale: 'en' | 'hi'): string {
  return locale === 'en' ? path : path === '/' ? '/hi' : `/hi${path}`;
}

/** No default approval, duplicate-path ambiguity, future approval or private/utility indexing. */
export function reviewedPair(input: {
  approvals: readonly ReleaseApproval[];
  path: string;
  revision: string | number;
  now?: number;
  analyticsUtility?: boolean;
}): boolean {
  const { approvals, path, revision, analyticsUtility = false } = input;
  const now = input.now ?? Date.now();
  if (!releasePath(path) || !Number.isFinite(now)) return false;
  const bare = bareReleasePath(path);
  if (UTILITY_PATH.test(path) && !(analyticsUtility && bare === '/enquiry')) return false;
  const packagePage = bare.startsWith('/packages/');
  if (packagePage ? !(typeof revision === 'number' && Number.isSafeInteger(revision) && revision > 0)
    : !(typeof revision === 'string' && /^[a-f0-9]{64}$/.test(revision))) return false;
  return (['en', 'hi'] as const).every((locale) => {
    const matches = approvals.filter((a) => a.path === localizedReleasePath(bare, locale));
    if (matches.length !== 1) return false;
    const a = matches[0];
    const time = typeof a.approvedAt === 'string' ? Date.parse(a.approvedAt) : NaN;
    return a.revision === revision && typeof a.approvedBy === 'string' && a.approvedBy.trim().length >= 2 &&
      typeof a.evidence === 'string' && /^docs\/[a-zA-Z0-9_./-]+$/.test(a.evidence) &&
      !a.evidence.split('/').includes('..') && typeof a.approvedAt === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(a.approvedAt) &&
      Number.isFinite(time) && new Date(time).toISOString().replace('.000Z', 'Z') === a.approvedAt.replace('.000Z', 'Z') && time <= now;
  });
}
