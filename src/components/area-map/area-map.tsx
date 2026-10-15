"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Arrow } from "../icons";
import { Lines } from "../lines";
import { useEnquiry } from "../enquiry/enquiry-context";
import { LAND, OUTSIDE_LAND, PLACES, REGIONS } from "./geo";

type View = "wide" | "tall";
type Box = [number, number, number, number];
type Side = "right" | "left";

// Units are km (see geo.ts). "wide" sits to the right of the text on desktop,
// "tall" is the stacked mobile view.
const VIEWBOX: Record<View, Box> = {
  wide: [-54, 29, 124, 55],
  tall: [-8, 26, 75, 69],
};

// Label anchor tweaks per view, so names stay readable and inside their area.
// `water` marks labels whose text sits over the sea, so they switch tone.
type LabelTweak = { at?: [number, number]; side?: Side; water?: boolean };
const LABELS: Record<string, Partial<Record<View, LabelTweak>>> = {
  blaauwberg: { wide: { at: [27.4, 31.8] }, tall: { at: [27.6, 29.6] } },
  "northern-suburbs": { wide: { at: [39.5, 36.5] }, tall: { at: [37.5, 36.2] } },
  "cape-town": { wide: { at: [21.6, 41.4] }, tall: { at: [21.4, 41.2] } },
  "atlantic-seaboard": {
    wide: { at: [16.4, 47.6], side: "left", water: true },
    tall: { at: [17.0, 46.8], side: "left", water: true },
  },
  "southern-suburbs": { wide: { at: [23.8, 48.6] }, tall: { at: [23.6, 47.8] } },
  "cape-flats": { wide: { at: [37.2, 53.6] }, tall: { at: [35.8, 54.2] } },
  "south-peninsula": { wide: { at: [21.2, 67.4], water: true }, tall: { at: [21.2, 69.5], water: true } },
  helderberg: { wide: { at: [60.2, 55.6] }, tall: { at: [60.5, 58.6], side: "left" } },
};

function useView(): View {
  const [view, setView] = useState<View>("wide");
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const sync = () => setView(mq.matches ? "wide" : "tall");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return view;
}

/** Mirrors preserveAspectRatio so HTML labels land on the SVG coordinates. */
function useProjection(stage: React.RefObject<HTMLDivElement | null>, box: Box, align: "xMax" | "xMid") {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [stage]);
  if (!size) return null;
  const [x, y, w, h] = box;
  const k = Math.min(size.w / w, size.h / h);
  const ox = align === "xMax" ? size.w - w * k : (size.w - w * k) / 2;
  const oy = (size.h - h * k) / 2;
  return (px: number, py: number) => [ox + (px - x) * k, oy + (py - y) * k] as const;
}

const GRID_STEP = 5;

export function AreaMap({ title, lede, caption }: { title: [string, string]; lede: string; caption: string }) {
  const view = useView();
  const box = VIEWBOX[view];
  const stageRef = useRef<HTMLDivElement>(null);
  const project = useProjection(stageRef, box, view === "wide" ? "xMax" : "xMid");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const { goToForm, area } = useEnquiry();

  const selectedRegion = REGIONS.find((r) => r.id === selected) ?? null;
  const active = hovered ?? selected;
  const activeRegion = REGIONS.find((r) => r.id === active) ?? null;
  const [bx, by, bw, bh] = box;

  const gridX: number[] = [];
  const gridY: number[] = [];
  for (let g = Math.floor((bx - 80) / GRID_STEP) * GRID_STEP; g <= bx + bw + 80; g += GRID_STEP) gridX.push(g);
  for (let g = Math.floor((by - 40) / GRID_STEP) * GRID_STEP; g <= by + bh + 40; g += GRID_STEP) gridY.push(g);

  const toggle = (id: string) => setSelected((cur) => (cur === id ? null : id));

  return (
    <section id="areas" className="areas" aria-labelledby="areas-title">
      <div className="areas__stage" ref={stageRef} data-view={view}>
        <svg
          className="areas__svg"
          viewBox={box.join(" ")}
          preserveAspectRatio={view === "wide" ? "xMaxYMid meet" : "xMidYMid meet"}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <filter id="map-shadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="0.9" stdDeviation="1.1" floodColor="var(--map-shadow)" floodOpacity="1" />
            </filter>
            <filter id="map-lift" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="0.7" stdDeviation="0.7" floodColor="var(--map-lift-shadow)" floodOpacity="1" />
            </filter>
          </defs>

          <rect className="map-sea" x={bx - 400} y={by - 200} width={bw + 800} height={bh + 400} />
          <g className="map-grid">
            {gridX.map((g) => (
              <line key={`x${g}`} x1={g} x2={g} y1={by - 200} y2={by + bh + 200} vectorEffect="non-scaling-stroke" />
            ))}
            {gridY.map((g) => (
              <line key={`y${g}`} x1={bx - 400} x2={bx + bw + 400} y1={g} y2={g} vectorEffect="non-scaling-stroke" />
            ))}
          </g>

          <path className="map-slab" d={LAND} transform="translate(0 0.55)" filter="url(#map-shadow)" />
          <path className="map-outside" d={OUTSIDE_LAND} />

          <g className="map-regions">
            {REGIONS.map((r, i) => (
              <path
                key={r.id}
                d={r.d}
                className="map-region"
                style={{ fill: `var(--map-r${i + 1})` }}
                data-state={r.id === selected ? "selected" : r.id === hovered ? "hover" : undefined}
                vectorEffect="non-scaling-stroke"
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(r.id)}
                onPointerLeave={() => setHovered(null)}
                onClick={() => toggle(r.id)}
              />
            ))}
          </g>
          <path className="map-coast" d={LAND} vectorEffect="non-scaling-stroke" />

          {activeRegion && (
            <path
              key={activeRegion.id + (activeRegion.id === selected ? "-s" : "-h")}
              className="map-active"
              data-state={activeRegion.id === selected ? "selected" : "hover"}
              d={activeRegion.d}
              filter="url(#map-lift)"
              vectorEffect="non-scaling-stroke"
              onPointerLeave={() => setHovered(null)}
              onClick={() => toggle(activeRegion.id)}
            />
          )}
        </svg>

        {project && (
          <div className="areas__labels">
            {(
              [
                ["Table Bay", PLACES.tableBay],
                ["False Bay", PLACES.falseBay],
              ] as const
            ).map(([name, [x, y]]) => {
              const [left, top] = project(x, y);
              return (
                <span key={name} className="map-water" style={{ left, top }} aria-hidden="true">
                  {name}
                </span>
              );
            })}
            {REGIONS.map((r) => {
              const tweak = LABELS[r.id]?.[view] ?? {};
              const [x, y] = tweak.at ?? r.label;
              const [left, top] = project(x, y);
              const state = r.id === selected ? "selected" : r.id === active ? "hover" : undefined;
              return (
                <button
                  key={r.id}
                  type="button"
                  className="map-label"
                  data-side={tweak.side ?? "right"}
                  data-water={tweak.water ? "" : undefined}
                  data-state={state}
                  style={{ left, top }}
                  aria-pressed={r.id === selected}
                  onMouseEnter={() => setHovered(r.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(r.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => toggle(r.id)}
                >
                  <span className="map-label__dot" aria-hidden="true" />
                  <span className="map-label__text">{r.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="areas__copy">
        <h2 id="areas-title" className="h-areas">
          {title[0]}
          <br />
          {title[1].replace(/\.$/, "")}
          <span className="dot">.</span>
        </h2>
        <p className="areas__lede">
          <Lines text={lede} />
        </p>

        <div className="areas__readout" aria-live="polite">
          {selectedRegion ? (
            <>
              <p className="areas__picked">
                <span className="areas__picked-label">Selected area</span>
                <span className="areas__picked-name">{selectedRegion.name}</span>
              </p>
              {area === selectedRegion.name ? (
                <p className="areas__used">Added to your enquiry. Add your suburb in the form.</p>
              ) : (
                <button
                  type="button"
                  className="link-action"
                  onClick={() => goToForm({ area: selectedRegion.name, focus: "suburb" })}
                >
                  Use this area in my enquiry
                  <Arrow className="link-action__arrow" />
                </button>
              )}
            </>
          ) : (
            <p className="areas__hint">Select an area on the map to add it to your enquiry.</p>
          )}
        </div>

        <p className="areas__caption">
          {caption} <span className="areas__credit">Areas are a guide, not service boundaries. Coastline © OpenStreetMap contributors.</span>
        </p>
      </div>
    </section>
  );
}
