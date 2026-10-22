# Theme feature — owner release and rollback

The website implementation uses existing production configuration. No new backend env variable,
API, database migration, S3 policy or payment credential is required for appearance.

## Release

1. Review website source changes and generated release files. Commit the enhancement when
   requested; keep root planning/prompt files and the owner's app-version/iOS changes out.
   Existing Phase4 commits on main are separate from these new changes. A token synchronization
   does not require an admin-app redesign/store release for the website feature to work.
2. Push the website commits through the normal owner workflow and let hosting build **fresh
   from source** with the existing real production site/API origins and deployment stage.
3. **Never upload this local `.next` artifact.** Local optimized checks used a loopback public
   snapshot API and local/noindex stage. Temporary fixture image permissions/configuration were
   solely for local fake-S3 checks and must not be deployed.
4. Confirm hosting reports Successful and the expected commit; do not use estimated elapsed
   deployment time as evidence. Check that serving origins are the real site/API.
5. Fresh browser: Auto should follow its own local06:00/18:00 schedule. Choose Dark at daytime,
   Light at night, refresh and switch EN/HI: manual preference must stay. Return to Auto and
   check current clock. Inspect the helper so business staff know this is device-local time.
6. Check phone320/360/390, tablet768 and desktop1280: logo/actions, visible upper chooser,
   native radio keyboard controls, Escape/outside focus and account/mobile panel coordination.
7. Check EN/HI home, a tour, place, safari, cab route, booking form and an error path. Test typing,
   toggling and returning from an existing payment page without submitting a real charge.
   Browser theme-colour/native input scheme must agree; no hydration/runtime errors or reset form.
8. Check current own photo + Commons fallback, alt/credits, fonts and links. Existing five-minute
   photo cache and immutable image caching remain unchanged. Removal does not erase already
   cached image bytes or physically delete S3 objects.
9. Verify production source/canonicals/robots/hreflang/sitemap retain the approved release scope.
   Local verification retained164 approved paths/328 EN+HI entries; use actual current catalog
   counts. Theme must not create query URLs, noindex policies or new approvals.
10. Read actual response CSP. The read-only home header observation during this task was200
    with no CSP header, but future hosting policies may differ. If inline scripts are restricted,
    use the host's supported static script hash for the exact `THEME_BOOTSTRAP` bytes; do not
    add broad unsafe-inline or convert the static site to per-request dynamic rendering.
11. Review actual iOS/Safari/Android native widgets, autofill/high contrast and owner visual
    preferences on available devices. Chromium emulation is not genuine device acceptance.
    Valid authenticated preview and positive inventory-dependent travel states require appropriate
    owner/test data; do not invent approved production content or use customer writes as a test.

## Rollback

- Set the shared `THEME_ENABLED` code constant false. Bootstrap/runtime force light, chooser
  is hidden, stored preference remains harmlessly intact. No environment change is needed.
- Regenerate/check release artifacts, build fresh and redeploy via normal workflow. Smoke-test
  a browser with saved Dark: it must remain light while feature is disabled.
- Alternatively redeploy the previous successful website release. Source reverts require normal
  source hash/manifest generation; do not hand-edit a revision to bypass the gate.
- Never clear all browser storage/auth cookies or alter bookings, customer accounts, payment
  settings, S3 objects or downloaded financial documents as a theme rollback.

No push, deployment, cloud policy edit or real customer booking/OTP/payment/message is authorized
merely by this runbook. Report the actual deployed commit and live results separately.
