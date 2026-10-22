# Ghoomo Rajasthan — Auto, Light and Dark appearance

Implemented 21–22 October 2026, following `PLAN_ghoomo_dark_light_mode.md` and
`PROMPT_ghoomo_dark_light_mode.md` in the sibling backend workspace. This is a website feature
after Ghoomo v2 Phase 4. The previous light-only decision has been superseded by the owner.

## Customer behaviour

- Header Theme/थीम opens an accessible Auto/Light/Dark radio chooser. It stays visible outside
  the hamburger menu. Narrow screens use the language-switch row; 320px uses a smaller logo.
- Default Auto uses the visitor's device-local clock: 06:00 inclusive to18:00 exclusive light;
  otherwise dark. This is a fixed display schedule, independent of OS colour preference and
  the existing India-time booking rules. No location/time/sunrise service is called.
- A manual choice wins until Auto is selected again or the preference is cleared. The mode
  is saved under `ghoomo:theme:v1` for this browser/origin, including language root reloads.
- Auto rechecks at the next boundary or60seconds, whichever is sooner, while visible. Hidden
  documents and manual modes have no schedule timer. Focus/pageshow/visibility resume recalculate
  immediately, with calendar-based local dates rather than a fixed24-hour-day assumption.
- Same-origin tabs synchronize storage changes/removal/clear. Denied storage still permits an
  in-memory manual selection in the current document; it does not promise persistence.
- Theme changes update CSS and small control state. They do not reload the page, change URLs,
  remount booking/auth/cart components or initiate booking/payment/lead/auth requests.
- Without JavaScript, content and native controls stay readable light. The chooser's fixed
  footprint remains but its inactive control is hidden. No page-wide mounted-state gate exists.

## Architecture

| Source | Responsibility |
|---|---|
| `src/lib/theme.ts` | Pure modes/validation/local schedule, one rollback switch, trusted bootstrap source and clock runtime |
| `src/lib/theme-browser.ts` | One document runtime, guarded storage, subscriptions, events, theme attributes and browser chrome |
| `src/components/theme/ThemeBootstrap.tsx` | Synchronous head script, before first body paint |
| `ThemeController.tsx` | Runtime lifecycle/navigation refresh; renders no wrapper around page children |
| `ThemeToggle.tsx` | Hydration-safe external-store subscriber, radio chooser, keyboard/focus/outside-click behaviour |
| `src/lib/header-panel.ts` | Small panel coordination event, independent of booking/account state |
| `src/i18n/theme.ts`, `en.ts`, `hi.ts` | Bilingual copy, including device-time explanation; small error-boundary copy import |
| `src/design/tokens.json` / `scripts/tokens.mjs` | Fixed primitives plus generated scoped web roles |
| `scripts/contrast.mjs` | Existing fixed-palette checks and45 semantic pairs per theme |

Every HTML entry integrates the bootstrap/controller: English root, Hindi root, private locale
preview root and global-not-found. Root attributes have targeted hydration-warning suppression;
public pages/root layouts remain server components. No request cookies/headers are read for theme.
Fonts, preload scope, preview privacy and existing release policy are preserved.

React/Next can hoist another static `theme-color` tag during hydration/navigation. The browser
integration normalizes it to one tag in the selected theme. A narrowly filtered head observer
handles later theme-colour mutations and is disconnected on cleanup. It does not watch/re-render
the page body. The actual EN→HI full-root reload, one-tag invariant and selected colour were tested.

## Palette and surface coverage

Fixed brand `color` primitives remain unchanged. Web semantic roles separate text/link/header
colour from filled CTAs, surface backgrounds, input borders, status panels, focus and artwork.
No global white/blue primitive inversion is used. Main dark values: navy `#11151F`, surface
`#1B2230`, warm text `#E9E2D6`, secondary `#BDB4A7`, links `#AFC6FF` and gold focus `#F0CC7E`.

Filled dark primary buttons deliberately use `#31539A` with white labels. This is an adjustment
from the initial pale-fill candidate, preserving existing white-on-solid CTA/section semantics
with measured contrast. Pale blue remains the dark link role. Inputs use a stronger semantic
control border, including the light theme, to identify controls clearly.

Shared UI and raw booking/travel fields were migrated by role. The inventory is in
[`COLOUR_INVENTORY.json`](./COLOUR_INVENTORY.json). It covers99 existing colour-relevant source
files; new theme modules are mapped above. Status text, borders, autofill, caret/selection,
native control colour-scheme, contact popup/FAB, menus, tables, map, errors and styleguide are covered.
The styleguide includes independently scoped day/night examples without changing saved preference.

Night artwork uses scoped SVG paint, a pale moon treatment/static stars and dark dunes. Geometry,
photo dimensions and scene timing remain stable. Logo artwork retains its colours on a light
plaque when needed. Fixed car/logo imagery, decorative gold rating stars, raw palette swatches,
OG/social card design and generated brand geometry are intentional exceptions. Photos are not
filtered or inverted; attribution/source/rights and managed-photo fallback logic are unchanged.

Reduced-motion, hidden/offscreen pause, `MOTION_ON`, `.motion-off`, private/task-route exclusions
and one-time settle remain independent of theme. Printing uses light roles and hides theme/navigation
controls. Financial PDF generation and third-party Razorpay/UPI presentation were not changed.

## Repository scope and rollback

G contains website source/tests/audits/docs and regenerated release artifacts. B backend feature
code and W HelloMyCabs website are unchanged. A only synchronizes generated token output:
its source SHA plus three already-existing Phase4 primitive constants (`sand400`, `dusk300`,
`dusk500`) now appear. No Flutter brightness/palette behaviour, app version or iOS owner edits changed.

`THEME_ENABLED=false` in `src/lib/theme.ts` forces light and hides the chooser without deleting
stored preferences or adding a production env variable. Disabled-bootstrap/runtime behaviour is
covered by a focused test. Normal release regeneration/fresh build is required after source edits.

See [`VERIFICATION.md`](./VERIFICATION.md) for actual measured results and limits, and
[`RELEASE.md`](./RELEASE.md) for owner deployment/rollback steps. Local work does not prove a live release.
