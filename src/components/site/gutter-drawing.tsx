import type { CSSProperties } from "react";
import { GRID, LABELS, VIEW, ground, gutter, highlight, leaderPath, pipe, roof, structure } from "./gutter-detail";

/*
  Gutter system detail, drawn like an architectural section.
  Static for now: the corrected drawing is presented for review before any
  motion is added. The orange highlight is shown in its completed state.
*/

const pct = (x: number, y: number): CSSProperties => ({
  left: `${((x - VIEW.x) / VIEW.w) * 100}%`,
  top: `${((y - VIEW.y) / VIEW.h) * 100}%`,
});

export function GutterDrawing() {
  const xs: number[] = [];
  for (let g = GRID * Math.ceil(VIEW.x / GRID); g < VIEW.x + VIEW.w; g += GRID) xs.push(g);
  const ys: number[] = [];
  for (let g = GRID * Math.ceil(VIEW.y / GRID); g < VIEW.y + VIEW.h; g += GRID) ys.push(g);
  const x1 = VIEW.x + VIEW.w;
  const y1 = VIEW.y + VIEW.h;

  return (
    <figure className="gd" aria-labelledby="gd-caption">
      <svg className="gd-svg" viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} aria-hidden="true" focusable="false">
        <g className="gd-grid">
          {xs.map((x) => (
            <line key={`x${x}`} x1={x} x2={x} y1={VIEW.y} y2={y1} />
          ))}
          {ys.map((y) => (
            <line key={`y${y}`} x1={VIEW.x} x2={x1} y1={y} y2={y} />
          ))}
        </g>

        {/* Structure: restrained warm white */}
        <g className="gd-struct">
          <path className="gd-fill-only" d={roof.coveringFill} />
          <path d={roof.covering} />
          <path d={roof.rafter} />
          {roof.battens.map((d) => (
            <path key={d} d={d} />
          ))}
          <path className="gd-cut" d={roof.cut} />
          <path className="gd-fill-soft" d={structure.fascia} />
          <path className="gd-fill-only" d={structure.soffitFill} />
          <path d={structure.soffit} />
          <path d={structure.wall} />
          <path d={ground.line} />
          <path className="gd-faint" d={ground.hatch} />
        </g>

        {/* System: gutter, outlet, downpipe */}
        <g className="gd-system">
          <path className="gd-trough" d={gutter.trough} />
          <path d={gutter.inner} />
          <path d={gutter.cap} />
          <path className="gd-pipe" d={pipe.body} />
          <path className="gd-seam" d={pipe.seams.join("")} />
          <path d={gutter.outer} />
        </g>

        {/* Orange highlight (completed state) */}
        <g className="gd-hl">
          <path d={highlight.roof} />
          <path d={highlight.route} />
        </g>

        {/* Fittings sit over the pipe line, so nothing passes through them. */}
        <g className="gd-system gd-fittings">
          <path d={pipe.socket} />
          {pipe.collars.map((d) => (
            <path key={d} d={d} />
          ))}
          {pipe.clips.map((d) => (
            <path key={d} d={d} />
          ))}
          <path className="gd-cover" d={pipe.hopperFill} />
          <path d={pipe.hopper} />
          <path className="gd-seam" d={pipe.hopperRim} />
        </g>

        {/* Leaders */}
        <g className="gd-leaders">
          {Object.values(LABELS).map((l) => {
            const end = l.leader[l.leader.length - 1];
            return (
              <g key={l.text}>
                <path d={leaderPath(l.leader)} />
                <circle cx={end[0]} cy={end[1]} r={2.2} />
              </g>
            );
          })}
        </g>
      </svg>

      {Object.values(LABELS).map((l) => (
        <span key={l.text} className="gd-label" style={pct(l.leader[0][0] - 8, l.leader[0][1])}>
          {l.text}
        </span>
      ))}

      <figcaption id="gd-caption" className="sr-only">
        Section through the eaves: the roof edge overhangs the gutter, the gutter carries water to the outlet, and the
        downpipe steps back to the wall and runs down to a gully at ground level. Illustrative, not a product
        specification.
      </figcaption>
    </figure>
  );
}
