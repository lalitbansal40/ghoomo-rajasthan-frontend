import { OG_SIZE, ogCard } from '../../_og/card';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Desert safari in Rajasthan — Ghoomo Rajasthan';

export default function Image() {
  return ogCard({ title: 'Desert safari', meta: 'Camel · jeep · a night in a camp', sub: 'Jaisalmer · Bikaner · Pushkar · Osian', photoKey: 'camel-sunset', siteSlot: 'safari:jaisalmer' });
}
