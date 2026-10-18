# Owner decisions

All actual new owner approvals remain pending unless existing evidence is explicitly linked. Phase5 P1–P8 and Phase4 G1–G7 carry forward; shared live domains are not isolated staging. Continue independent local work using fixtures.

| Gate | Decision/evidence required | Safe default | Dependent action |
| --- | --- | --- | --- |
| D01 Identity    | Legal entity, public brand relationship to HMC, address/service area, working email/phone, hours/support                | Existing truthful facts only; omit null fields              | Final business markup/profile/legal copy      |
| D02 Scope       | First approved destinations/routes/packages and customer audience/languages                                             | Audit existing full inventory; do not invent search volumes | Final content priority and release cohort     |
| D03 Packages    | Real EN/HI itinerary/includes/excludes, exact revision, named approver                                                  | Samples private/noindex; quote-on-request draft supported   | Real package promotion/indexing               |
| D04 Prices      | Basis, tax note, effective date/validity, genuine discount evidence                                                     | No guessed rate/discount/availability                       | Price advertising/price share cards/Offer     |
| D05 Media       | Chosen file/source/license/version/credit/derivative rights and person consent where relevant                           | Existing verified licensed assets or brand-only art         | New photos/social publication                 |
| D06 Environment | Isolated staging, actual deployed commit, Node/Next host support, DB transaction/index/IAM proof                        | Existing safe flags; no production writes                   | R2, CMS/public release                        |
| D07 Accounts    | Owner-controlled GSC property, Plausible domain, existing HMC/possible G GBP ownership, approved social handles         | Draft setup pack; no assumed access                         | Account verification/settings/publication     |
| D08 Privacy     | Analytics data/retention plan, current privacy wording, marketing permission/opt-out handling                           | No PII/recording/ad pixels; analytics off until reviewed    | Production measurement/contact activation     |
| D09 Reviews     | Eligible reviewed business/profile URL, neutral EN/HI approved templates, sender, delay/cap, G-specific enable decision | G requests off; never fall back to HMC template/URL         | G review invitation sending                   |
| D10 Operations  | Named lead owner, actual response hours, backup/escalation and complaint handling                                       | No unsupported response-time/24x7 promise                   | Launch conversion copy and campaign readiness |
| D11 Marketing   | Channels, selected products, editorial approver, budget if any, campaign naming                                         | Organic draft assets only; no paid campaign                 | Posting/advertising/message distribution      |
| D12 Release     | Exact approved version/content/config and owner rollout instruction                                                     | Prelaunch noindex/robots hold remains                       | Phase 7 public launch                         |

Owner real-content location is unknown. Existing six packages are samples. No rates, photo rights, separate GBP/profile/handles/sender/template/account/target or release approval is inferred.

## Status and carry-forward mapping

Decision owner, named approver, decision date, approved revision and supporting evidence are
**not supplied for every D01–D12 row**. Preparation date18 October2026 is not an approval date.
Record those fields with each actual decision; do not replace pending with a generic “approved”.

- Phase4 G1–G7 and Phase5 P1–P8 retain their original definitions. The mapping below relates them
  to the new owner decisions; Phase6 does not reopen booking/payment/message flags or infer approval.
- D06 carries forward Phase5 L2 target topology, transactions/indexes/private media/IAM/native
  runtime/load/device/background/HTTPS/CDN verification. Shared live URLs are not isolated staging.
- D07–D09/D11 add real G accounts, privacy, eligible G profile, consent/template/sender and channel
  decisions. A correctly shaped URL/template name is not evidence of ownership or approval.
- D12 requires exact candidate/config/content plus a public-release instruction. Local code,
  drafted training and a debug APK do not close L3 or constitute delivery of operator training.

| Existing gate | Original subject | Related Phase6 decisions | Actual approval status |
| --- | --- | --- | --- |
| G1 | Saleable product/itinerary/inclusions/vendor/capacity | D02/D03/D04/D05 | Pending for real scope |
| G2 | G payment merchant/display/settlement/KYC/domain | D01/D04/D06/D12 | Not proved/changed by Phase6 |
| G3 | Legal/GST/invoice/cancellation/inclusions | D01/D04/D08/D10 | Pending |
| G4 | Lead time/blackouts/trip/advance/hold/cancellation policy | D02/D03/D04/D10 | Pending for chosen scope |
| G5 | Guest/OTP/access-duration identity policy | D06/D08 | Existing safe contract retained; owner acceptance pending |
| G6 | Customer sender/templates/language/contact | D07/D08/D09/D10 | Actual approval pending; no send |
| G7 | Invoice brand/legal/payment-display separation | D01/D04/D12 | Actual approval pending |
| P1 | Real catalog and EN/HI review | D02/D03 | Pending |
| P2 | Per-car-tour/tax/rate-effective approval | D04 | Pending |
| P3 | Media rights/storage/serving origin | D05/D06 | Actual chosen assets/target pending |
| P4 | Existing ADMIN publishers/delegation | D06/D10 | Named authorized publisher pending |
| P5 | Archive/restore/immutable slug/takedown/audit retention | D05/D10/D12 | Local safe defaults tested; owner acceptance pending |
| P6 | Mongo transactions/native/Next hosting | D06 | Actual target proof pending |
| P7 | Read-only operations/support; separately gated mutations | D10 | Actual workflow/operator acceptance pending |
| P8 | Owner timing after L1/L2 review | D12 | No Phase6 public release instruction |

Original definitions: B PLAN_ghoomo_phase4.md section3 and PLAN_ghoomo_phase5.md owner-input table;
practical outstanding inputs: B `docs/ghoomo-phase5-owner-review.md` and `ghoomo-phase5-runbook.md`.

Owner next input pack: legal/contact/support details; selected EN/HI facts and package revisions;
rates or explicit on-request terms; chosen photo rights; isolated target/runtime/operator access;
account/handle ownership; G review permission/profile/template decision; release scope. Existing
safe flags stay in place while these inputs are missing. No external input is needed to review
the completed local changes and synthetic evidence in this directory.
