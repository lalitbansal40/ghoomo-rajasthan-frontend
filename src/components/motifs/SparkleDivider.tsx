/** The logo's ✦ between two thin gold lines — under a section title. Decorative. */
export function SparkleDivider({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 160 18" className={`block h-4 w-40 ${className}`}>
      <path d="M2 9 H66 M94 9 H158" stroke="#E0A93B" strokeWidth="1.4" strokeLinecap="round" />
      <path
        fill="#E0A93B"
        d="M80 0 C81.5 6 83 7.5 89 9 C83 10.5 81.5 12 80 18 C78.5 12 77 10.5 71 9 C77 7.5 78.5 6 80 0 Z"
      />
    </svg>
  );
}
