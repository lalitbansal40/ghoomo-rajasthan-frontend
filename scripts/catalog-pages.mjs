/** Discover the currently rendered catalog, including packages published after the build. */
export async function catalogPaths(base) {
  const response = await fetch(`${base}/packages`);
  if (!response.ok) throw new Error('Package list unavailable during audit');
  const html = await response.text();
  return [...new Set([...html.matchAll(/href="(\/packages\/[a-z0-9-]+)(?:\?[^" ]*)?"/g)].map((m) => m[1]))];
}
