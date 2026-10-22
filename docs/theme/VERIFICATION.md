# Theme implementation — verification record

21–22 October 2026. Source baseline: website main `1b78554`. This record describes local tests,
not production deployment or owner/device acceptance. New feature source remains separate from
the previously committed Phase4 release. Final commit status is reported to the owner explicitly.

## Completed functional checks

| Check | Result |
|---|---|
| Baseline website suite |119 tests pass; TypeScript/lint/contrast clean|
| New suite |125 tests pass, including6 theme tests;336 bootstrap/policy hourly/storage combinations within one test|
| Local schedule |Exact06:00/18:00 boundaries, manual priority, invalid/missing preferences, India/overseas/DST dates|
| Runtime |One visible Auto timer, zero hidden/manual timers, resume/clock changes, denied write preserves manual selection|
| Rollback |Disabled bootstrap/runtime forces light despite saved Dark, no timer|
| Palette |Existing fixed-palette checks plus45 semantic text/control/focus pairs per theme pass|
| Optimized build |Pass with isolated public snapshot, real canonical origin and local/noindex deployment stage|
| Source release |164 approved paths/328 EN+HI entries; generated revision tied to final source, no new approved scope|
| Full route browser matrix |30 representative paths ×2 themes ×2 widths =120 views; no serious/critical axe failures, overflow or hydration/page errors|
| Additional responsive |320/390/768 chooser positioning and200% Hindi text reflow pass|
| High contrast/reflow |Chromium forced-colours in both themes; Space/Escape/focus pass at320 CSS pixels (1280px at400% equivalent reflow)|
| Initial paint |Auto/manual priority frame samples; separate4× CPU/throttled-network cold Light/Dark frame samples pass|
| Storage/UI |Native keyboard radio/Escape, same-tab and cross-tab update/clear, denied storage, no-JS fallback pass|
| Actual booking component |Mocked BookingFlow quote/custom advance, phone/name/travellers survive theme change; caret preserved across Auto change; no additional write requests|
| Navigation/browser chrome |Actual EN→HI full-root link reload preserves manual Dark and sentinel storage; exactly one selected theme-colour tag|
| Visibility/motion |Simulated hidden/resume + clock jump, actual reduced-motion browser setting pass; existing private/scene policy tests pass|
| Dev lifecycle |Actual isolated `next dev` StrictMode effect replay:4 timers scheduled,3 cancelled, exactly1 pending; manual0/Auto1; typed input retained|
| Scroll/restore |500px scroll and document height stable across theme change; unrelated key ignored; simulated persisted `pageshow` recalculates night|
| Own photos |Four fake-private-S3 slots, real Sharp derivatives,16 EN/HI phone views across Light/Dark pass|
| Removal fallback |Four removals, old API versions404;16 fresh EN/HI phone views restore stock photos in both themes|
| SEO |349 source pages pass local/prelaunch-stage metadata/schema checks|
| Internal navigation |367 pages crawled, all328 required URLs reachable|
| Fare/price contracts |Read-only fare comparison pass;6 tours +4 safari locations match local backend contracts|
| Flutter token sync |Generator check and targeted generated-file analyze pass; no Flutter appearance change|

Browser matrix covers home, tours/list/detail, destinations, cab, safari, about/contact/legal,
photo credits, booking/login/my-bookings, styleguide, global/in-layout404, unauthorized preview
and enabled travel entry/booking shells. Private positive states with unavailable authenticated
preview/inventory data and actual provider-hosted checkout are not claimed as live-tested.

All booking writes in the component audit were intercepted locally, including synthetic quote
and lead responses. No production database/S3 or external customer messages/payments were used.
Hidden state and persisted `pageshow` were simulated; no actual overnight OS-sleep/BFCache
eligibility result is claimed. Forced colours were emulated in Chromium;320 CSS pixels checks
the400% equivalent reflow viewport, not a genuine browser zoom operation. Real iOS/Safari/
Android hardware/native high-contrast interaction and full owner visual acceptance remain owner checks.

## Performance and artifact sizes

Fresh pre-feature baseline contains21 raw reports (seven paths ×three mobile runs). Final
accepted post-feature measurement contains42 raw reports (both explicit themes, same seven paths,
three runs each). There are45 final/recheck reports retained, plus earlier harness trials. The
14 accepted case medians pass the gate; original failures and replacements are disclosed below.

| Theme | Path | Perf | A11y / BP | LCP ms | Δ LCP ms | CLS | TBT ms | Δ JS B | Δ CSS B |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|
|light|`/`|95|100 / 100|2988.2|+71.2|0|3.0|3198|1038|
|light|`/packages`|95|98 / 100|2994.9|+3.9|0|4.0|3198|1038|
|light|`/packages/lakes-and-forts`|96|100 / 100|2768.2|+83.1|0|4.0|3215|1038|
|light|`/desert-safari`|95|100 / 100|2909.4|+71.1|0|1.5|3200|1038|
|light|`/destinations/jaipur`|95|100 / 100|2844.3|+6.2|0|6.0|3214|1038|
|light|`/cab/jaipur-to-udaipur`|96|100 / 100|2838.1|+1.4|0|3.0|3219|1038|
|light|`/hi`|95|100 / 100|2998.7|+8.7|0|8.0|3202|1038|
|dark|`/`|94|100 / 100|3024.4|+107.4|0|7.5|3198|1038|
|dark|`/packages`|95|98 / 100|2991.1|+0.1|0|3.0|3198|1038|
|dark|`/packages/lakes-and-forts`|96|100 / 100|2768.4|+83.3|0|3.5|3215|1038|
|dark|`/desert-safari`|95|100 / 100|2912.3|+74.0|0|5.0|3200|1038|
|dark|`/destinations/jaipur`|95|100 / 100|2847.6|+9.5|0|6.0|3214|1038|
|dark|`/cab/jaipur-to-udaipur`|95|100 / 100|2864.2|+27.6|0|13.0|3219|1038|
|dark|`/hi`|95|100 / 100|2999.5|+9.5|0|5.0|3202|1038|

All rows use three-run medians, not the best run. A11y/BP are accessibility/best-practices.
The aggregate records each case’s raw score/LCP range; an individual run can be below its case
median threshold. Accepted case medians: performance94–96, CLS0, TBT1.5–13ms; maximum median
LCP increase107.4ms. These are local lab results.

The first complete42-report run failed **Dark `/hi`**: median94 (required95), LCP3119.7ms,
TBT21ms; individual scores92/94/94. Unrelated CPU-heavy processes were observed on the shared
machine. The unchanged artifact was rechecked as one complete three-run Dark `/hi` case in a
separate directory after task dev probes stopped: median95, LCP2999.5ms, TBT5ms. This entire
case replaces the initial case in the accepted table; no individual best metrics were mixed.
Both results and all raw reports remain available. Other13 cases were retained unchanged.

One earlier collection was interrupted by a Chrome protocol/session closure before Hindi
reports were written. Resume validates and reuses only complete three-report cases with theme
proof; incomplete cases are archived before repeating all three runs. Do not infer a complete
pass from an incremental `summary.json`: require14 rows and42 accepted raw reports.

Measured size deltas against the fresh baseline:

| Measure | Actual | Budget/result |
|---|---:|---|
| Synchronous bootstrap |419 raw /288 gzip bytes|≤1KiB gzip target met|
| Added JS compressed transfer |3198–3219 bytes (3.12–3.14KiB)|≤4KiB hard limit met; **3KiB target exceeded by126–147 bytes**|
| Added stylesheet compressed transfer |1038 bytes per measured page|≤6KiB target met|
| Generated tokens alone, gzip delta |1283 bytes|Diagnostic only; full measured stylesheet delta above includes removed/replaced rules|

No additional theme request/font/dependency was introduced. Script/stylesheet numbers come from
Lighthouse resource-summary transfer sizes, including shared chunks, not an isolated hand-minified
module estimate. The bootstrap gzip figure is a direct gzip measurement.

Gate: home≥94, other six≥95, CLS0, median LCP regression≤150ms, existing A11y/best-practices≥95
and TBT≤150ms; theme JavaScript target≤3KiB/hard maximum4KiB compressed transfer against this
fresh baseline. Bootstrap target≤1KiB gzip; additional CSS target≤6KiB gzip. The historical
Phase4 original2KiB delta gate/evidence remains unchanged; this feature has its own comparison.

No field Core Web Vitals, real-device speed guarantee or indexing improvement is claimed.
Every recheck must retain its preceding rejected run and explain the replacement case.

## Evidence and reproduction

Scratch evidence: `/private/tmp/ghoomo-theme/` (raw reports/screenshots/logs/private fixture token).
Do not add the token, snapshot, generated local build or raw customer data to source control.
The public checked-in aggregate and inventory contain no credentials.

Environment: Node24.19.0, Next16.3.4, React19.2.8, installed Puppeteer24.43.1,
HeadlessChrome155.0.0.0, Lighthouse12. Both baseline and theme runs use the same machine,
optimized local snapshot catalog and Lighthouse mobile simulation. Source revision:
`503af616f98c7e209f25b6845b5fb4c1a0079c82a58f8d33a8968e6118d174d5` (451 hashed files).

The route matrix includes these 30 paths, each in Light/Dark at360 and1280 CSS pixels:

```text
/  /hi  /packages  /hi/packages
/packages/lakes-and-forts  /hi/packages/lakes-and-forts
/destinations/jaipur  /hi/destinations/jaipur
/cab/jaipur-to-udaipur  /hi/cab/jaipur-to-udaipur
/desert-safari  /hi/desert-safari  /about  /hi/about  /contact  /hi/contact
/privacy  /photo-credits  /booking  /hi/booking  /login  /hi/login
/my-bookings  /styleguide  /hi/styleguide  /missing-theme-page
/packages/missing-theme-page  /preview/en/packages/missing-theme-page
/tours  /travel-bookings
```

Axe lower-severity findings were reviewed: `region` (moderate) in111 views concerns floating
CTAs/contact controls outside landmarks; `heading-order` (moderate) in8 package-list views
concerns the existing heading sequence. These are retained in raw reports and the aggregate,
not suppressed or counted as zero findings. They are not theme contrast failures. The package
Lighthouse accessibility score is98 in both the fresh baseline and theme measurements.

The build emits9 `metadataBase` fallback warnings; the source metadata/navigation checks pass.
This feature does not change the existing fallback metadata policy. Baseline simulated mobile
LCP is already2.69–2.99s, above the existing1.5s aspirational warning threshold; the theme gate
measures regression separately. Do not report these lab values as field Core Web Vitals.

From G, using the existing isolated local server:

```sh
BASE_URL=http://localhost:3320 node scripts/theme-audit.mjs --out=/absolute/theme-browser-output
BASE_URL=http://localhost:3320 node scripts/theme-edges.mjs --out=/absolute/theme-edges-output
BASE_URL=http://localhost:3321 node scripts/theme-lifecycle.mjs --out=/absolute/theme-dev-output
BASE_URL=http://localhost:3320 node scripts/theme-performance.mjs --baseline=/absolute/baseline-summary.json --out=/absolute/theme-performance-output
npm test
npx tsc --noEmit
npm run lint
npm run contrast
npm run release:check
```

Use `API_URL` matching the snapshot for fare/price comparisons. The existing baseline audit's
seven-page list and3-run median method were used. Lighthouse12 follows existing repo tooling;
the performance harness preloads the selected preference, explicitly clears HTTP cache and
disables Lighthouse storage reset. It captures actual mode/theme while the measured document
is open; a missing/wrong theme fails rather than counting a Light run as Dark.

Initial rejections retained in scratch:320px chooser edge overflow (anchoring fixed), Next
duplicate theme-colour tags (normalization fixed), and test-harness issues involving hidden
tab RAF waits, locally mocked CORS/preflight, post-audit target closure and private-loopback
image permissions. A temporary unignored dev output also caused a Tailwind scan failure;
the isolated output was excluded and removed, not patched into product CSS.

Temporary local-image allowances, local-IP optimizer permission, dev output path and TS/ignore
changes must be restored before completion. Local photo-cache reset was for fresh fallback
verification, not a claim of remotely purging immutable browser/CDN bytes.

See [`IMPLEMENTATION.md`](./IMPLEMENTATION.md), [`COLOUR_INVENTORY.json`](./COLOUR_INVENTORY.json)
and [`RELEASE.md`](./RELEASE.md). See also [CHECKLIST.md](./CHECKLIST.md), [evidence/SUMMARY.json](./evidence/SUMMARY.json) and
[evidence/REPORT_HASHES.json](./evidence/REPORT_HASHES.json). Cleanup status is recorded below.

## Final additional evidence

- `edges-complete-recheck/result.json`: extended paint/locale/scroll/resume/forced-colours/reflow checks.
- `dev-lifecycle/result.json`: actual StrictMode replay, timer cancellation and typed-input retention.
- `final-styleguide-smoke.json`: final optimized artifact, independent Light/Dark examples and saved mode unchanged.
- `performance-final/`: original42 reports and failing full-run summary.
- `performance-recheck-dark-hi/`: complete three-report replacement case.
- `baseline/raw/`:21 pre-feature reports.
- `browser-verified/`:120 route screenshots and lower-severity axe findings.
- `photo-own.json`, `photo-fallback.json`:16 views each; images/screenshots under the scratch root.
- `release-cleanup.log`: final451-file source hash/328-entry gate check after all source changes.

All paths above are relative to `/private/tmp/ghoomo-theme/`. A later extension of the resume
probe initially set the fake clock13 hours beyond a locale reload’s reset17:00, which is06:00,
not night. That rejected harness run is retained in `edges-complete.log`; setting an explicit
23:00 test instant fixes the assertion. No product clock/policy code changed for that correction.

## Cleanup and repository status

Final cleanup passed: owned optimized/dev servers and the fake-S3/memory-Mongo fixture stopped;
ports3320/3321/4219/4220 have no listeners. Temporary `.next-theme-photos` output is removed.
`next.config.ts`, `tsconfig.json`, `.gitignore`, package/dependency files have no task diff.
Generated `next-env.d.ts` references were restored from development paths to final `.next/types`.
Only task-owned processes were stopped; unrelated owner processes were preserved.

Full ESLint passed again after the final audit-script changes; final `git diff --check` is clean.
Release check still binds451 source files and328 entries to the revision above. Token generator
check passes. The original125-test/TypeScript/build results remain applicable: no product source
changed after those checks and the final measured build.

The table records the pre-commit verification snapshot, not the later commit status.

| Repository | Branch / verification HEAD | Task scope/status at verification |
|---|---|---|
| Ghoomo frontend |main / `1b78554`|Theme source, audits, docs and generated release files are uncommitted|
| Backend |main / `61bf164`|No feature-code change; existing untracked root plans/prompts preserved|
| Flutter app |main / `a21fae8`|Generated token output only; owner pubspec version/iOS SwiftPM changes preserved|
| HelloMyCabs website |main / `b424cbf`|Untouched; owner's untracked SEO handover preserved|

No theme commit existed at the verification snapshot above. The owner subsequently authorized
local commits: website implementation `f73177c`, shared app-token sync `0bfd69f`. Audit/report
files are committed next; the generated release artifacts form a separate final website commit.
Use `git log` for the final website HEAD. No push or deployment occurred. A fresh normal
production build and owner live/device acceptance remain separate from local verification.
Never upload the loopback/noindex local artifact. No real customer write, OTP, charge, message,
production photo mutation, database reconciliation or cloud-policy change was performed.
