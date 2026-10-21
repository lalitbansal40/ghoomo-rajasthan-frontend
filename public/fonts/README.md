# Rozha One Hindi heading subset

`rozha-one-hindi-1eee6e4144eb.woff2` combines the Latin and Devanagari coverage already used by next/font/google Rozha One400. It is subset from the identical version of the official [Google Fonts source](https://raw.githubusercontent.com/google/fonts/main/ofl/rozhaone/RozhaOne-Regular.ttf), with all layout features retained and hinting removed, matching Google Fonts web subsets. FontTools compared all321 mapped codepoints against the original Latin/Devanagari web subsets: outlines and advance/side-bearing metrics are identical. The source version is1.301.

Asset SHA256: `1eee6e4144eb21bcf4a6ec6c9f8aa23774b4b5b81f5002786d4cef3f65b32c24` (45004bytes). Source TTF SHA256: `8491b838c31f30272aa6da67e4749afabab8297db82a055fd2d0aa689f500ee3`.

Copyright2014 Indian Type Foundry. [SIL Open Font License1.1](https://raw.githubusercontent.com/google/fonts/main/ofl/rozhaone/OFL.txt) is included in `Rozha-One-OFL.txt`.

Hindi's root preloads this stable asset. Scoped CSS keeps the same heading face for Devanagari, Latin labels and price digits in one request. English keeps the original next/font face and receives no Hindi font preload. This avoids a second font request for mixed-script Hindi headings; no typography or content is removed for performance.


## Mukta body subsets

The six `mukta-{400|600}-{latin|latin-ext|devanagari}-{sha256-prefix}.woff2` files are **unchanged binary copies** of the site's existing next/font/google web subsets. `src/app/body-fonts.css` retains every original Unicode range, weight, display policy and Arial fallback metric. Glyphs, coverage and typography are preserved. `Mukta-OFL.txt` is the same SIL Open Font License included with the app's Mukta assets: copyright2014 Girish Dalvi, Ek Type. Family source: https://fonts.google.com/specimen/Mukta . Full per-file checksums/provenance are recorded in backend Phase5 evidence `body-font-check.json`.

Body fonts use explicit content-hashed URLs because Next's shared CSS was leaking automatic English Latin preloads into Hindi even with separate `preload:false` definitions. English and EN preview preload only the two Latin weights; Hindi and HI preview preload only the combined heading subset. Hindi device-font preferences are unchanged, and all body subsets still load on demand when needed. This eliminates duplicate/unused font transfers without removing glyphs. `font-assets.ts` is the shared delivery manifest; Next headers mark only those exact content-hashed assets immutable. New font files require new hashes and a manifest/CSS update.


Rozha One heading subsets (21 Oct 2026): exact byte copies of the existing next/font
output from the Phase 4 build. No font or framework upgrade. The separately vendored
Hindi heading face remains unchanged. `display-fonts.css` preserves the generated fallback
metrics and Unicode ranges; only English home preloads Latin. Licence: `RozhaOne-OFL.txt`.

- `rozha-one-devanagari-60cef1c6bd13.woff2`: 38208 bytes; SHA-256 `60cef1c6bd13e7453a81a85a1a5055607a100f7f252714e0f04ac59b579cc783`.
- `rozha-one-latin-ext-992e7dfc736f.woff2`: 6464 bytes; SHA-256 `992e7dfc736f00b3fff040b3462e0d97995cd728c648b2eef36fef63bdfbe275`.
- `rozha-one-latin-34bee9547f08.woff2`: 10136 bytes; SHA-256 `34bee9547f0804454bf7ca3444aa59b99329b5bd0e297ac095f9c51f1f0d87b8`.
