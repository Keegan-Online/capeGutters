"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useEnquiry } from "../enquiry/enquiry-context";
import { Lines } from "../lines";
import { LAND, OUTSIDE_LAND, PLACES, REGIONS } from "../area-map/geo";
import { PLACES_INDEX, type Place } from "../area-map/places";
import { IconArrow, IconNorth, IconSearch } from "./brand";
import { AREAS } from "./content";

type View = "wide" | "tall";
type Box = [number, number, number, number];

// Units are km (see geo.ts). "wide" sits beside the copy, "tall" is the stacked mobile view.
const VIEWBOX: Record<View, Box> = {
  wide: [-64, 23, 159, 69],
  tall: [-8, 24, 76, 70],
};

// Where each region's name sits (km), per view, chosen to stay inside its region and clear of neighbours.
const LABELS: Record<View, Record<string, [number, number]>> = {
  wide: {
    blaauwberg: [27.2, 31.5],
    "northern-suburbs": [41.5, 38],
    "cape-town": [22.4, 41.2],
    "atlantic-seaboard": [14.2, 47.2],
    "southern-suburbs": [23.9, 50.8],
    "cape-flats": [37.5, 53.4],
    "south-peninsula": [19.6, 72.5],
    helderberg: [60.6, 58.6],
  },
  tall: {
    blaauwberg: [31.5, 29.4],
    "northern-suburbs": [45, 38.5],
    "cape-town": [24.6, 41.6],
    "atlantic-seaboard": [10.5, 46.2],
    "southern-suburbs": [24.4, 51.8],
    "cape-flats": [38.6, 55.2],
    "south-peninsula": [18.4, 74],
    helderberg: [58.4, 55.6],
  },
};
const TABLE_BAY_TALL: [number, number] = [14.5, 35.2];

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

/** Mirrors preserveAspectRatio so HTML labels land on SVG coordinates; k = px per km. */
function useProjection(stage: React.RefObject<HTMLDivElement | null>, box: Box, align: "xMax" | "xMid") {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stage]);
  if (!size) return null;
  const [x, y, w, h] = box;
  const k = Math.min(size.w / w, size.h / h);
  const ox = align === "xMax" ? size.w - w * k : (size.w - w * k) / 2;
  const oy = (size.h - h * k) / 2;
  return { k, at: (px: number, py: number) => [ox + (px - x) * k, oy + (py - y) * k] as const };
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function findPlace(query: string): Place | null {
  const q = norm(query);
  if (!q) return null;
  return (
    PLACES_INDEX.find((p) => norm(p.name) === q) ??
    PLACES_INDEX.find((p) => norm(p.name).startsWith(q)) ??
    (q.length > 3 ? PLACES_INDEX.find((p) => norm(p.name).includes(q)) : undefined) ??
    null
  );
}

type Result = { kind: "found"; place: Place } | { kind: "missing"; query: string } | { kind: "empty" } | null;

export function SiteMap() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const view = useView();
  const box = VIEWBOX[view];
  const stageRef = useRef<HTMLDivElement>(null);
  const proj = useProjection(stageRef, box, view === "wide" ? "xMax" : "xMid");
  const [selected, setSelected] = useState<string | null>("southern-suburbs");
  const [hovered, setHovered] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Result>(null);
  const { goToForm } = useEnquiry();

  const region = REGIONS.find((r) => r.id === selected) ?? null;
  const pinPlace = result?.kind === "found" && result.place.region === selected ? result.place : null;
  const [bx, by, bw, bh] = box;

  const grid = useMemo(() => {
    const xs: number[] = [];
    const ys: number[] = [];
    for (let g = Math.floor((bx - 60) / 5) * 5; g <= bx + bw + 60; g += 5) xs.push(g);
    for (let g = Math.floor((by - 30) / 5) * 5; g <= by + bh + 30; g += 5) ys.push(g);
    return { xs, ys };
  }, [bx, by, bw, bh]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return setResult({ kind: "empty" });
    const place = findPlace(query);
    if (place) {
      setSelected(place.region);
      setResult({ kind: "found", place });
    } else setResult({ kind: "missing", query: query.trim() });
  }

  const select = (id: string) => {
    setSelected(id);
    if (result?.kind === "found" && result.place.region !== id) setResult(null);
  };

  const regionName = (id: string) => REGIONS.find((r) => r.id === id)?.name ?? "";
  const calloutAt = pinPlace ? pinPlace.at : region ? (LABELS[view][region.id] ?? region.label) : null;

  const card = region ? (
    <div className="mp__card" role="status" key={`${region.id}-${pinPlace?.name ?? ""}`}>
      <p className="mp__card-name">{pinPlace ? pinPlace.name : region.name}</p>
      {pinPlace && <p className="mp__card-sub">{region.name}</p>}
      <button
        type="button"
        className="mp__card-action"
        onClick={() => goToForm({ area: region.name, suburb: pinPlace?.name, focus: pinPlace ? "name" : "suburb" })}
      >
        Check availability
        <IconArrow />
      </button>
    </div>
  ) : null;

  return (
    <section id="areas" className="mp" aria-labelledby="areas-title">
      <div className="mp__copy">
        <h2 id="areas-title" className="mp__title">
          <span className="ln-s">{AREAS.title[0]}</span> <span className="ln-s mp__accent">{AREAS.title[1]}</span>
        </h2>
        <p className="mp__lede">{AREAS.lede}</p>

        <form className="mp__search" role="search" onSubmit={onSearch}>
          <label htmlFor={`${uid}-q`} className="sr-only">
            Your suburb
          </label>
          <input
            id={`${uid}-q`}
            type="text"
            list={`${uid}-list`}
            placeholder="Enter your suburb"
            autoComplete="address-level2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <datalist id={`${uid}-list`}>
            {PLACES_INDEX.map((p) => (
              <option key={p.name} value={p.name} />
            ))}
          </datalist>
          <button type="submit" aria-label="Find suburb">
            <IconSearch />
          </button>
        </form>

        <div className="mp__result" aria-live="polite">
          {result?.kind === "found" && (
            <>
              <p>
                <strong>{result.place.name}</strong> is in the {regionName(result.place.region)} area.
              </p>
              <button
                type="button"
                className="link-s"
                onClick={() => goToForm({ area: regionName(result.place.region), suburb: result.place.name })}
              >
                Ask about availability in {result.place.name}
                <IconArrow />
              </button>
            </>
          )}
          {result?.kind === "missing" && (
            <>
              <p>We couldn&rsquo;t place &ldquo;{result.query}&rdquo; on this map. You can still ask about it.</p>
              <button type="button" className="link-s" onClick={() => goToForm({ suburb: result.query })}>
                Ask about {result.query}
                <IconArrow />
              </button>
            </>
          )}
          {result?.kind === "empty" && <p>Type a suburb name, for example Rondebosch or Table View.</p>}
        </div>

        <p className="mp__caption">
          <Lines text={`${AREAS.caption}|${AREAS.credit}`} />
        </p>
      </div>

      <div className="mp__stage" ref={stageRef} data-view={view}>
        <svg
          className="mp__svg"
          viewBox={box.join(" ")}
          preserveAspectRatio={view === "wide" ? "xMaxYMid meet" : "xMidYMid meet"}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id={`${uid}-fade`} x1="56" x2="79" y1="0" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask
              id={`${uid}-mask`}
              maskUnits="userSpaceOnUse"
              x={bx - 200}
              y={by - 100}
              width={bw + 400}
              height={bh + 200}
            >
              <rect x={bx - 200} y={by - 100} width={bw + 400} height={bh + 200} fill={`url(#${uid}-fade)`} />
            </mask>
            <filter id={`${uid}-lift`} x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="0.6" stdDeviation="0.6" floodColor="rgba(120,50,10,0.35)" />
            </filter>
          </defs>
          <g className="mp__grid">
            {grid.xs.map((g) => (
              <line key={`x${g}`} x1={g} x2={g} y1={by - 30} y2={by + bh + 30} vectorEffect="non-scaling-stroke" />
            ))}
            {grid.ys.map((g) => (
              <line key={`y${g}`} x1={bx - 60} x2={bx + bw + 60} y1={g} y2={g} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
          <g mask={`url(#${uid}-mask)`}>
            <path className="mp__outside" d={OUTSIDE_LAND} />
            {REGIONS.map((r, i) => (
              <path
                key={r.id}
                d={r.d}
                className="mp__region"
                style={{ fill: `var(--mr${i + 1})` }}
                data-state={r.id === selected ? "selected" : r.id === hovered ? "hover" : undefined}
                vectorEffect="non-scaling-stroke"
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(r.id)}
                onPointerLeave={() => setHovered(null)}
                onClick={() => select(r.id)}
              />
            ))}
            <path className="mp__coast" d={LAND} vectorEffect="non-scaling-stroke" />
          </g>
          {region && (
            <path
              key={region.id}
              className="mp__active"
              d={region.d}
              filter={`url(#${uid}-lift)`}
              vectorEffect="non-scaling-stroke"
              onClick={() => select(region.id)}
            />
          )}
        </svg>

        {proj && (
          <div className="mp__overlay">
            {(
              [
                ["Table Bay", view === "tall" ? TABLE_BAY_TALL : PLACES.tableBay],
                ["False Bay", PLACES.falseBay],
              ] as const
            ).map(([name, [x, y]]) => {
              const [left, top] = proj.at(x, y);
              return (
                <span key={name} className="mp__water" style={{ left, top }} aria-hidden="true">
                  {name}
                </span>
              );
            })}

            {REGIONS.map((r) => {
              const [x, y] = LABELS[view][r.id] ?? r.label;
              const [left, top] = proj.at(x, y);
              const isSel = r.id === selected;
              return (
                <button
                  key={r.id}
                  type="button"
                  className="mp__label"
                  data-state={isSel ? "selected" : r.id === hovered ? "hover" : undefined}
                  style={{ left, top }}
                  aria-pressed={isSel}
                  onMouseEnter={() => setHovered(r.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(r.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => select(r.id)}
                >
                  {r.name}
                </button>
              );
            })}

            {region &&
              calloutAt &&
              (() => {
                const [left, top] = proj.at(calloutAt[0], calloutAt[1]);
                return (
                  <div key={`${region.id}-${pinPlace?.name ?? ""}`} className="mp__callout" style={{ left, top }}>
                    <span className="mp__pin" aria-hidden="true" />
                    {view === "wide" && card}
                  </div>
                );
              })()}

            {view === "wide" && (
              <div className="mp__legend" aria-hidden="true">
                <IconNorth className="mp__north" />
                <div className="mp__scale" style={{ width: proj.k * 20 }}>
                  <span style={{ left: 0 }}>0</span>
                  <span style={{ left: "50%" }}>10</span>
                  <span style={{ left: "100%" }}>20 km</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {view === "tall" && card && <div className="mp__below">{card}</div>}
    </section>
  );
}
