# Search release — Phase 1 approval (owner, 20 Oct 2026)

This file is the evidence every entry of `src/lib/release-manifest.ts` points to. The list of
pages it approves is `docs/release/approved-pages.json`; `scripts/release-approve.mjs` binds that
list to each build's content revision (see "How it works" below).

## The owner's instructions, word for word

20 Oct 2026, on the Ghoomo Rajasthan v2 overview:

> "Content ki manzoori list dikh rha ahi wo bhi kar do kyuki google pr to dikhana hai"
>
> "Launch (SITE_LAUNCHED = true, sitemap submit) or ye launch hi kar do kyuki google pr wo index
> karne m time leta hai to apna wo kaam parellel ho jayega"

20 Oct 2026, on the six Phase 1 decisions (`PLAN_ghoomo_v2_phase1.md`):

> "1. haa
> 2 nahi ye roue index kar do m baad m real data daal dunga kyuki baad m sirf price wagerha hi
> change hogi
> 3 haa
> 4 haa
> 5 haa
> 6 haa"

| # | Decision | Owner's answer |
|---|---|---|
| 1 | The owner approves a list of pages once; each build binds it to its own revision | Yes |
| 2 | Sample tours and the desert safari: noindex until real? | **No — index them**; real data later, only prices will change |
| 3 | Launch before the owner has read the Hindi | Yes |
| 4 | Analytics (Plausible) stays off for now | Yes |
| 5 | hellomycabs.com links to Ghoomo Rajasthan | Yes |
| 6 | www → ghoomorajasthan.com redirect in code | Yes |

## What decision 2 means on the pages

- The sample tours (`/packages`, `/packages/<six>`) and `/desert-safari` are searchable.
- Their **"Sample price" badge and the note at the top stay** — a visitor is never told a sample
  price is our price.
- **No sample price is offered to search engines**: no `Offer` in structured data, no price in a
  title, a description or a share image.
- When the real tours and rates arrive, the badge goes and the price is offered — the page keeps
  its approval (same path; sample tours carry a fixed revision, `SAMPLE_CONTENT_REVISION`).
  A tour that moves to the CMS carries the CMS's revision and is approved again.

## The approved pages — 164 pages, 328 URLs (English and Hindi)

The list itself is `docs/release/approved-pages.json` (made from the code's own lists, not by
hand). In short:

| Group | Pages | Which |
|---|---|---|
| Core | 8 | `/`, `/destinations`, `/cab`, `/about`, `/contact`, `/privacy`, `/terms`, `/refund` |
| Places | 30 | every `/destinations/<place>` |
| Cab roads | 118 | every `/cab/<road>` with words of our own that is not held |
| Sample (decision 2) | 8 | `/packages`, the six `/packages/<tour>`, `/desert-safari` |

**Not approved, and why**
- `/tours`, `/hotels`, `/group-tours` — empty until real items are published; an empty page in
  search does harm. They join the list when they have items.
- The 10 held roads (six short NCR hops hellomycabs.com holds; four short roads where the minimum
  fare is most of the price) — out of search until their fares are decided.
- Private pages (booking, my bookings, checkout, trip requests, enquiry, plan your trip) and
  utility pages (photo credits, style guide) — never.

Checked on 20 Oct 2026, before launch: every one of the 328 URLs answers 200 and shows no
"TO FILL", "TODO", "lorem", "null", "undefined" or "NaN"; `seo:check --all` passes (titles,
descriptions, canonicals, hreflang pairs).

## How it works

- `docs/release/approved-pages.json` — the owner's list (English paths; Hindi added).
- `scripts/release-approve.mjs` — writes `src/lib/release-manifest.ts`: for each path, an English
  and a Hindi approval, bound to this build's static revision (or, for a sample tour, its sample
  revision). It refuses private, utility, held and empty-listing paths whatever the list says.
- `prebuild`: revision → approvals → the unchanged launch gate (`scripts/phase7/launch-gate.mjs`).
  A code change no longer voids every approval, and no longer fails the build once launched.
