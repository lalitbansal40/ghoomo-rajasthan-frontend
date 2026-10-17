import { cookies } from 'next/headers';

const COOKIE = 'ghoomo_session';

export async function setSession(token: string) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  });
}

export async function getSession() {
  return (await cookies()).get(COOKIE)?.value ?? null;
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}
