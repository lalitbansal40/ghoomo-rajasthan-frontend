/** Cookie-authenticated mutations require the browser's same-origin request, not a caller URL. */
export function sameOriginMutation(request: Request): boolean {
  const origin = request.headers.get('origin');
  try { return Boolean(origin) && origin === new URL(request.url).origin; } catch { return false; }
}
