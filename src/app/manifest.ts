import type { MetadataRoute } from 'next';
import { brand } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: brand.shortName,
    description: 'Tours across Rajasthan with a car and a driver.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF7EF',
    theme_color: '#1E3A7B',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/logo-icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
