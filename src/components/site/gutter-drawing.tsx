"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { DRAWING_LABELS } from "./content";
import { VIEW, anchors, collars, fascia, gully, gullyBars, gutter, pipe, roof, soffit, wall } from "./gutter-model";

/*
  The gutter system drawing. When it comes into view it draws itself once, as a
  quick point-to-point sequence of about 3.5 seconds: roof edge, gutter, outlet,
  then downpipe, each part named as it completes. With reduced motion it is
  simply shown finished.
*/

// Start (ms) and duration (ms) of each part's draw.
const T = {
  context: [0, 700],
  roof: [250, 650],
  gutter: [850, 1050],
  outlet: [1850, 550],
  downpipe: [2350, 1150],
} as const;

type Part = keyof typeof T;
const part = (p: Part): CSSProperties => ({ "--d": `${T[p][0]}ms`, "--t": `${T[p][1]}ms` }) as CSSProperties;

const pct = (x: number, y: number): CSSProperties => ({
  left: `${((x - VIEW.x) / VIEW.w) * 100}%`,
  top: `${((y - VIEW.y) / VIEW.h) * 100}%`,
});

// Label positions (drawing units) and their leader lines to the part.
const LABELS = {
  roof: {
    at: [-37, -38] as const,
    leader: [
      [-12, -38],
      [-2, -38],
      [anchors.roof[0], anchors.roof[1]],
    ],
  },
  gutter: {
    at: [-37, 22] as const,
    leader: [
      [-14, 22],
      [-10, 22],
      [anchors.gutter[0], anchors.gutter[1]],
    ],
  },
  outlet: {
    at: [24, 16] as const,
    leader: [
      [41, 16],
      [47, 16],
      [anchors.outlet[0], anchors.outlet[1]],
    ],
  },
  downpipe: {
    at: [36, 62] as const,
    leader: [
      [60, 62],
      [66, 62],
      [anchors.downpipe[0], anchors.downpipe[1]],
    ],
  },
};
const line = (pts: readonly (readonly number[])[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("");

export function GutterDrawing({ replayable = false }: { replayable?: boolean }) {
  const ref = useRef<HTMLElement>(null);

  // Style guide only: run the sequence again.
  const replay = () => {
    const el = ref.current;
    if (!el || !("js" in el.dataset)) return;
    delete el.dataset.inview;
    void el.getBoundingClientRect();
    requestAnimationFrame(() => {
      el.dataset.inview = "";
    });
  };

  // Draw once when the drawing is well into view. Without JS it is simply shown finished.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.js = "";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.inview = "";
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const grid: number[] = [];
  for (let g = Math.ceil(VIEW.x / 10) * 10; g < VIEW.x + VIEW.w; g += 10) grid.push(g);
  const gridY: number[] = [];
  for (let g = Math.ceil(VIEW.y / 10) * 10; g < VIEW.y + VIEW.h; g += 10) gridY.push(g);

  return (
    <figure ref={ref} className="gd" aria-labelledby="gd-caption">
      <svg className="gd-svg" viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} aria-hidden="true" focusable="false">
        <g className="gd-grid">
          {grid.map((x) => (
            <line key={`x${x}`} x1={x} x2={x} y1={VIEW.y} y2={VIEW.y + VIEW.h} />
          ))}
          {gridY.map((y) => (
            <line key={`y${y}`} x1={VIEW.x} x2={VIEW.x + VIEW.w} y1={y} y2={y} />
          ))}
        </g>

        {/* Context: fascia, soffit, wall and ground, in fine ivory line. */}
        <g className="gd-context" style={part("context")}>
          <path className="gd-draw" pathLength={1} d={fascia.face} />
          <path className="gd-draw" pathLength={1} d={fascia.end} />
          <path className="gd-draw" pathLength={1} d={soffit} />
          <path className="gd-draw" pathLength={1} d={wall.corner} />
          <path className="gd-draw" pathLength={1} d={wall.base} />
          <path className="gd-draw" pathLength={1} d={wall.ground} />
          <path className="gd-draw" pathLength={1} d={roof.surface} />
          {roof.courses.map((d) => (
            <path key={d} className="gd-draw" pathLength={1} d={d} />
          ))}
        </g>

        {/* Roof edge */}
        <g className="gd-part" style={part("roof")}>
          <path className="gd-fill gd-fill--roof" d={roof.end} />
          <path className="gd-draw gd-orange" pathLength={1} d={roof.end} />
          <path className="gd-draw gd-orange" pathLength={1} d={roof.edge} />
          <path className="gd-draw gd-orange gd-thin" pathLength={1} d={roof.edgeTop} />
        </g>

        {/* Gutter: inside, run lines, brackets, front face and the profile at the stop end. */}
        <g className="gd-part" style={part("gutter")}>
          <path className="gd-fill gd-fill--inside" d={gutter.inside} />
          {gutter.brackets.map((d) => (
            <path key={d} className="gd-draw gd-ivory" pathLength={1} d={d} />
          ))}
          <path className="gd-fill gd-fill--front" d={gutter.front} />
          {gutter.runs.map((d) => (
            <path key={d} className="gd-draw gd-orange gd-thin" pathLength={1} d={d} />
          ))}
          <path className="gd-fill gd-fill--end" d={gutter.end} />
          <path className="gd-draw gd-orange" pathLength={1} d={gutter.end} />
        </g>

        {/* Outlet (last pipe segment, under the gutter) */}
        <g className="gd-part" style={part("outlet")}>
          <path className="gd-fill gd-fill--side" d={pipe[3].left} />
          <path className="gd-fill gd-fill--face" d={pipe[3].front} />
          <path className="gd-draw gd-orange" pathLength={1} d={pipe[3].left} />
          <path className="gd-draw gd-orange" pathLength={1} d={pipe[3].front} />
          <path className="gd-draw gd-ivory" pathLength={1} d={collars[0]} />
        </g>

        {/* Swan neck, downpipe, shoe and gully */}
        <g className="gd-part" style={part("downpipe")}>
          <path className="gd-draw gd-ivory" pathLength={1} d={gully} />
          {gullyBars.map((d) => (
            <path key={d} className="gd-draw gd-ivory gd-thin" pathLength={1} d={d} />
          ))}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <path className="gd-fill gd-fill--side" d={pipe[i].left} />
              <path className="gd-fill gd-fill--face" d={pipe[i].front} />
              <path className="gd-draw gd-orange" pathLength={1} d={pipe[i].left} />
              <path className="gd-draw gd-orange" pathLength={1} d={pipe[i].front} />
            </g>
          ))}
          {collars.slice(1).map((d) => (
            <path key={d} className="gd-draw gd-ivory" pathLength={1} d={d} />
          ))}
        </g>

        {/* Leader lines */}
        {(Object.keys(LABELS) as (keyof typeof LABELS)[]).map((k) => (
          <g key={k} className="gd-part" style={part(k)}>
            <path className="gd-draw gd-leader" pathLength={1} d={line(LABELS[k].leader)} />
            <circle className="gd-fade gd-dot" cx={LABELS[k].leader[2][0]} cy={LABELS[k].leader[2][1]} r={1} />
          </g>
        ))}
      </svg>

      {DRAWING_LABELS.map((l) => (
        <span
          key={l.id}
          className="gd-label gd-fade"
          style={{ ...pct(LABELS[l.id].at[0], LABELS[l.id].at[1]), ...part(l.id) }}
        >
          {l.label}
        </span>
      ))}

      {replayable && (
        <button type="button" className="gd-replay" onClick={replay}>
          Replay drawing
        </button>
      )}
      <figcaption id="gd-caption" className="sr-only">
        Drawing of a gutter system: rain leaves the roof edge into the gutter, which carries it to the outlet, then down
        the downpipe to the drain. Illustrative, not a product specification.
      </figcaption>
    </figure>
  );
}
