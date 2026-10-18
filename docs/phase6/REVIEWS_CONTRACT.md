# Review scope, default denial and invitation readiness

The shared HMC job now excludes explicit `ghoomo_rajasthan` in both due query and atomic claim,
before setting reviewRequestedAt. HMC panel ride-rating templates and HMC env review flags cannot
open the G path. Existing missing-brand HMC behavior and old genuine HMC links remain compatible.
HMC signed-link GET/POST rejects a stored G booking before exposing trip information/accepting a rating.

New rating brand is resolved from the stored booking, never the request. HMC-only publication
consent cannot publish G feedback: G remains private, retains ordinary driver feedback and unique
per-rater/per-booking protection, and does not increment shared HMC site/route/city aggregates.
The app suppresses its HMC-publication checkbox for G/unrecognized brands. Recount logic excludes
G using actual booking linkage even for an older unlabelled rating. No recount/write/delete/migration
was run on production. Existing inconsistent aggregate totals were not repaired or declared fake.
Existing raw summaries still need owner provenance reconciliation; this is not historical data cleanup.

## New independent G worker

`sendDueGhoomoReviewRequests` is registered with existing bounded jobs. Safe startup does not depend
on it being configured. Defaults in B `.env.example` are off/blank; no real env file was changed.
Required config: GHOOMO_REVIEW_REQUESTS_ENABLED, REQUESTS_SINCE (explicit activation watermark),
REVIEW_URL, REVIEW_CHANNEL_ID, approved REVIEW_TEMPLATE_EN/HI and existing provider credentials.
All names use the `GHOOMO_` prefix in source; see exact example block, not these abbreviated labels.

URL must be an approved G Google review endpoint on exact g.page/r/.../review or
search.google.com/local/writereview?placeid=...; no credential, redirect, arbitrary host or HMC URL
fallback. Owner must establish actual profile eligibility/ownership—URL shape alone cannot do that.

Eligibility is deliberately conservative: explicit stored G brand, completed trip, separate stored
ghoomoReviewConsent=true, en/hi locale, approved locale template, within2–48 hours after completion
and after the activation watermark, valid recipient and no opt-out. It also requires a reciprocally
linked positive captured G booking-advance payment for the same customer; manual/simulated/wrong
brand/reference evidence is ineligible. Cash-only/other cases require a separately reviewed policy,
not an assumption of a genuine completion. Maximum20 candidates per invocation.

The current customer flow does **not** infer review opt-in from enquiry/policy consent and no public
API was added to set it. Actual permission evidence/collection and owner-approved activation are D09
dependencies. Existing trips are not backfilled or automatically queued. Missing/off config, locale
approval or opt-in creates no request claim. This capability is not an enabled production campaign.

Atomic once-per-booking claim rechecks brand/status/window/consent/payment link/locale. Claim time
uses reviewRequestedAt; outcome is claimed/sent/failed/unknown. Two workers cannot both claim it.
Provider errors/timeout/crash-after-claim are reviewed manually, never blindly resent. claimed may
remain after a crash; unknown does not mean failed delivery. No automatic retry/catch-up. Monitor
eligible-but-skipped rows before considering capacity/policy changes; do not raise batch limits blindly.

Ambiguous HTTP408/5xx responses retain `unknown`; only a definite rejected response can be labelled
failed. Recipient normalization accepts an Indian ten-digit mobile or explicit91 prefix; unrelated
international numbers are rejected rather than truncated into another recipient. These paths have
dedicated mock tests. Unknown/failed/claimed history never authorizes an automatic resend.

The new provider call uses the separately configured channel/language, bounded timeout and redacted
outcome logs. No phone/name/full URL/message body/provider error body in its logs. Existing HMC
provider behavior is left compatible. Local transports are mocked; no real review request was sent.

## Neutral template drafts (not approved)

Three body parameters in order: first name, route label, approved G review URL. Provider category,
language code, sender and final template name must match actual approval. No dynamic button is assumed.

EN: “Hello {{1}}, thank you for travelling with Ghoomo Rajasthan on {{2}}. If you would like, share
your honest experience here: {{3}}. Your feedback is welcome whether your experience was good or bad.
Reply STOP if you do not want review invitations.”

HI: “नमस्ते {{1}}, {{2}} की यात्रा के लिए घूमो राजस्थान चुनने का धन्यवाद। चाहें तो अपना सच्चा अनुभव
यहाँ लिखें: {{3}}। अनुभव अच्छा हो या बुरा, आपकी राय का स्वागत है। समीक्षा के निमंत्रण नहीं चाहिए तो STOP लिखें।”

No incentives, star-based selection, employee/family reviews or HMC testimonial import. If G GBP
is ineligible/unapproved, keep the worker off; no new private-feedback portal is silently included.
No public G AggregateRating/testimonials until genuine trip provenance and channel-specific consent.

Rollback: disable G worker/public affected readers before reverting scope-aware code. Keep additive
fields/history; an old unscoped worker must not consume new G records. Never roll back by deleting feedback.
