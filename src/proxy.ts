import { NextResponse } from 'next/server';

/** Never let a guest token or personal booking page be cached or sent as a referrer. */
export function proxy() {
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}

export const config = { matcher: ['/booking/:path*', '/hi/booking/:path*', '/my-bookings/:path*', '/hi/my-bookings/:path*'] };
