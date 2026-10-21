import { CAR_SVG } from '../components/motifs/paths.generated.ts';

/**
 * The logo's car as a standalone SVG file (/scene/car.svg, /scene/car-moving.svg — Phase 4).
 *
 * Why a file and not inline: the car's lettering is ~7.5 kB of path, and inline it is sent twice
 * (in the HTML and again in the page's React payload) on the home page and on every cab route
 * page — enough to push /hi past a network round trip. As an <img> it is one small cached file,
 * fetched after the page has painted.
 *
 * `moving`: the wheels turn and the body rides a slight bounce — CSS inside the file, still for
 * anyone whose phone asks for less motion.
 */
export function carSvg(moving: boolean): string {
  const style = moving
    ? '<style>' +
      '@keyframes s{to{transform:rotate(360deg)}}' +
      '@keyframes b{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}' +
      // Each wheel already carries its own centre (inline transform-origin, in the drawing's
      // units) — only the animation is added, as globals.css does for the inline car.
      '.gr-wheel{animation:s .9s linear infinite}' +
      '.body{animation:b .9s ease-in-out infinite}' +
      '@media (prefers-reduced-motion:reduce){*{animation:none!important}}' +
      '</style>'
    : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 124 42" width="124" height="42">` +
    `${style}<g class="body">${CAR_SVG}</g></svg>`
  );
}

export const SVG_HEADERS = {
  'Content-Type': 'image/svg+xml; charset=utf-8',
  'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
  'X-Content-Type-Options': 'nosniff',
} as const;
