import { CAMEL_D, SADDLE_D } from '@/components/motifs/paths.generated';
import { motionAllowed, motionAttr } from '@/lib/motion';
import { SCENE_W as W, ridge } from '@/lib/scene';
import { ScenePlay } from './ScenePlay';

/**
 * The desert at dusk along the foot of the home page's hero (owner, 21 Oct 2026 — Ghoomo v2
 * Phase 4, decision 1 A): the sun setting behind the far dunes, three ridges of sand drifting
 * at their own pace, a caravan of camels walking the middle ridge, kites and birds over it, and
 * the Hello My Cab car in front.
 *
 * A band, not a backdrop: nothing is ever drawn behind the words above it. Inline SVG and CSS
 * keyframes (globals.css `gr-scene-*`) — transform and opacity only, nothing downloaded, no
 * script but the one that pauses it off screen (ScenePlay). Still for anyone whose phone asks
 * for less motion, and wherever `data-motion` is off (src/lib/motion.ts). Decorative: hidden
 * from screen readers. The hero photo stays the page's largest paint.
 */

const FAR = ridge(132, 10, 4);
const NEAR = ridge(196, 7, 6);

/** One camel of the caravan, standing on y = 0. */
function CaravanCamel({ x, scale, delay }: { x: number; scale: number; delay: string }) {
  return (
    <g transform={`translate(${x} 0) scale(${scale})`}>
      <g className="gr-scene-sway" style={{ animationDelay: delay }}>
        <use href="#gr-camel" />
      </g>
    </g>
  );
}

function Kite({ x, y, fill, delay }: { x: number; y: number; fill: string; delay: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="gr-scene-kite" style={{ animationDelay: delay }}>
        <path d="M0 -11 L8 0 L0 13 L-8 0 Z" fill={fill} />
        <path d="M0 -11 V13 M-8 0 H8" stroke="#FBF7EF" strokeWidth=".8" opacity=".7" />
        <path d="M0 13 C -4 20 4 25 -1 32 C -5 38 2 42 -2 48" fill="none" stroke={fill} strokeWidth="1" opacity=".7" />
      </g>
    </g>
  );
}

export function DesertScene({ path, className = '' }: { /** The page's path — where motion is allowed. */ path: string; className?: string }) {
  return (
    <ScenePlay
      {...motionAttr(path)}
      className={`pointer-events-none relative h-36 overflow-hidden sm:h-48 md:h-56 ${className}`}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={`0 0 ${W} 220`}
        preserveAspectRatio="xMaxYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {/* One camel, drawn once, walked four times. */}
          <symbol id="gr-camel" overflow="visible">
            <path fill="#561010" opacity=".88" d={CAMEL_D} />
            <path fill="#C08A22" d={SADDLE_D} />
          </symbol>
          <radialGradient id="gr-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#FFD27A" />
            <stop offset=".7" stopColor="#F5A623" />
            <stop offset="1" stopColor="#D9673F" />
          </radialGradient>
          <radialGradient id="gr-dusk" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#F6B48A" stopOpacity=".75" />
            <stop offset="1" stopColor="#F6B48A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gr-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E9C47C" />
            <stop offset="1" stopColor="#D9A75A" />
          </linearGradient>
        </defs>

        {/* The sun, setting behind the far dunes — its glow breathes. */}
        <circle className="gr-scene-glow" cx="1130" cy="128" r="150" fill="url(#gr-dusk)" />
        <circle cx="1130" cy="132" r="54" fill="url(#gr-sun)" />

        {/* Birds heading home, and two kites. */}
        {/* Anchored to the right edge (xMaxYMax): a phone sees the sun, the birds, one kite and
            the caravan as it passes; a wide screen sees the whole sky. */}
        <g className="gr-scene-birds" fill="none" stroke="#1B1B1F" strokeOpacity=".45" strokeWidth="1.6" strokeLinecap="round">
          <path d="M1210 40 q6 -6 12 0 q6 -6 12 0" />
          <path d="M1248 26 q5 -5 10 0 q5 -5 10 0" />
          <path d="M1278 48 q4 -4 8 0 q4 -4 8 0" />
        </g>
        <Kite x={960} y={44} fill="#8E1B1B" delay="0s" />
        <Kite x={460} y={30} fill="#1E3A7B" delay="-3s" />

        {/* Far ridge — the slowest drift. */}
        <g className="gr-scene-drift gr-scene-far">
          <path fill="#F3D9A4" opacity=".85" d={FAR} />
        </g>

        {/* Middle ridge, still, and the caravan walking its crest. */}
        <path fill="#E9C47C" d="M0 168 C 240 160 480 158 720 163 C 960 168 1200 161 1440 166 V220 H0 Z" />
        <g transform="translate(0 164)">
          <g className="gr-scene-caravan">
            <CaravanCamel x={0} scale={0.95} delay="0s" />
            <CaravanCamel x={70} scale={1} delay="-.4s" />
            <g className="max-sm:hidden">
              <CaravanCamel x={142} scale={0.9} delay="-.8s" />
              <CaravanCamel x={206} scale={0.8} delay="-1.2s" />
            </g>
          </g>
        </g>

        {/* Near ridge — drifts faster, in front of the caravan's feet. */}
        <g className="gr-scene-drift gr-scene-near">
          <path fill="url(#gr-near)" d={NEAR} />
        </g>
      </svg>
      {/* The Hello My Cab car on the sand in front, as before — a small cached file, not inline
          (lib/car-svg.ts). Its wheels turn only where the page may move. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- an SVG drawing: nothing for the image optimizer to do */}
      <img
        src="/scene/car.svg"
        data-moving-src={motionAllowed(path) ? '/scene/car-moving.svg' : undefined}
        alt=""
        width={124}
        height={42}
        decoding="async"
        loading="lazy"
        className="absolute bottom-[8%] left-[6%] h-auto w-[110px] sm:bottom-[10%] sm:left-[12%] sm:w-[160px]"
      />
    </ScenePlay>
  );
}
