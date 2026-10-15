// Geometry for the gutter system drawing (draws itself on scroll).
// A small 3D model (units: cm) projected to 2D with a fixed oblique view:
// X runs along the wall (the gutter), Y is up, Z comes out from the wall.
// Explanatory illustration only: proportions are typical, not a product spec.

export type V3 = [number, number, number];
export type V2 = [number, number];

const EX: V2 = [0.88, -0.3]; // along the gutter: right and receding
const EZ: V2 = [-0.62, 0.34]; // out from the wall: toward the viewer

export const proj = ([x, y, z]: V3): V2 => [x * EX[0] + z * EZ[0], -y + x * EX[1] + z * EZ[1]];

const f = (n: number) => Math.round(n * 100) / 100;
export const pathOf = (pts: V3[], close = false) =>
  pts.map((p, i) => `${i ? "L" : "M"}${f(proj(p)[0])} ${f(proj(p)[1])}`).join("") + (close ? "Z" : "");

// ---------- Dimensions ----------
export const L = 118; // visible gutter run
export const XO = 76; // outlet position along the run
const ROOF_EDGE: [number, number] = [5, 5]; // (Z, Y) of the eaves edge, overhanging the gutter
const ROOF_BACK: [number, number] = [-30, 19.5];
const WALL_Z = -27;
const GROUND_Y = -98;
const PIPE = 3.3; // half width of the square downpipe

// Gutter profile in (Z, Y): back against the fascia, rounded sole, flared front, beaded lip.
const PROFILE: [number, number][] = [
  [0.6, 0],
  [0.6, -7],
  [1.2, -8.6],
  [2.8, -9.6],
  [9.4, -9.6],
  [11.2, -8.8],
  [12.2, -6.6],
  [12.9, -2.6],
  [13.3, -0.6],
];
const BEAD_C: [number, number] = [13.5, 0.5];
const BEAD_R = 1.1;
const bead = (n = 10): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = -Math.PI / 2 - 0.4 + (i / n) * (Math.PI * 1.7);
    return [BEAD_C[0] + Math.cos(a) * BEAD_R, BEAD_C[1] + Math.sin(a) * BEAD_R] as [number, number];
  });
const FULL_PROFILE = [...PROFILE, ...bead()];

const at = (x: number, zy: [number, number][]): V3[] => zy.map(([z, y]) => [x, y, z]);

// ---------- Static drawing ----------
export const fascia = {
  face: pathOf(
    [
      [0, 2.5, 0],
      [L + 8, 2.5, 0],
      [L + 8, -16, 0],
      [0, -16, 0],
    ],
    true,
  ),
  end: pathOf(
    [
      [0, 2.5, 0],
      [0, 2.5, -2.5],
      [0, -16, -2.5],
      [0, -16, 0],
    ],
    true,
  ),
};

export const soffit = pathOf([
  [0, -16, -2.5],
  [0, -16, WALL_Z],
]);
export const wall = {
  corner: pathOf([
    [0, -16, WALL_Z],
    [0, GROUND_Y, WALL_Z],
  ]),
  base: pathOf([
    [0, GROUND_Y, WALL_Z],
    [L + 8, GROUND_Y, WALL_Z],
  ]),
  ground: pathOf([
    [0, GROUND_Y, WALL_Z],
    [0, GROUND_Y, 18],
  ]),
};

const roofAt = (t: number): [number, number] => [
  ROOF_EDGE[0] + (ROOF_BACK[0] - ROOF_EDGE[0]) * t,
  ROOF_EDGE[1] + (ROOF_BACK[1] - ROOF_EDGE[1]) * t,
];
export const roof = {
  end: pathOf(
    [
      [0, ROOF_EDGE[1], ROOF_EDGE[0]],
      [0, ROOF_BACK[1], ROOF_BACK[0]],
      [0, ROOF_BACK[1] + 1.6, ROOF_BACK[0]],
      [0, ROOF_EDGE[1] + 1.6, ROOF_EDGE[0] + 0.4],
    ],
    true,
  ),
  surface: pathOf(
    [
      [0, ROOF_EDGE[1] + 1.6, ROOF_EDGE[0] + 0.4],
      [L + 8, ROOF_EDGE[1] + 1.6, ROOF_EDGE[0] + 0.4],
      [L + 8, ROOF_BACK[1] + 1.6, ROOF_BACK[0]],
      [0, ROOF_BACK[1] + 1.6, ROOF_BACK[0]],
    ],
    true,
  ),
  edge: pathOf([
    [0, ROOF_EDGE[1], ROOF_EDGE[0]],
    [L + 8, ROOF_EDGE[1], ROOF_EDGE[0]],
  ]),
  edgeTop: pathOf([
    [0, ROOF_EDGE[1] + 1.6, ROOF_EDGE[0] + 0.4],
    [L + 8, ROOF_EDGE[1] + 1.6, ROOF_EDGE[0] + 0.4],
  ]),
  courses: [0.3, 0.6].map((t) => {
    const [z, y] = roofAt(t);
    return pathOf([
      [0, y + 1.6, z],
      [L + 8, y + 1.6, z],
    ]);
  }),
};

export const gutter = {
  /** The stop end: the profile, seen face on. */
  end: pathOf(at(0, FULL_PROFILE), true),
  /** Inside face of the back wall and sole, behind the water. */
  inside: pathOf(
    [
      ...at(0, [
        [0.6, 0],
        [0.6, -7],
        [2.8, -9.6],
        [9.4, -9.6],
      ]),
      ...at(L, [
        [9.4, -9.6],
        [2.8, -9.6],
        [0.6, -7],
        [0.6, 0],
      ]),
    ],
    true,
  ),
  /** Outside front face, drawn translucent so the water reads through it. */
  front: pathOf(
    [
      ...at(0, [
        [13.3, -0.6],
        [12.9, -2.6],
        [12.2, -6.6],
        [11.2, -8.8],
        [9.4, -9.6],
      ]),
      ...at(L, [
        [9.4, -9.6],
        [11.2, -8.8],
        [12.2, -6.6],
        [12.9, -2.6],
        [13.3, -0.6],
      ]),
    ],
    true,
  ),
  /** Long lines along the run at profile vertices. */
  runs: (
    [
      [0.6, 0],
      [13.6, 1.6],
      [13.3, -0.6],
      [12.2, -6.6],
      [9.4, -9.6],
      [2.8, -9.6],
    ] as [number, number][]
  ).map(([z, y]) =>
    pathOf([
      [0, y, z],
      [L, y, z],
    ]),
  ),
  brackets: [22, 64, 128].map((x) => pathOf(at(x, FULL_PROFILE))),
};

// ---------- Square downpipe (outlet, swan neck offset, downpipe, shoe) ----------
type Seg = { a: V3; b: V3; n: V3 }; // centre line from a to b; n = unit normal of the visible front face
const s2 = Math.SQRT1_2;
const C = { z: 6.4 }; // pipe centre under the gutter
const P1: V3 = [XO, -9.6, C.z];
const P2: V3 = [XO, -19, C.z];
const OFFSET = C.z - (WALL_Z + PIPE + 0.4); // how far the swan neck steps back to the wall
const P3: V3 = [XO, -19 - OFFSET, C.z - OFFSET];
const P4: V3 = [XO, GROUND_Y + 9, P3[2]];
const P5: V3 = [XO, GROUND_Y + 2.2, P3[2] + 6.8];

export const PIPE_SEGMENTS: Seg[] = [
  { a: P4, b: P5, n: [0, s2, s2] }, // shoe, kicking out at the bottom
  { a: P3, b: P4, n: [0, 0, 1] }, // downpipe down the wall
  { a: P2, b: P3, n: [0, -s2, s2] }, // swan neck, stepping back to the wall
  { a: P1, b: P2, n: [0, 0, 1] }, // outlet
];

function corners(seg: Seg) {
  const { a, b, n } = seg;
  const w = PIPE;
  const off = (p: V3, dx: number, dn: number): V3 => [p[0] + dx, p[1] + n[1] * dn, p[2] + n[2] * dn];
  return {
    // Front face (normal n) and left face (normal -X).
    front: [off(a, -w, w), off(a, w, w), off(b, w, w), off(b, -w, w)],
    left: [off(a, -w, -w), off(a, -w, w), off(b, -w, w), off(b, -w, -w)],
  };
}
export const pipe = PIPE_SEGMENTS.map((seg) => {
  const c = corners(seg);
  return { front: pathOf(c.front, true), left: pathOf(c.left, true) };
});
// Collars where fittings meet.
export const collars = [P2, P3, P4].map((p) =>
  pathOf([
    [p[0] - PIPE - 0.5, p[1], p[2] + PIPE + 0.5],
    [p[0] + PIPE + 0.5, p[1], p[2] + PIPE + 0.5],
  ]),
);
export const gully = pathOf(
  [
    [XO - 6, GROUND_Y, P5[2] - 2],
    [XO + 6, GROUND_Y, P5[2] - 2],
    [XO + 6, GROUND_Y, P5[2] + 9],
    [XO - 6, GROUND_Y, P5[2] + 9],
  ],
  true,
);
export const gullyBars = [-3, 0, 3].map((dx) =>
  pathOf([
    [XO + dx, GROUND_Y, P5[2] - 1],
    [XO + dx, GROUND_Y, P5[2] + 8],
  ]),
);

// ---------- Label anchors (2D) ----------
export const anchors = {
  roof: proj([18, ROOF_EDGE[1] + 0.8, ROOF_EDGE[0]]),
  gutter: proj([0, -5, 12.6]),
  outlet: proj([XO, -14, C.z + PIPE]),
  downpipe: proj([XO, -78, P3[2] + PIPE]),
};

// ---------- View box ----------
const all: V2[] = [
  proj([0, ROOF_BACK[1] + 2, ROOF_BACK[0]]),
  proj([L + 8, ROOF_BACK[1] + 2, ROOF_BACK[0]]),
  proj([0, GROUND_Y, 18]),
  proj([L + 8, GROUND_Y, WALL_Z]),
  proj([0, 0, 15]),
];
const xs = all.map((p) => p[0]);
const ys = all.map((p) => p[1]);
const PAD = 8;
export const VIEW = {
  x: Math.min(...xs) - PAD - 22,
  y: Math.min(...ys) - PAD,
  w: Math.max(...xs) - Math.min(...xs) + PAD * 2 + 22,
  h: Math.max(...ys) - Math.min(...ys) + PAD * 2,
};
