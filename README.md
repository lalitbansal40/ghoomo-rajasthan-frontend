# Ghoomo Rajasthan — website

Tours across Rajasthan with a car and a driver — a Hello My Cab brand. Same backend as
hellomycabs.com (`api.hellomycabs.com`), its own site, design and words.

## Run it

```bash
npm ci
cp .env.example .env.local   # the values in it work as they are
npm run dev                  # http://localhost:3000
```

Checks before every commit: `npx tsc --noEmit`, `npx eslint .`, `npx next build`.

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
| Colours and fonts | `src/app/globals.css` (`@theme`), `src/app/fonts.ts` |
| Logo files | `public/brand/` — `/brand` shows them all |
| Tour packages (sample until real) | `src/content/packages/` |
| Route text (Ghoomo's own, per route) | `src/content/routes/` · work list `docs/routes.csv` |
| Photos and their licences | `public/img/`, `src/content/photos.ts`, `/photo-credits` |
| Sheets for the real package content | `docs/content-template/` |

## Rules

- Photos only under a free licence (Wikimedia Commons, Unsplash, Pexels), each recorded in
  `src/content/photos.ts` and credited — never from a search engine.
- No text copied from hellomycabs.com: the same words on two domains is duplicate content to
  Google, and it would cost both sites.
- Next.js 16 — read `node_modules/next/dist/docs/` before relying on memory (see AGENTS.md).
