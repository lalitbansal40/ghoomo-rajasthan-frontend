/** The desert scene's geometry (components/scene) — pure, so it can be tested. */

/** The scene's width in SVG units — one loop of a drifting ridge. */
export const SCENE_W = 1440;
const W = SCENE_W;

/**
 * A ridge of dunes two widths long, so sliding it one width left loops without a seam:
 * `segments` (even — crest, trough, crest… back to where it began) across one width, the line
 * between `y - amp` and `y + amp`.
 */
export function ridge(y: number, amp: number, segments: number): string {
  if (segments % 2) throw new Error('A ridge loops only with an even number of segments');
  const step = W / segments;
  const at = (i: number) => y + (i % 2 === 0 ? -amp : amp);
  let d = `M0 ${at(0)}`;
  for (let i = 0; i < segments * 2; i++) {
    const x0 = i * step;
    const x1 = x0 + step;
    d += ` C ${x0 + step / 2} ${at(i)} ${x0 + step / 2} ${at(i + 1)} ${x1} ${at(i + 1)}`;
  }
  return `${d} V220 H0 Z`;
}
