# Taking Ghoomo Rajasthan out of search — the whole site, one page, or now

Launched 20 Oct 2026 (Ghoomo v2 Phase 1). Each way back below was tested on a production-like
build before launch.

## The whole site

1. `src/lib/site.ts` → `export const SITE_LAUNCHED = false;`
2. Commit, push → Amplify builds and deploys.
3. Result (tested): `robots.txt` = `Disallow: /`, every page `noindex, nofollow`, no structured
   data, the sitemap empty. The build log shows `"gate":{"mode":"held",…}`.

Search engines drop the pages over the following days; for faster removal use the last section.

## One page

1. Remove its English path from `docs/release/approved-pages.json` (its Hindi twin goes with it).
2. Commit, push, deploy. The page turns `noindex` and leaves the sitemap; nothing else changes.

## Out of Google now (hours, not days)

Search Console → **Removals** → **New request** → the URL (or a prefix, e.g.
`https://ghoomorajasthan.com/packages/`). Temporary (about six months) — do the steps above as
well, or the page comes back.

## The www redirect

`src/proxy.ts` (with `src/lib/canonical-host.ts`) sends `www.ghoomorajasthan.com` to
`ghoomorajasthan.com` with a 301. If it misbehaves: revert the commit
`site: www redirects to ghoomorajasthan.com` and push; or turn it off at once by making
`canonicalRedirect` return `null`.

## What NOT to do

- Do not edit `src/lib/release-manifest.ts` by hand — it is regenerated on every build from
  `approved-pages.json`.
- Do not change the gate (`src/lib/release-contract.ts`, `scripts/phase7/launch-gate.mjs`) to
  "fix" a failing build: a failing gate means the list or the launch switch is wrong.
