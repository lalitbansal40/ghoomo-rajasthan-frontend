import type { NextConfig } from 'next';
import { FONT_ASSETS } from './src/app/font-assets';

const nextConfig: NextConfig = {
  images: {
    // Admin-owned photos stay private in S3. Only this API's closed photo namespace
    // is allowed; browsers still load optimized images from the website origin.
    remotePatterns: [{ protocol: 'https', hostname: 'api.hellomycabs.com', port: '', pathname: '/api/v1/public/ghoomo/site-photos/**', search: '' }],
    qualities: [40, 75],
    // AVIF first — about half the bytes of WebP for photographs; WebP for browsers that cannot.
    formats: ['image/avif', 'image/webp'],
    // A resized image is cached for 30 days: the source files only change with a deploy.
    minimumCacheTTL: 2592000,
  },

  experimental: {
    // Two root layouts (English, Hindi) leave no single layout for a 404 to sit in — so the
    // site-wide 404 is app/global-not-found.tsx (node_modules/next/dist/docs/…/not-found.md).
    globalNotFound: true,
    // `inlineCss` (as on the Hello My Cab site) is left off until there are real pages to
    // measure it on: it trades deploy size for first paint (Phase 2).
  },

  async redirects() {
    // Phase 0's /brand grew into the style guide (Phase 1). Not permanent: a team page.
    return [{ source: '/brand', destination: '/styleguide', permanent: false }];
  },

  async headers() {
    return [
      ...FONT_ASSETS.map((source) => ({
        source,
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      })),
      {
        source: '/:path*',
        headers: [
          // Two years, subdomains included, preload-eligible: no first request over http.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Send the page, not the query string, to anything we link out to.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // The brand files and photos: a day fresh, a week of the old one while the new one
        // is fetched (these names do not change when the file does).
        source: '/:path(brand|img)/:file*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
};

export default nextConfig;
