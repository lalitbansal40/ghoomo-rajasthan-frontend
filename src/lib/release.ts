import { RELEASE_APPROVALS } from './release-manifest';
import { STATIC_CONTENT_REVISION } from './release-content';
import { localizedReleasePath, reviewedPair } from './release-contract';

export function releaseEligible(path: string, locale: 'en' | 'hi', eligible = true, revision?: number): boolean {
  return eligible && reviewedPair({ approvals: RELEASE_APPROVALS, path: localizedReleasePath(path, locale),
    revision: path.startsWith('/packages/') ? revision ?? 0 : STATIC_CONTENT_REVISION });
}

export function releaseAnalyticsEligible(path: string, revision?: number): boolean {
  return reviewedPair({ approvals: RELEASE_APPROVALS, path,
    revision: path.replace(/^\/hi(?=\/|$)/, '').startsWith('/packages/') ? revision ?? 0 : STATIC_CONTENT_REVISION,
    analyticsUtility: true });
}
