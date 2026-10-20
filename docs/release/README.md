# Search release — how pages join (and leave) search

- **The list:** `docs/release/approved-pages.json` — the owner's approved pages (English paths;
  Hindi added). Evidence: `PHASE1_APPROVAL.md`.
- **Every build** binds the list to that build's content revision (`npm run prebuild`:
  `release-content --hash-only` → `release-approve` → the unchanged gate). A code change does
  **not** take a page out of search, and does not fail the build.
- **The switches:** `SITE_LAUNCHED` (`src/lib/site.ts`) and, on Amplify,
  `NEXT_PUBLIC_DEPLOYMENT_STAGE=production` with `NEXT_PUBLIC_SITE_URL=https://ghoomorajasthan.com`.
  All three are needed for anything to be searched.

## Adding pages

| New page | What to do |
|---|---|
| A new place or a new cab road with its own text | Add its path to `approved-pages.json` (the owner approves the list change) |
| `/tours`, `/hotels`, `/group-tours` once they have items | Add the listing path; the script refuses them while they are in its `REFUSED` set — take them out of it in the same commit |
| A real tour replacing a sample | Same path, nothing to do: set `isSample: false` / the real price, the badge goes and the price is offered |
| A tour from the CMS | It carries the CMS's own revision — approve it with that revision (extend `release-approve.mjs` for CMS items when the first one is published) |
| Real safari rates | `SAFARI_IS_SAMPLE = false` in `src/content/safari.ts` — the page keeps its approval |

## Taking pages out
See `ROLLBACK.md`. Watching after launch: `MONITORING.md`.

## Checks
`npm test` (release script tests included), `npm run release:check`, and on a running build:
`npm run seo:check -- --all`, `npm run links:check`, `npm run audit` — all read the release
state from the site (launched → the approved list indexes, nothing else does).
