import { ARCH_OUTER_D } from '@/components/motifs/paths.generated';
import { Camel, Car, FortSun } from '@/components/motifs';

/**
 * The small desert at the top of every public page (owner, 21 Oct 2026 — Ghoomo v2 Phase 4,
 * decision 1 A): two ridges of sand, a low sun, and the section's own mark — a fort for the
 * tours, a camel for the safari, the car for the cabs, a jharokha arch for a place. Still: only
 * the home page's hero moves. Decorative, drawn on the server, nothing downloaded.
 */
export type SceneKind = 'tours' | 'safari' | 'cab' | 'place' | 'dunes';

/** The section's mark, bottom right. */
function Mark({ kind }: { kind: SceneKind }) {
  switch (kind) {
    case 'tours':
      return <FortSun className="h-10 w-auto sm:h-14" />;
    case 'safari':
      return <Camel size={52} className="sm:w-[68px]" />;
    case 'cab':
      return <Car size={96} className="sm:w-[124px]" />;
    case 'place':
      return (
        <svg aria-hidden="true" focusable="false" viewBox="26 0 148 218" className="h-10 w-auto sm:h-14">
          <path fill="none" stroke="#C08A22" strokeWidth="7" d={ARCH_OUTER_D} />
        </svg>
      );
    default:
      return null;
  }
}

export function PageScene({ kind }: { kind: SceneKind }) {
  return (
    <div
      aria-hidden="true"
      data-scene={kind}
      className="pointer-events-none relative h-12 overflow-hidden bg-gradient-to-b from-ivory to-sand-100 sm:h-16"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1440 64"
        preserveAspectRatio="xMaxYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        {/* The fort carries its own sun — one sun in a sky. */}
        {kind === 'tours' ? null : <circle cx="1180" cy="44" r="20" fill="#F5A623" opacity=".55" />}
        <path fill="#F3D9A4" d="M0 40 C 240 26 480 26 720 36 C 960 46 1200 32 1440 30 V64 H0 Z" />
        <path fill="#E9C47C" d="M0 54 C 300 46 600 46 900 51 C 1140 56 1300 50 1440 48 V64 H0 Z" />
      </svg>
      <div className="absolute bottom-0.5 right-4 sm:right-10">
        <Mark kind={kind} />
      </div>
    </div>
  );
}
