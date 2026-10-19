import { boundedBody } from '@/lib/bounded-body';
import { getSession } from '@/lib/session';
import { env } from '@/lib/env';
const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex' };
const fail = (code: string, status: number) => Response.json({ ok: false, error: { code } }, { status, headers });
type Context = { params: Promise<{ segments: string[] }> };
async function proxy(request: Request, context: Context) {
  const { segments } = await context.params; const path = segments.join('/'); const write = request.method === 'POST';
  const id = '[a-fA-F0-9]{24}';
  const allowed = write ? new RegExp(`^(?:requests|requests/claim|reservations|requests/${id}/decision|reservations/${id}/(?:pay|cancel|reconcile))$`) :
    new RegExp(`^(?:requests|reservations)(?:/${id})?$`);
  if (!allowed.test(path)) return fail('NOT_FOUND', 404);
  const anonymous = write && path === 'requests';
  // Existing reservation recovery stays usable while new travel UI/sales are disabled.
  if (!env.travelEnabled && (anonymous || path === 'reservations' && write || /\/pay$/.test(path))) return fail('TRAVEL_DISABLED', 503);
  if (write && request.headers.get('origin') !== new URL(request.url).origin) return fail('ORIGIN_INVALID', 403);
  const token = anonymous ? null : await getSession();
  if (!anonymous && !token) return fail('AUTH_REQUIRED', 401);
  const url = new URL(request.url); const query = new URLSearchParams();
  for (const [k, v] of url.searchParams) {
    if (write || !['cursor', 'limit', 'kind', 'status'].includes(k) || v.length > 2000) return fail('INPUT_INVALID', 400);
    query.append(k, v);
  }
  let raw: string | undefined;
  if (write) {
    if (!request.headers.get('content-type')?.startsWith('application/json') || Number(request.headers.get('content-length')) > 32000) return fail('INPUT_INVALID', 400);
    try { raw = await boundedBody(request, 32000); } catch { return fail('INPUT_TOO_LARGE', 413); }
    try { JSON.parse(raw); } catch { return fail('INPUT_INVALID', 400); }
  }
  const commandKey = request.headers.get('idempotency-key');
  if (write && !['pay', 'reconcile'].some((s) => path.endsWith(`/${s}`)) && !/^[a-f0-9-]{36}$/i.test(commandKey ?? '')) return fail('IDEMPOTENCY_REQUIRED', 400);
  try {
    const r = await fetch(`${env.apiBaseUrl}/${anonymous ? 'public/ghoomo/travel' : 'ghoomo/travel'}/${path}${query.size ? `?${query}` : ''}`, {
      method: request.method, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(20000),
      headers: { Accept: 'application/json', ...(write ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(commandKey ? { 'Idempotency-Key': commandKey } : {}) }, body: raw,
    });
    const body = await boundedBody(r, 1_000_000);
    try { JSON.parse(body); } catch { return fail('TRAVEL_UNAVAILABLE', 502); }
    return new Response(body, { status: r.status, headers });
  } catch { return fail('TRAVEL_UNAVAILABLE', 502); }
}
export const GET = proxy;
export const POST = proxy;
