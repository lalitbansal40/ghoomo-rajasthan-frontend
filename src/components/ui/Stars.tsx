/**
 * A rating, 0–5 in halves. ONLY for real ratings from real customers — never invented
 * (Phase 6). A screen reader hears "4.5 out of 5" (the page passes it in its language).
 */
export function Stars({ value, label, size = 18 }: { value: number; label: string; size?: number }) {
  const v = Math.max(0, Math.min(5, Math.round(value * 2) / 2));
  return (
    <span role="img" aria-label={label} className="inline-flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = v >= i + 1 ? 1 : v >= i + 0.5 ? 0.5 : 0;
        return (
          <svg key={i} aria-hidden viewBox="0 0 24 24" width={size} height={size}>
            <defs>
              <linearGradient id={`gr-star-${i}-${fill}`}>
                <stop offset={fill} stopColor="#E0A93B" />
                <stop offset={fill} stopColor="#F3D9A4" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#gr-star-${i}-${fill})`}
              stroke="#C08A22"
              strokeWidth="1"
              d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8L12 2.8Z"
            />
          </svg>
        );
      })}
    </span>
  );
}
