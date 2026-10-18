# Structured data and search appearance

Actual source changes: cab Offer no longer asserts InStock. Prices/currency and existing fare math
were retained. Agency street/locality now derive from the shared brand record instead of a second
hardcoded street. JsonLd requires exact production/stage/launch policy and an eligible page; sample
package detail explicitly denies it. `<` escaping remains. No AggregateRating or package Product/
Offer was added. An on-request package can have useful TouristTrip content without a made-up price.

Existing TravelAgency/WebSite/ItemList/BreadcrumbList/TouristDestination/TouristTrip/TaxiService are
semantic vocabulary, not a promise of a Google-supported rich result. Stable agency/provider IDs,
visible itinerary/list/breadcrumb agreement, actual approved media and contact facts must be checked.
Source facts are not owner approval of a separate customer-facing office or GBP listing.

Visible FAQs remain. FAQPage is retained as optional semantics only; Google retired FAQ rich results
in2026. Rich Results Test not listing a type is not automatically JSON syntax failure; optional
warnings, actual errors and Google eligibility must be recorded separately. No SearchAction without
real search, invented hours/ratings/stock/discount/date or forced tourist Product shopping markup.

Prelaunch responses intentionally have no public JSON-LD. Launched behavior is tested in pure policy/
sitemap tests and, where executed, explicitly labelled isolated candidate fixtures. Actual production
schema/live Rich Results inspection is a target gate, not inferred from a local build.

References: [review guidance](https://developers.google.com/search/docs/appearance/structured-data/review-snippet),
[2026 FAQ retirement](https://developers.google.com/search/updates). Do not restore star markup using
the HMC totals from its separate SEO recovery handover.
