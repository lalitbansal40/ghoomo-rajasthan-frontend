import { RELEASE_APPROVALS } from './release-manifest';
import { STATIC_CONTENT_REVISION } from './release-content';
import { localizedReleasePath, reviewedPair, dynamicReleasePath } from './release-contract';

export function releaseEligible(path: string, locale: 'en' | 'hi', eligible = true, revision?: number): boolean {
  return eligible && reviewedPair({ approvals: RELEASE_APPROVALS, path: localizedReleasePath(path, locale),
    revision: dynamicReleasePath(path) ? revision ?? 0 : STATIC_CONTENT_REVISION });
}

export function releaseAnalyticsEligible(path: string, revision?: number): boolean {
  return reviewedPair({ approvals: RELEASE_APPROVALS, path,
    revision: dynamicReleasePath(path) ? revision ?? 0 : STATIC_CONTENT_REVISION,
    analyticsUtility: true });
}
