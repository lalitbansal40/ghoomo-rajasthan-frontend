# Theme requirement traceability

Local implementation record, 22 October 2026. Production deployment, real-device and owner
acceptance are separate gates in [RELEASE.md](./RELEASE.md). A passing row never implies a
real payment, a genuine OS sleep cycle or authenticated production content approval.

| ID / prompt steps | Implementation | Evidence and practical scope |
|---|---|---|
| T01 / 0,2,6,8 | `tokens.json`, generated scoped `tokens.css`, `globals.css`, shared components and page families | 99-file [colour inventory](./COLOUR_INVENTORY.json), 90 semantic contrast pairs, 120 route views across both themes. Fixed brand/OG/artwork exceptions documented in implementation report. |
| T02 / 5 | `ThemeToggle`, `Header`, `MobileMenu`, `AccountButton`, bilingual theme dictionary | Upper chooser at 320/360/390/768/1280; Hindi text reflow; native radio arrows, Escape/focus return; outside-click and header-panel coordination. |
| T03 / 1,4 | Pure `theme.ts` local calendar policy and runtime | Six focused tests, exact 06:00/18:00 boundaries, India/New York/London, DST dates, 336 bootstrap combinations, manual priority and Auto clock frames. |
| T04 / 3,4,9 | Guarded preference storage, browser adapter and controller | Same-tab/cross-tab/clear/denied storage; actual EN→HI document reload, retained sentinel. Simulated persisted `pageshow` refresh passes; actual BFCache eligibility remains browser-dependent and is not inferred from a reload. |
| T05 / 3 | `ThemeBootstrap` in EN/HI/preview/global-not-found roots; deterministic SSR | Build/static classifications, 120-view hydration checks, cold CPU/network first-frame samples in explicit Light/Dark and six Auto/manual frame cases. No-JS stays light. |
| T06 / 4,9 | One runtime with owner-counted event installation and cleanup | Runtime start/stop/start and actual dev StrictMode replay: one visible Auto timer, none hidden/manual/disabled; simulated hidden/resume and forward/backward clock jumps. Actual overnight sleep is not claimed. |
| T07 / 6,9 | CSS-only root theme attributes; no keyed/remounted booking provider | Real BookingFlow with intercepted synthetic quote/lead responses, custom advance, typed phone/name/travellers and caret retained; no additional write requests. Existing OTP/cart/provider checkout logic unchanged; no real provider payment attempted. |
| T08 / 6,8,9 | Semantic controls, feedback, native scheme, focus, selection/autofill/print | Public/private shell/empty/error route matrix, emulated forced colours and400% equivalent320px reflow; zero serious/critical axe issues. Lower-severity region/heading findings recorded, not suppressed. Real Safari/iOS/Android autofill/native widgets require owner devices. |
| T09 / 7 | Scoped scene/motif paint, moon/stars and dunes | Both-theme screenshots; original motion exclusions/tests preserved; emulated reduced motion verified. No new animation loop or image filter. |
| T10 / 7,9 | Managed image and fallback logic retained; fixed logo plaque, OG/PDF exceptions | Four fake-private-S3 slots with real derivatives: 16 own-photo and 16 post-removal fallback views. Old API versions return404. No production media rights approval or CDN purge claimed. |
| T11 / 8,10 | Existing public policy, fares/auth/config and release scope retained | 349-page SEO check; 367-page link crawl/328 required URLs; read-only fares and 6-tour/4-safari contracts; no dependency/env/hosting config change. |
| T12 / 10 | Dedicated `theme-performance.mjs`; original Phase4 budget/history untouched | Fresh 21-report baseline; accepted 42-report results, byte measurements and run provenance in [VERIFICATION.md](./VERIFICATION.md) and [summary](./evidence/SUMMARY.json). |
| T13 / 2,10 | Shared token generator compatibility | App generated source SHA plus previously existing primitive constants synchronized; generator check and targeted Flutter analyze pass. Owner version/iOS changes preserved. No app appearance change required. |
| T14 / 11,12 | Shared `THEME_ENABLED` rollback, normal release generator, release runbook | Disabled bootstrap/runtime tests; final cleanup/status record in verification report; fresh production build required, local loopback artifact excluded. |
| T15 / 11,12 | Implementation, verification and release reports | Explicit local-only results; owner-authorized local commit record in verification report; no push or deploy. Authenticated content/provider and real-device/live checks listed separately. |

The matrix follows prompt steps0–12 and T01–T15. The public aggregate contains counts and
sanitized results. Raw local screenshots/Lighthouse reports remain under the reproducible
scratch paths in the verification report, separate from fixture credentials and snapshots.
