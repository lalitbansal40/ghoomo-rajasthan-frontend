import { cache } from "react";
import { unstable_cache } from "next/cache";
import { env } from "./env";
import { loadSitePhotos } from "./site-photo-contract";
export { photoFor } from "./site-photo-contract";

// Server components share one read per render, including the timeout signal. Successful
// API data (including the empty fallback) uses one five-minute cache, below.
// No upload data enters release hashes.
// This project uses the conventional App Router cache (Cache Components is not enabled).
// Cache the deliberate empty fallback too: a missing endpoint during a rolling deployment
// must not make every generated page request that same 404/503 again.
const cached = unstable_cache(
  (base: string) => loadSitePhotos(base),
  ["ghoomo-site-photos-v1"],
  { revalidate: 300 },
);
export const sitePhotos = cache(() => cached(env.apiBaseUrl));
