# Ghoomo Rajasthan — website

Tours across Rajasthan with a car and a driver — a Hello My Cab brand. Same backend as
hellomycabs.com (`api.hellomycabs.com`), its own site, design and words. English at `/`,
Hindi at `/hi`.

## Run it

```bash
npm ci
cp .env.example .env.local   # the values in it work as they are
npm run dev                  # http://localhost:3000
```

Before every commit: `npx tsc --noEmit`, `npx eslint .`, `npx next build`.

## Deploy

AWS Amplify, from `main` (the owner deploys). `amplify.yml` is the build spec — Node 22,
`npm ci`, `next build`. Environment variables are the three in `.env.example`.

## Hidden until launch

`SITE_LAUNCHED` in `src/lib/site.ts` is `false`: robots.txt disallows everything, every page is
`noindex`, the sitemap is empty. Flip it on launch day, and only then.

## Where things are

| What | Where |
|---|---|
| Name, phone, address, launch switch | `src/lib/site.ts` |
| Design tokens (colours, type, radius, shadow, motion) | `src/design/tokens.json` → `npm run tokens` → `src/design/tokens.css` |
| Fonts | `src/app/fonts.ts` (one Mukta + one Rozha One, for both languages) |
| Interface words, English and Hindi | `src/i18n/en.ts`, `src/i18n/hi.ts` |
| Which page exists in which language; the menu | `src/i18n/pages.ts` |
| Motifs (jharokha, dunes, camel, fort, car, jaali) | `src/components/motifs/` — shapes from `scripts/brand/motifs.py` |
| UI parts (buttons, cards, timeline, FAQ, header, footer, form…) | `src/components/ui/` |
| The style guide | `/styleguide`, `/hi/styleguide` (noindex, never linked) |
| Logo files | `public/brand/` — rebuilt by `scripts/brand/build.py` + `export-png.mjs` |
| Tour packages (sample until real) | `src/content/packages/` |
| Route text (Ghoomo's own, per route) | `src/content/routes/` · work list `docs/routes.csv` |
| Photos and their licences | `public/img/`, `src/content/photos.ts` (`npm run photos`), `/photo-credits` |
| Sheets for the real package content | `docs/content-template/` |

## Two languages

- `src/app/(en)/…` — English pages, root layout `<html lang="en">`. `src/app/hi/…` — Hindi, its own
  root layout `<html lang="hi">`. Going between them is a full page load (Next's rule for two
  root layouts). A URL that matches nothing gets `src/app/global-not-found.tsx`, in both
  languages.
- **A new word on screen:** add the key to `en.ts`, then to `hi.ts` — the build fails if Hindi
  misses one. No component writes user-facing text of its own.
- **Writing Hindi:** plain, spoken Hindi in devanagari, every line read — never pasted from a
  machine. Places as people write them (जयपुर, उदयपुर, जैसलमेर, पुष्कर, रणथंभौर). Prices in Indian
  digits (₹27,999).
- **A new page in both languages:** add its path to `src/i18n/pages.ts`, give it
  `alternates(path, locale)` (canonical + hreflang, `src/lib/seo.ts`), and pass `path` to the
  `Header` / `DocPage` (the language switch needs it).
- **Fonts:** never add a second font instance for Hindi — measured, it either preloads
  devanagari on English pages or downloads latin twice (see `src/app/fonts.ts`). Hindi body text
  is the phone's own devanagari face; headings are Rozha One's devanagari.

## Checks

| Command | What |
|---|---|
| `npm run contrast` | Every text colour pair against WCAG AA (fails below 4.5:1) |
| `npm run tokens` | Rewrites `tokens.css` from `tokens.json` |
| `npm run audit` | Against `next build && next start -p 3300`: screenshots at 360 / 768 / 1280, no horizontal scroll, no console errors, axe, `lang`, noindex, no devanagari preload on English pages, nothing animates under reduced motion, Lighthouse ≥ 95 on `/` and `/hi` (`--no-lighthouse` to skip) |

## Rules

- Photos only under a free licence (Wikimedia Commons, Unsplash, Pexels), each recorded in
  `src/content/photos.ts` and credited — never from a search engine.
- No text copied from hellomycabs.com: the same words on two domains is duplicate content to
  Google, and it would cost both sites.
- Light only (no dark mode), light motion that stops under reduced motion, pill buttons, phone
  first, 48 px tap targets.
- Next.js 16 — read `node_modules/next/dist/docs/` before relying on memory (see AGENTS.md).
