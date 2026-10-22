# Ghoomo Rajasthan — robots.txt / Search Console check

Checked22 October2026. **No current robots block was reproduced on the reported home variants.** The owner's screenshot reports three blocked URLs with last crawl16 October2026 and first detection17 October. Current public responses allow crawling and indexing of the canonical homepage. This supports stale/historical report data as the likely explanation; it does not prove Google's current cached robots version, network access or indexed status.

## Live public GET evidence

| Reported URL | Current redirect chain | Final homepage |
|---|---|---|
| `http://ghoomorajasthan.com/` |301→`https://ghoomorajasthan.com/` |200 |
| `https://www.ghoomorajasthan.com/` |301→`https://ghoomorajasthan.com/` |200 |
| `http://www.ghoomorajasthan.com/` |301→HTTPS www→301→HTTPS bare |200 |
| `https://ghoomorajasthan.com/` | No redirect |200 |

All four robots.txt variants reach the same200 text/plain response, through the corresponding redirects:

```text
User-Agent: *
Allow: /

Sitemap: https://ghoomorajasthan.com/sitemap.xml
```

- Canonical homepage: `index, follow`; Googlebot metadata: `index, follow`; no X-Robots-Tag block; canonical `https://ghoomorajasthan.com` (root-slash normalization is expected).
- Sitemap:200 application/xml;328 unique URLs, only `ghoomorajasthan.com`, English and Hindi homes present. This is the current captured count, not a permanent expectation or a crawl/indexing result for every URL.
- Regular-browser and Googlebot-user-agent public GETs followed the expected redirects. **A spoofed Googlebot user agent is not Google's verified crawler network and does not substitute for Search Console's live URL test.**
- Source: `SITE_LAUNCHED=true`; the robots policy permits the approved origin only with production stage. Preview/local configurations and private/unreviewed page indexing remain separate safeguards. No source/configuration change is justified by the three supplied historical examples at this point.

[Captured response evidence](evidence/robots-live-2026-10-22.json) contains chains/headers/metadata/timestamp. Local raw sitemap is `/private/tmp/ghoomo-robots-2026-10-22/sitemap.xml`. No authenticated GSC session was accessed, no validation/indexing request submitted and no production setting/deployment changed by this check.

## Remaining Search Console steps

1. In the verified `ghoomorajasthan.com` property, inspect **`https://ghoomorajasthan.com/`** and choose **Test live URL**. Record Crawl allowed, Page fetch and Indexing allowed. If the live result still says blocked/unreachable, capture the exact tested URL and robots rule/fetch result before changing code.
2. With a successful live result, use **Request indexing** for that canonical homepage. Indexing is Google's decision; an available live URL is not an indexed URL.
3. Open **Pages → Blocked by robots.txt → Validate fix** (the button visible in the screenshot). This initiates Google's recheck; it is not proof that validation already passed.
4. If Google's stored robots version still contains an old disallow rule, use **Settings → robots.txt**, open the relevant file and inspect its fetched version/last fetch. Request a robots recrawl using the report's available action where appropriate. Do not assume public GETs reveal Google's cached copy.
5. In **Sitemaps**, check the existing `https://ghoomorajasthan.com/sitemap.xml` submission. Submit once only if absent; if already present, review fetch status/last read/discovered count instead of adding duplicate entries.
6. Keep the intended canonical homepage as the indexing target. The three HTTP/www aliases are redirect URLs and need not become separately indexed pages. A later “Page with redirect” classification for those aliases is normal, distinct from a robots block.
7. Record live-test/validation request dates and later crawl/report status. Google reports update asynchronously. Do not repeatedly press Request indexing/Validate fix or promise a fixed recovery date.

## References

- [Google: robots.txt report and recrawl](https://support.google.com/webmasters/answer/6062598)
- [Google: validation details](https://support.google.com/webmasters/answer/9216203)
- [Google: inspect and troubleshoot a page](https://support.google.com/webmasters/answer/12482179)
- [Google: robots scope, redirects and caching](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)

Outcome: **current public site checks pass for this reported block; GSC live test/validation/indexing outcome remains unverified.** No runtime code, preview protection, release approval, price, content or customer flow was changed. No rebuild/commit/deploy is required merely to preserve this audit.
