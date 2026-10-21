import { PLACES } from "../content/places/index.ts";
import { PACKAGES } from "../content/packages/index.ts";
import { SAFARI } from "../content/safari.ts";
import { PHOTOS } from "../content/photos.ts";
import type { SitePhotos } from "./site-photo-contract.ts";

/** A reused Commons file still needs its attribution when another slot uses the fallback.
 * These three also appear in the style guide outside editable website slots. */
export function stockPhotoCredits(photos: SitePhotos) {
  const used = new Set([
    "jaisalmer-fort",
    "jaisalmer-dunes",
    "udaipur-pichola",
  ]);
  if (!photos["home-hero"]) used.add("jaipur-hawa-mahal");
  if (!photos["safari:jaisalmer"]) used.add("camel-sunset");
  for (const p of PLACES)
    if (p.photo && !photos[`place:${p.key}`]) used.add(p.photo);
  for (const p of PACKAGES) if (!photos[`tour:${p.slug}`]) used.add(p.photo);
  for (const p of SAFARI) if (!photos[`safari:${p.slug}`]) used.add(p.photo);
  return PHOTOS.filter((p) => used.has(p.key));
}
