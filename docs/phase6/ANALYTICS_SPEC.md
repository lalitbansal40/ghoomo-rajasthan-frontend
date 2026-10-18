# Public-only analytics contract

Implementation: `src/components/Analytics.tsx`, `AnalyticsClient.tsx`,
`src/lib/analytics-contract.ts`, enquiry form and their tests. Default off: both reviewed production
stage/launch policy and exact configured Plausible domain must allow it. No external auto-tracking
script is loaded. The browser sends explicit sanitized payloads to Plausible's documented Events
API; no API key is exposed/required for this anonymous ingestion endpoint.

The server supplies a bounded allowlist of real public paths, including the noindex public enquiry
form. Personal booking, confirmation, account, API, auth, preview and rating-token paths are excluded.
Current published non-sample package paths only; held routes, sample safari and sample-only package
hub excluded. Every event rechecks the current browser URL, not a stale React pathname. A prior
public-page visit cannot enable a later private pageview. Public→private→history and direct-private
behavior are exercised by the offline browser fixture.

Payload is `name`, `domain`, sanitized `url`, limited `locale`/`page_type` props, and optional known
search/social referrer **origin only**. No name/phone/field value/token/booking or payment ID/free-text
error/WhatsApp message. Unknown query, hash, referrer and campaign values are dropped. Known campaign
values live in `CAMPAIGNS`; campaign kit values must match. No cookie/localStorage/session replay,
ad pixel, per-person join or financial/revenue event. Browser network/device metadata still reaches
the provider: do not claim that no data processing happens or that every future tracker needs no consent.

| Event | Meaning |
| --- | --- |
| pageview | Allowed current public path; React StrictMode rerender deduped |
| whatsapp_click / phone_click | CTA activation, not a message/call/lead/sale |
| enquiry_start | First meaningful interaction in the mounted form attempt |
| enquiry_error | Controlled request failure; no exception/form body |
| enquiry_success | Existing G enquiry API confirmed success, not merely submit/click |
| package_enquiry_click | Current approved package→public enquiry navigation |
| language_switch | User selects an allowed other-language path, not proof it loaded |

Requests are fire-and-forget, credentials omitted, network referrer suppressed and collector failures
ignored. Forms/calls/navigation never wait for analytics. Campaign attribution is limited to allowed
landing values/provider sessions; blockers/disabled traffic cause undercounts. No claim that a click
is an accepted enquiry or gateway-confirmed booking.

Owner setup before activation: verify own Plausible domain/account, provision matching custom event
goal names, review privacy/retention and production candidate, then approve the specific config.
Local tests intercept all requests; no real provider ingestion or dashboard goal setup is claimed.
Production acceptance needs an authorized public-only event check and private denial check; a202
alone does not prove provider accepted an event into the dashboard.

Reference: [Plausible Events API](https://plausible.io/docs/events-api), checked18 October2026.
