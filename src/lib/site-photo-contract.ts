import slots from "../content/site-photo-slots.json" with { type: "json" };

export interface SitePhoto {
  version: number;
  alt: { en: string; hi: string };
  credit: string;
  variants: Record<string, string>;
}
export type SitePhotos = Record<string, SitePhoto>;
const plain = (v: unknown): v is string =>
  typeof v === "string" &&
  v.trim().length > 0 &&
  v.length <= 500 &&
  !/[<>]/u.test(v) &&
  ![...v].some((c) => c.charCodeAt(0) < 32);

/** Closed slots, exact same-origin paths and supported derivatives only. Never trust an
 * arbitrary image URL from API JSON: this is also used by the server-side OG renderer. */
export function sitePhotoUrl(
  slot: string,
  version: number,
  variant: string,
  apiBase: string,
) {
  if (
    !slots.some((s) => s.slot === slot) ||
    !Number.isSafeInteger(version) ||
    version < 1 ||
    version > 9_999_999_999 ||
    ![
      "cover",
      "card",
      "thumb",
      "og",
      ...(slot === "home-hero" ? ["hero"] : []),
    ].includes(variant)
  )
    throw Error("SITE_PHOTO_INVALID");
  return new URL(
    `/api/v1/public/ghoomo/site-photos/${encodeURIComponent(slot)}/${version}/${variant}`,
    new URL(apiBase).origin,
  ).toString();
}
export function parseSitePhotos(value: unknown, apiBase: string): SitePhotos {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("SITE_PHOTO_INVALID");
  const entries = Object.entries(value);
  if (entries.length > 41) throw Error("SITE_PHOTO_INVALID");
  return Object.fromEntries(
    entries.map(([slot, raw]) => {
      const row = raw as SitePhoto;
      if (
        !row ||
        !plain(row.credit) ||
        !plain(row.alt?.en) ||
        !plain(row.alt?.hi) ||
        !row.variants ||
        typeof row.variants !== "object" ||
        Array.isArray(row.variants)
      )
        throw Error("SITE_PHOTO_INVALID");
      const variants = Object.fromEntries(
        Object.entries(row.variants).map(([variant, rawUrl]) => {
          const expected = sitePhotoUrl(slot, row.version, variant, apiBase);
          if (
            typeof rawUrl !== "string" ||
            new URL(rawUrl, new URL(apiBase).origin).toString() !== expected
          )
            throw Error("SITE_PHOTO_INVALID");
          return [variant, expected];
        }),
      );
      for (const v of [
        "cover",
        "card",
        "og",
        ...(slot === "home-hero" ? ["hero"] : []),
      ])
        if (!variants[v]) throw Error("SITE_PHOTO_INVALID");
      return [
        slot,
        { version: row.version, alt: row.alt, credit: row.credit, variants },
      ];
    }),
  );
}
export interface DisplayPhoto {
  key: string;
  big: string;
  card: string;
  alt: string;
  credit: string;
  licence: string;
  sourceUrl: string;
  changes: string;
  hero?: string;
  og?: string;
  siteManaged?: boolean;
}
export function photoFor(
  slot: string,
  fallback: DisplayPhoto | null,
  photos: SitePhotos,
  locale: "en" | "hi" = "en",
): DisplayPhoto | null {
  const own = photos[slot];
  return own
    ? {
        key: slot,
        big: own.variants.cover,
        card: own.variants.card,
        hero: own.variants.hero,
        og: own.variants.og,
        alt: own.alt[locale],
        credit: own.credit,
        licence: locale === "hi" ? "अधिकार की पुष्टि" : "Rights confirmed",
        sourceUrl: "/photo-credits",
        changes: "Cropped and resized; metadata removed",
        siteManaged: true,
      }
    : fallback;
}

/** Optional enhancement: an unavailable/malformed photo catalog always retains the licensed
 * stock image. This must never turn an unrelated cab-fare failure into a successful empty fare. */
export async function loadSitePhotos(
  apiBase: string,
  request: typeof fetch = fetch,
): Promise<SitePhotos> {
  try {
    const response = await request(`${apiBase}/public/ghoomo/site-photos`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
      redirect: "error",
      headers: { accept: "application/json" },
    });
    if (
      !response.ok ||
      Number(response.headers.get("content-length") ?? 0) > 100_000
    )
      return {};
    const reader = response.body?.getReader();
    if (!reader) return {};
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 100_000) return {};
        chunks.push(value);
      }
    } finally {
      await reader.cancel();
    }
    const body = JSON.parse(new TextDecoder().decode(Buffer.concat(chunks)));
    return body?.ok === true ? parseSitePhotos(body.data, apiBase) : {};
  } catch {
    return {};
  }
}
