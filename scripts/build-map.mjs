// Builds the Cape Town area map from OpenStreetMap coastline data.
// Coastline: real OSM natural=coastline ways (scripts/data/osm-coastline.json).
// Regions: sensibly simplified divisions drawn in lon/lat below, clipped to the real land.
// Output: src/components/area-map/geo.ts (static SVG paths, no runtime map library).
//
// Run: node scripts/build-map.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pc from "polygon-clipping";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const raw = JSON.parse(fs.readFileSync(path.join(here, "data/osm-coastline.json"), "utf8"));

// ---------- 1. Chain coastline ways into lines and rings ----------
const ways = raw.ways;
const byStart = new Map(ways.map((w) => [w.nodes[0], w]));
const ends = new Set(ways.map((w) => w.nodes[1]));
const used = new Set();
const chains = [];

function walk(first) {
  let coords = [...first.coords];
  let startNode = first.nodes[0];
  let endNode = first.nodes[1];
  used.add(first.id);
  while (endNode !== startNode) {
    const next = byStart.get(endNode);
    if (!next || used.has(next.id)) break;
    used.add(next.id);
    coords = coords.concat(next.coords.slice(1));
    endNode = next.nodes[1];
  }
  return { closed: endNode === startNode, coords };
}

// Heads of open chains first, then whatever is left (multi-way rings).
for (const w of ways) if (!used.has(w.id) && !ends.has(w.nodes[0])) chains.push(walk(w));
for (const w of ways) if (!used.has(w.id)) chains.push(walk(w));

const open = chains.filter((c) => !c.closed);
const rings = chains.filter((c) => c.closed);
if (open.length !== 1) throw new Error(`Expected one mainland chain, got ${open.length}`);

// Mainland: OSM coastline keeps land on the left. The chain enters from the north
// (west coast) and leaves to the east (past Hangklip), so close it round the east.
const main = open[0].coords;
const [sx, sy] = main[0];
const [ex, ey] = main[main.length - 1];
const mainland = [...main, [19.6, ey], [19.6, -33.0], [sx, -33.0], [sx, sy]];

// Signed area in degrees² (lon/lat), to drop specks and keep only real islands.
const ringArea = (r) => {
  let a = 0;
  for (let i = 0; i < r.length - 1; i++) a += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1];
  return a / 2;
};
const islands = rings.map((r) => r.coords).filter((r) => Math.abs(ringArea(r)) > 2e-6);

const EXTENT = [
  [18.2, -34.42],
  [19.05, -34.42],
  [19.05, -33.55],
  [18.2, -33.55],
  [18.2, -34.42],
];
const land = pc.intersection(pc.union([mainland], ...islands.map((r) => [r])), [EXTENT]);

// ---------- 2. Regions (lon, lat). Internal lines are simplified on purpose. ----------
// Shared vertices so neighbouring regions meet exactly.
const P = {
  A_: [18.395, -33.88], // sea, north of Mouille Point
  A: [18.398, -33.906], // coast between Green Point and Sea Point
  B: [18.4, -33.937], // Kloof Nek
  C: [18.404, -33.958], // Table Mountain
  D: [18.438, -33.952], // Devil's Peak
  E: [18.478, -33.938], // Observatory
  F: [18.495, -33.928], // Maitland
  G1: [18.497, -33.905],
  G2: [18.488, -33.88], // Milnerton lagoon mouth
  G2s: [18.47, -33.86],
  H: [18.4, -34.012], // Constantia Nek
  I: [18.385, -34.055], // Constantiaberg
  J: [18.358, -34.075], // Chapman's Peak
  Js: [18.25, -34.08],
  K: [18.505, -33.95],
  L: [18.507, -34.055],
  M: [18.487, -34.072],
  N: [18.445, -34.065], // Tokai
  Pc: [18.505, -34.11], // Muizenberg coast
  Q: [18.56, -34.12],
  R: [18.735, -34.0],
  S: [18.775, -33.99], // city edge near Firgrove
  V: [18.53, -33.88],
  W: [18.55, -33.8],
  X: [18.56, -33.7],
};
const at = (...keys) => keys.map((k) => (typeof k === "string" ? P[k] : k));

const REGIONS = [
  {
    id: "blaauwberg",
    name: "Blaauwberg",
    label: [18.505, -33.79],
    ring: at("G2s", "G2", "G1", "V", "W", "X", [18.56, -33.5], [18.3, -33.5], [18.4, -33.75], [18.42, -33.86]),
  },
  {
    id: "northern-suburbs",
    name: "Northern Suburbs",
    label: [18.655, -33.875],
    ring: at("F", "G1", "V", "W", [18.65, -33.76], [18.72, -33.775], [18.745, -33.8], [18.785, -33.845], [18.772, -33.88], [18.79, -33.92], [18.768, -33.955], "S", "R", [18.7, -33.99], [18.62, -33.965], [18.56, -33.955], "K"),
  },
  {
    id: "cape-town",
    name: "Cape Town",
    label: [18.428, -33.922],
    ring: at("A_", "A", "B", "C", "D", "E", "F", "G1", "G2", "G2s"),
  },
  {
    id: "atlantic-seaboard",
    name: "Atlantic Seaboard",
    label: [18.372, -33.985],
    ring: at([18.2, -33.88], "A_", "A", "B", "C", "H", "I", "J", "Js"),
  },
  {
    id: "southern-suburbs",
    name: "Southern Suburbs",
    label: [18.462, -33.995],
    ring: at("C", "D", "E", "F", "K", "L", "M", "N", "I", "H"),
  },
  {
    id: "cape-flats",
    name: "Cape Flats",
    label: [18.615, -34.02],
    ring: at("K", [18.56, -33.955], [18.62, -33.965], [18.7, -33.99], "R", [18.735, -34.3], [18.56, -34.3], "Q", "Pc", "M", "L"),
  },
  {
    id: "south-peninsula",
    name: "South Peninsula",
    label: [18.415, -34.165],
    ring: at("Js", "J", "I", "N", "M", "Pc", "Q", [18.56, -34.5], [18.2, -34.5]),
  },
  {
    id: "helderberg",
    name: "Helderberg",
    label: [18.85, -34.07],
    ring: at("R", "S", [18.8, -34.03], [18.87, -34.035], [18.92, -34.075], [18.95, -34.12], [18.92, -34.16], [18.885, -34.2], [18.86, -34.235], [18.8, -34.3], [18.735, -34.3]),
  },
];

const close = (r) => (r[0] === r[r.length - 1] ? r : [...r, r[0]]);
const regionGeoms = REGIONS.map((r) => ({ ...r, geom: pc.intersection(land, [[close(r.ring)]]) }));
const covered = pc.union(...regionGeoms.map((r) => r.geom));
const outside = pc.difference(land, covered);

// Overlap check: regions must not share land.
for (let i = 0; i < regionGeoms.length; i++)
  for (let j = i + 1; j < regionGeoms.length; j++) {
    const o = pc.intersection(regionGeoms[i].geom, regionGeoms[j].geom);
    const a = o.reduce((s, poly) => s + Math.abs(ringArea(poly[0])), 0);
    if (a > 1e-7) console.warn(`overlap ${regionGeoms[i].id} / ${regionGeoms[j].id}: ${a}`);
  }

// ---------- 3. Project (equirectangular around 34°S, units = km) ----------
const LON0 = 18.2;
const LAT0 = -33.55;
const KX = Math.cos((34 * Math.PI) / 180) * 111.32;
const KY = 110.95;
const proj = ([lon, lat]) => [(lon - LON0) * KX, (LAT0 - lat) * KY];

// Douglas-Peucker on projected rings.
function dp(pts, tol) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    const [ax, ay] = pts[s];
    const [bx, by] = pts[e];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy);
    let max = 0;
    let idx = -1;
    for (let i = s + 1; i < e; i++) {
      // Closed rings start and end on the same point: fall back to plain distance.
      const d =
        len < 1e-9
          ? Math.hypot(pts[i][0] - ax, pts[i][1] - ay)
          : Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    if (max > tol && idx > 0) {
      keep[idx] = 1;
      stack.push([s, idx], [idx, e]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

const TOL = 0.035; // km
const f = (n) => (Math.round(n * 100) / 100).toString();
function toPath(multi) {
  let d = "";
  for (const poly of multi)
    for (const ring of poly) {
      const pts = dp(ring.map(proj), TOL);
      if (pts.length < 4) continue;
      d += "M" + pts.slice(0, -1).map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z";
    }
  return d;
}

const out = {
  regions: regionGeoms.map((r) => ({ id: r.id, name: r.name, label: proj(r.label).map((n) => +n.toFixed(2)), d: toPath(r.geom) })),
  outside: toPath(outside),
  land: toPath(land),
  places: {
    tableBay: proj([18.43, -33.858]).map((n) => +n.toFixed(2)),
    falseBay: proj([18.66, -34.21]).map((n) => +n.toFixed(2)),
  },
};

const ts = `// Generated by scripts/build-map.mjs. Do not edit by hand.
// Coastline © OpenStreetMap contributors (ODbL). Regional divisions are simplified
// geographic references, not service boundaries. Units: km, equirectangular at 34°S.

export type MapRegion = { id: string; name: string; label: [number, number]; d: string };

export const REGIONS: MapRegion[] = ${JSON.stringify(out.regions, null, 2)};

export const OUTSIDE_LAND = ${JSON.stringify(out.outside)};

export const LAND = ${JSON.stringify(out.land)};

export const PLACES = ${JSON.stringify(out.places)} as const;
`;
const dest = path.join(root, "src/components/area-map/geo.ts");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, ts);
console.log(`wrote ${dest} (${(ts.length / 1024).toFixed(1)} KB)`);
console.log("projected extent:", proj([18.2, -34.42]), "to", proj([19.05, -33.55]));
for (const r of out.regions) console.log(r.id, r.label, r.d.length);
