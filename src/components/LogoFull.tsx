import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The full logo drawn straight into the page — for the page where it is the largest thing on
 * the screen (the coming-soon page). As an <img> it was the page's LCP and waited on its own
 * request and decode (Lighthouse, 16 Oct 2026: 1.3 s of "render delay"); inline it paints with
 * the first paint. Read once at build time from public/brand (one source for the logo). Its
 * accessible name is the SVG's own <title>, replaced with `label` in the page's language.
 */
const SVG = readFileSync(join(process.cwd(), 'public/brand/logo-full.svg'), 'utf8')
  // Its gradient / clip ids are prefixed so they cannot meet another inline SVG's on the page.
  .replace(/id="([a-z0-9]+)"/g, 'id="lf-$1"')
  .replace(/url\(#([a-z0-9]+)\)/g, 'url(#lf-$1)');

export function LogoFull({ label, className = '' }: { label: string; className?: string }) {
  const svg = SVG.replace(/<title>[^<]*<\/title>/, `<title>${label.replace(/[<&]/g, '')}</title>`).replace(
    '<svg ',
    `<svg class="block h-auto w-full" aria-label="${label.replace(/["<&]/g, '')}" `,
  );
  return <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}
