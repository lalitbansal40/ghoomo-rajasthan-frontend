import 'server-only';
import { cookies } from 'next/headers';
import { env } from './env';
export const PREVIEW_COOKIE = 'ghoomo_preview';
export async function savedPreview() {
  const token = (await cookies()).get(PREVIEW_COOKIE)?.value;
  if (!token) return null;
  try {
  const response = await fetch(`${env.apiBaseUrl}/public/ghoomo/package-preview/content`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!response.ok) return null;
  const body = await response.json(); return body?.ok ? body.data : null;
  } catch { return null; }
}
