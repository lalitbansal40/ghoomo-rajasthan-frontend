# Phase6 executed verification

All evidence here is local/synthetic unless a primary documentation link is explicitly identified.
No authenticated isolated target, actual G account or approved real publication cohort was supplied.
R2 and R3 remain open. Implementation/draft readiness is not production release readiness.

## Source/runtime and reproducible setup

Starting source: B0c961a5, Gc224686, Ab3cd1fd, W5ab2af9; exact SHAs/dirty state and frozen plan
hash are in `evidence/source-baseline.json`. G/W instructions and installed Next16.3.4 metadata/
robots/sitemap/Route Handler/cache/not-found docs were read. No framework/dependency upgrade.

- G: Node24.19.0, Next16.3.4, React19.2.8. Build/typecheck/lint/unit tests use installed tooling.
- B final full regression: **verified Node20.20.2**, repository default15-second test timeout,
  in-memory Mongo and existing mocked outbound setup. Scoped checks also ran on Node24.19.0.
- Earlier cached executable was actually Node22.23.3 although its temporary log filenames said
  `node20`. Runtime was subsequently checked explicitly; those runs are not presented as Node20.
- Flutter uses the installed SDK/locked dependencies; no app version change, release upload or
  dependency upgrade. Owner `pubspec.yaml` version1.0.0+261 and iOS SwiftPM work were retained.

Local fixture command in B: `npx --no-install tsx scripts/ghoomo-local-fixture.ts` (memory API4211).
G build/start environment was supplied only on the CLI:

```sh
NEXT_PUBLIC_SITE_URL=https://ghoomorajasthan.com \
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:4211/api/v1 \
NEXT_PUBLIC_DEPLOYMENT_STAGE=local NEXT_PUBLIC_ANALYTICS_DOMAIN= \
GHOOMO_CATALOG_SOURCE=cms npm run build
# Start with the same values: npm run start -- -p 3315
```

**Never deploy this artifact.** It points at loopback test data. Actual `.env` files were not edited.
The memory fixture starts no production minute worker and creates no real booking/message/payment.

For post-launch positive/negative tests, an isolated temporary source copy injected only its own
launch flag and policy stage, while continuing to use the loopback API. `launched-fixture-policy.json`
labels those test-only changes. Real production config validation still rejects a loopback API;
real source launch remains false. CMS/sample test servers3316/3317 are not staging evidence.

## Tests and source/HTTP checks

| Executed check | Recorded result |
| --- | --- |
| B full Jest, verified Node20.20.2 |121 suites,1532 tests,1 snapshot pass |
| B changed-source ESLint, TypeScript and production TypeScript build |Pass; global legacy lint is not claimed clean |
| B focused review/process-role/transport/customer-message tests, Node24 |72 pass |
| G full unit suite |39 pass |
| G TypeScript, full ESLint, production CMS build |Pass |
| Flutter full unit/widget suite |125 pass |
| Flutter analyzer on2 changed files + new test |No issues |
| Flutter `build apk --debug --no-pub` |Pass; local compatibility artifact only |
| Full SEO checker |339 pages, no reported metadata failures |
| Independent home/HI internal-link graph |325 crawled,318 required reachable; no failures |
| Full prelaunch source audit |347 CMS paths, empty sitemap, noindex, no prelaunch JSON-LD |
| Injected launched CMS audit |347 paths, exact316 eligible sitemap URLs, independent holds retained |
| Injected launched sample audit |357 paths, exact312 eligible sitemap URLs; six sample details/hub held |
| All runtime variants |60 internal fragment references; normal/Googlebot/mobile parity on7 pages; four true404 controls; local trailing-slash308 |
| Catalog failure matrix |Actual handler/catalog reader:429,500 `ok:true`, malformed/oversize/duplicate/sample-contract/transport errors →503/no-store/Retry-After; valid empty stays distinct |
| API/JSON-LD source harness |Reject invalid HTTP/JSON; preserve valid empty; script-closing/Unicode/quotes round-trip safely; ineligible schema absent |
| Fare check against the **same loopback API** |All selected route/local figures match; insufficient fixture categories explicitly reported |
| Overlap diagnostic |300 texts,191 HMC source files,118 authored route intros; pass; not a Google penalty test |
| Analytics unit/browser harness |Private direct/SPA/history denial, sanitized URL/referrer/props, StrictMode dedupe, enquiry error/success, clicks and blocked collector pass |
| Campaign links |12 rows/six unique bounded public UTM URLs;200/clean canonical and contact/enquiry CTA in fixture |

Debug APK path/hash is in `evidence/check-results.json`; it is not the earlier signed Play AAB or
installed-device proof. Gradle/Kotlin migration and package availability notices were not suppressed
or treated as new dependency work. Runtime Node/SDK warnings require target review, not a silent upgrade.

Commands in G: `npm test`, `npx tsc --noEmit`, `npm run lint`, `BASE_URL=http://localhost:3315
npm run seo:check -- --all`, `links:check`, `API_URL=http://127.0.0.1:4211/api/v1` with
`fares:check`, `copy:check`, plus `node scripts/phase6-{inventory,marketing-kit,analytics-browser,
api-audit,interactions,runtime-audit}.mjs` as individual commands. Runtime audit uses
`AUDIT_MODE=launched` and optionally `AUDIT_CATALOG=sample` only with the injected copy servers.
Browser/API harnesses reuse already installed B esbuild/Resvg via createRequire; they install no
new project dependency and are not public application routes.

## Browser, lifecycle, visuals and performance

`ghoomo-flow.mjs`, with local `LAUNCHED_AUDIT_BASE`, checks40 views at360/390/768/1280 plus EN/HI
priced selectors, new slug after build, unpublished edit versus public snapshot, fragment preview
exchange/privacy/reopen/expiry, archive404, restore/revoke and catalog outage503. The launched-copy
sitemap follows new publish/archive/revoke without rebuild and becomes503/no partial XML on outage.
No browser flow makes a real charge or sends a real message. Preview tokens remain synthetic/local
and are excluded from committed evidence.

The general audit covers13 pages × three widths (39 views), serious/critical axe, console errors,
language/font policies, source status, overflow and reduced motion. Six extra EN/HI pages exercise
keyboard menu open/Escape/focus return and200% text reflow, including fixed CTA bounds. A real
overflow finding led to wrapping header/cards/buttons, bounded SVGs and readable stacked enlarged
CTAs; no CSS clipping was used to hide the problem.

Final eight-page metrics are in `evidence/browser/lighthouse-summary.json`: performance95–97,
accessibility100, best-practices100, CLS0–0.00055 and TBT2–9ms (rounded). All gates pass. Mobile Lighthouse12 uses three-run medians, gates95 performance/accessibility/
best-practices, CLS≤0.05 and TBT≤150ms. LCP is reported separately against the inherited1.5s target;
lab scores are not field Core Web Vitals or a ranking/indexing guarantee. A94 home result from an
intermediate run is preserved in `lighthouse-intermediate.json`; it must not be hidden or relabelled.

Selected screenshots and six-topic marketing contact sheet were actually opened for visual review.
EN/HI OG price/on-request captures are local fixtures. English lettering on Hindi OG remains the
documented Satori shaping fallback, not a claim of Hindi image localization. Draft brand art uses
the existing logo, Rozha One and actual design-token colors. No actual photo/content rights approval
is implied. Redundant generated screenshots may be omitted; measured view counts remain in reports.

After the final small contact-copy and one-day OG grammar corrections, the production build,
G39 tests/typecheck/lint passed again. Four EN/HI contact views at390/1280 verified200/noindex,
no overflow and no unsupported daily response promise. Final on-request/priced OG captures were
re-fetched and visually checked. These copy edits do not change the eight measured page layouts.

## Corrected checks and remaining limits

- An initial test selector named a nonexistent `jobs.test.ts`; correct review/customer-message
  suites were run. A new test's environment restore leak was fixed before final regression.
- Full regression caught the old process-role count after adding the separately disabled G job;
  the expected API/all counts are now23/27, with once-only role assertions retained.
- A Node22 run and follow-ups exposed an intermittent existing wallet query-budget assertion
  (5 operations versus4); diagnostic runs also passed. The wallet production code/test was not
  changed, thresholds not raised. Final default strict Node20 full suite passes. Actual chosen
  target/runtime proof, including this compatibility concern, remains R2.
- The first local fare check accidentally used the script's production API default, so its fixture
  mismatches were an invalid comparison. It made public reads only. The checker now requires an
  explicit matching API for loopback audits; the corrected fixture comparison passes. Rates unchanged.
- Audit assertions were corrected for equivalent root URLs with/without slash and intentionally
  absent private my-bookings canonicals. No eligible canonical/alternate check was relaxed.
- Price-chip contrast is checked after its existing color transition settles; the initial immediate
  transitional scan failed. Stable-state EN/HI priced checks pass. The keyboard harness was aligned
  with the actual menu, not an invented skip link; a fixture-restart timeout was rerun after readiness.
- The isolated-copy build initially rejected out-of-root dependency/public symlinks. Local clone
  copies fixed the test setup; production configuration/build policy was not weakened.

Real editorial fact/Hindi/legal approval, real chosen package/price/rights revisions, GSC/GBP/social/
provider setup, true isolated hosting/CDN/DB/IAM/native/device/load proof and owner training/release
remain pending. Current shared public live domains do not close those gates. No review provenance
repair, production recount/delete, external account mutation, launch, message or charge was done.
