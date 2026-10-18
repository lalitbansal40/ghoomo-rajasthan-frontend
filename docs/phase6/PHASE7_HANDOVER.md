# Phase7 release candidate and owner/operator procedure

Commit status update: the later owner request to commit locally is recorded in [COMMIT_HANDOVER.md](COMMIT_HANDOVER.md). Earlier no-commit fields describe the verification snapshot; no push/deploy occurred.

Phase6 code/artifact readiness, actual target staging proof and real owner readiness are separate.
See COVERAGE and VERIFICATION for actual checked status. No production rollout, index activation,
GSC/GBP/social setting change, message or charge was performed by this work. Current safe site
launch flag remains false; stage unset/local/preview stays closed independently of canonical URL.

| Readiness | Actual status | Next required evidence |
| --- | --- | --- |
| R1 local implementation/technical verification/draft packs | Complete within authorized local scope; B1532/G39/A125 tests pass, final browser/lab gates pass | Review exact uncommitted source hashes and prepared drafts; factual approvals are not included |
| R2 actual isolated target | Pending | Owner supplies designated target/operator access and exact runtime/config; execute HTTPS/CDN/DB/IAM/native/device/load proof |
| R3 real content/accounts/operations/release | Pending | Named owner resolves D01–D12 and linked Phase4/5 decisions, approves exact revisions/assets/config, completes operator training and gives release instruction |

Latest build is a loopback fixture artifact. Do not deploy it. No new Git commit/push or real release
was performed by Phase6. B/G/A own source hashes are in evidence/changed-source.json; unrelated
owner app version/iOS and W handover changes remain separate.

## Required owner inputs before target/public actions

Resolve Phase5 P1–P8 and Phase4 G1–G7 for the chosen scope plus D01–D12. Need real approved EN/HI
revisions/terms/photo rights, named publisher/support owner, actual isolated target access/config,
DB transaction/index/private bucket/IAM/Sharp/native operator proof, legal/contact data, own accounts,
eligible G GBP/review template/permission decision and specific release instruction. A shared live
domain is not isolated staging, a signed app AAB is not installed-device proof, and public503 does
not identify disabled flag versus DB/runtime cause.

## Ordered candidate procedure

1. Inventory exact Git SHAs/working diff and selected immutable public revisions/rights approval.
   Build a fresh artifact against reviewed real API/canonical origins and target runtime, never
   the local audit artifact: local builds use loopback fixtures and are labelled not deployable.
2. Reuse Phase5 runbook to verify actual Mongo topology/indexes/native runtime/IAM/private media/
   new-slug/public edit/archive/revoke/preview HTTPS/CDN behavior in an authorized isolated target.
3. Verify actual Next16 target support, response statuses/headers, metadata/OG/sitemap handler,
   cold paths and no-store withdrawal on the chosen host. AWS docs currently name support through15;
   do not infer deployed16 support from local success. If blocked, keep hold and review host strategy.
4. Keep prelaunch held while deploying an explicitly authorized candidate. Observe successful
   actual commit, real source/headers/current catalog and private-path protections before opening.
5. Review launch switch + trusted NEXT_PUBLIC_DEPLOYMENT_STAGE=production + exact origins together.
   Staging/preview must set their own nonproduction stage even if canonical origin is production.
   Launch only approved pages: samples/held/safari/private retain independent holds.
6. Fetch production robots, sitemap, canonical/alternates, true404/503 and current media/OG. Compare
   complete eligible set. Catalog outage must return503 rather than a partial successful sitemap.
7. Enable analytics separately after account/privacy review. Check one safe public event and zero
   private direct/SPA telemetry. Stop collection if URL/PII denial fails; customer actions stay usable.
8. Use GSC_RUNBOOK for property/sitemap/priority inspections and permitted indexing requests.
   Successful fetch/Live Test does not prove indexing; record actual later Google crawl dates.
9. Owner posts only approved social/GBP assets with accurate ready landing pages; pause stale
   rates/rights. No automatic ad spend, outreach, WhatsApp broadcast or sample promotion.
10. G review worker remains off until eligible actual profile/template/sender/permission evidence,
    conservative booking/payment scope and exact activation watermark are approved. No old backlog.
11. Execute Day0/1/3/7 and Week2/4/6 monitoring; actual live payment/message tests need their own
    merchant/sender/test authorization and a controlled target.

## Stop/rollback

- Wrong canonical/stage/robots: halt promotion/submission and correct the specific candidate;
  no mass homepage redirects or unrelated noindex change.
- Catalog failure:503/no partial/sample fallback; restore dependency, preserve valid complete artifact.
- Wrong price or withdrawn rights: pause asset/promotion, use existing unpublish/revoke and verify
  all secondary surfaces; preserve history/booked snapshots, no guessed replacement/deletion.
- Private analytics leakage: disable tracker first, assess provider cleanup, preserve customer flow.
- Wrong-brand/duplicate review request: disable G worker; review redacted outcomes, never blind resend.
- Aggregate provenance issue: suppress affected public rating use; separate authorized reconciliation,
  no production recount/delete or invented score.
- Runtime/cache incompatibility: keep hold, rollback candidate or review hosting; no static export/
  downgrade/weakening of takedown protections.
- Low indexing/impressions: inspect exact URL/content/GSC evidence on cadence, no panic mass changes.

Review rollback includes schema/worker compatibility: disable affected new reads/senders before
reverting to unscoped old code; retain additive rating/claim/history data. Downloaded/social cached
pixels cannot be recalled. Prepared runbook/training examples are not completed owner training.

Training walkthrough (pending delivery): owner opens saved draft/preview, understands sample versus
on-request, approves exact revision/rights, edits without public overwrite, archives/revokes and checks
all surfaces, pauses a stale social card, records GSC live-versus-indexed result and review opt-out.
Record trainee/date/scenarios/acceptance before calling training complete.
