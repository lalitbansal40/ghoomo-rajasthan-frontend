# After launch — what to watch (Ghoomo Rajasthan, from 20 Oct 2026)

Search Console property: **Domain `ghoomorajasthan.com`** (verified 16 Oct 2026).
At each point below, send Claude the screenshot named; a short report comes back.

| When | Where in Search Console | What should be true | Screenshot |
|---|---|---|---|
| Day 1 | Sitemaps | `sitemap.xml` — Status **Success**, Discovered URLs **328** | Sitemaps page |
| Day 1–2 | URL inspection (the 10 asked for) | "URL is on Google" or "Discovered — currently not indexed" (normal at first) | one inspection |
| Day 3–7 | Pages (Indexing) | Indexed count rising; "Not indexed" reasons — look for *404*, *Excluded by 'noindex'* (should be only unapproved pages), *Duplicate without user-selected canonical* (should be none) | Pages report, with the reasons table |
| Week 2 | Performance → Search results | First queries and pages with impressions | Queries tab |
| Week 2 | Experience → Core Web Vitals | No "Poor" URLs on mobile | CWV report |
| Week 4 | Pages | Most of the 328 indexed; for the rest, the reason | Pages report |

**If something looks wrong**
- Many *404* → a link points to a page that does not exist: run `npm run links:check` on a build.
- *Excluded by 'noindex'* on an approved page → the page lost its approval: check
  `docs/release/approved-pages.json` and the build log's `"approvals"` (should be 328).
- *Alternate page with proper canonical tag* on `www.` URLs → expected (the 301 at work).
- *Crawled — currently not indexed* on many roads → normal for a new site; more internal links
  and time. Do not change the text of all pages at once.

**Also watch (outside Search Console)**
- Bing Webmaster Tools → the imported site's Sitemaps and Index Explorer, week 2.
- The site itself: `https://ghoomorajasthan.com/robots.txt` allows, `/sitemap.xml` answers 200
  (if the backend catalogue is down, the sitemap still answers — without tour pages from it).
