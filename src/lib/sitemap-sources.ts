/**
 * A sitemap source that could not be read (the backend's catalogue or travel inventory): its
 * pages are left out and the rest of the sitemap is served — never a 503 for everything. Logged
 * so the gap is seen. Pure, so it can be tested without the server.
 */
export function availableOrEmpty<T>(items: readonly T[] | null, source: string): T[] {
  if (items === null) {
    console.warn(`sitemap: ${source} unavailable — its pages are left out of this response`);
    return [];
  }
  return [...items];
}
