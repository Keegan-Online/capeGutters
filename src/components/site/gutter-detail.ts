// Gutter system detail: an authored 2D section at the eaves, drawn like an
// architectural detail. Roof covering over rafter and fascia, K-style gutter in
// section (the focus), drop outlet, 45° offset (swan neck) back to the wall,
// downpipe with clips, discharging into a gully hopper at ground level.
// Explanatory illustration, not a product spec. Units: SVG user units, y down.

type P = [number, number];
const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = ([x, y]: P) => `${r1(x)} ${r1(y)}`;
const poly = (pts: P[], close = false) => "M" + pts.map(pt).join("L") + (close ? "Z" : "");

export const VIEW = { x: 8, y: 48, w: 520, h: 572 };

// ---------- Roof ----------
const K = Math.tan((22 * Math.PI) / 180); // roof pitch 22°
const EDGE_X = 250; // eaves edge of the covering, a third of the way over the gutter
const BREAK_X = 500; // where the section is cut
const A = (x: number) => 196 - K * (x - EDGE_X); // underside of covering
const T = (x: number) => A(x) - 9; // top of covering
const R1 = (x: number) => A(x) + 10; // top of rafter (battens between)
const R2 = (x: number) => A(x) + 60; // underside of rafter

// ---------- Gutter (drawn in local units, scaled up so it leads the drawing) ----------
const GX = 300; // back of gutter = fascia face
const GY = 226; // top of gutter back
const S = 1.4;
const g = (x: number, y: number) => `${r1(GX + x * S)} ${r1(GY + y * S)}`;
const gp = (x: number, y: number): P => [GX + x * S, GY + y * S];
const R = r1(5 * S);

const FASCIA = { x0: GX, x1: GX + 18, y0: A(GX) + 1.5, y1: GY + 84 * S };
const WALL_X = 352;
const SOFFIT = { y0: GY + 74 * S, y1: GY + 74 * S + 8 };
const GROUND_Y = 600;

export const roof = {
  // Open at the cut and the fascia, so no edge is drawn twice.
  covering: poly([
    [BREAK_X, T(BREAK_X)],
    [EDGE_X, T(EDGE_X)],
    [EDGE_X, A(EDGE_X)],
    [BREAK_X, A(BREAK_X)],
  ]),
  coveringFill: poly(
    [
      [EDGE_X, A(EDGE_X)],
      [BREAK_X, A(BREAK_X)],
      [BREAK_X, T(BREAK_X)],
      [EDGE_X, T(EDGE_X)],
    ],
    true,
  ),
  rafter:
    poly([
      [FASCIA.x1, R1(FASCIA.x1)],
      [BREAK_X, R1(BREAK_X)],
    ]) +
    poly([
      [FASCIA.x1, R2(FASCIA.x1)],
      [BREAK_X, R2(BREAK_X)],
    ]),
  battens: [366, 446].map((x) => {
    const a = Math.atan(K);
    const ux = Math.cos(a);
    const uy = -Math.sin(a);
    const b: P = [x, R1(x)];
    const w = 12;
    const h = 10;
    return poly([b, [b[0] + ux * w, b[1] + uy * w], [b[0] + ux * w, b[1] + uy * w - h], [b[0], b[1] - h]], true);
  }),
  cut: poly([
    [BREAK_X - 4, T(BREAK_X) - 8],
    [BREAK_X + 3, (T(BREAK_X) + R2(BREAK_X)) / 2 - 7],
    [BREAK_X - 3, (T(BREAK_X) + R2(BREAK_X)) / 2 + 7],
    [BREAK_X + 4, R2(BREAK_X) + 8],
  ]),
};

export const structure = {
  fascia: poly(
    [
      [FASCIA.x0, FASCIA.y0],
      [FASCIA.x1, FASCIA.y0],
      [FASCIA.x1, FASCIA.y1],
      [FASCIA.x0, FASCIA.y1],
    ],
    true,
  ),
  soffit: poly([
    [FASCIA.x1, SOFFIT.y0],
    [WALL_X, SOFFIT.y0],
    [WALL_X, SOFFIT.y1],
    [FASCIA.x1, SOFFIT.y1],
  ]),
  soffitFill: poly(
    [
      [FASCIA.x1, SOFFIT.y0],
      [WALL_X, SOFFIT.y0],
      [WALL_X, SOFFIT.y1],
      [FASCIA.x1, SOFFIT.y1],
    ],
    true,
  ),
  wall: poly([
    [WALL_X, SOFFIT.y1],
    [WALL_X, VIEW.y + VIEW.h],
  ]),
};

// K-style profile in local units: back at x=0, front at x=-114, top y=0, sole y=74.
export const gutter = {
  outer:
    `M${g(0, 0)}L${g(0, 62)}Q${g(0, 74)} ${g(-12, 74)}L${g(-82, 74)}Q${g(-94, 74)} ${g(-96, 63)}` +
    `L${g(-101, 42)}C${g(-103, 32)} ${g(-114, 31)} ${g(-114, 20)}L${g(-114, 2)}` +
    `A${R} ${R} 0 0 1 ${g(-104, 2)}L${g(-104, 7)}`,
  inner:
    `M${g(-3, 0)}L${g(-3, 61)}Q${g(-3, 71)} ${g(-13, 71)}L${g(-81, 71)}Q${g(-91, 71)} ${g(-93, 62)}` +
    `L${g(-98, 42)}C${g(-100, 33)} ${g(-111, 32)} ${g(-111, 20)}L${g(-111, 6)}`,
  cap: `M${g(-3, 0)}L${g(0, 0)}`,
  trough:
    `M${g(-3, 6)}L${g(-3, 61)}Q${g(-3, 71)} ${g(-13, 71)}L${g(-81, 71)}Q${g(-91, 71)} ${g(-93, 62)}` +
    `L${g(-98, 42)}C${g(-100, 33)} ${g(-111, 32)} ${g(-111, 20)}L${g(-111, 6)}Z`,
};

// ---------- Outlet and downpipe ----------
const H = 24; // half width of the square pipe
const SOLE_Y = GY + 74 * S;
const OUT_X = Math.round(GX - 47 * S); // outlet centred on the sole
const SOCKET = { x0: OUT_X - H - 4, x1: OUT_X + H + 4, y0: SOLE_Y, y1: SOLE_Y + 14 };
const PIPE_X = WALL_X - 4 - H; // pipe centre on the wall, 4 units off for the clips
const HOPPER = { x0: PIPE_X - H - 16, x1: WALL_X, y0: GROUND_Y - 34 };
const C: P[] = [
  [OUT_X, SOCKET.y1],
  [OUT_X, SOCKET.y1 + 18],
  [PIPE_X, SOCKET.y1 + 18 + (PIPE_X - OUT_X)],
  [PIPE_X, HOPPER.y0 + 22],
];

type V = [number, number];
const sub = (a: P, b: P): V => [a[0] - b[0], a[1] - b[1]];
const norm = (v: V): V => {
  const l = Math.hypot(v[0], v[1]);
  return [v[0] / l, v[1] / l];
};
const nrm = (d: V): V => [-d[1], d[0]]; // left of travel (x- when heading down)

function offset(pts: P[], d: number): P[] {
  return pts.map((p, i) => {
    const dirs: V[] = [];
    if (i > 0) dirs.push(norm(sub(p, pts[i - 1])));
    if (i < pts.length - 1) dirs.push(norm(sub(pts[i + 1], p)));
    const ns = dirs.map(nrm);
    if (ns.length === 1) return [p[0] + ns[0][0] * d, p[1] + ns[0][1] * d];
    const m = norm([ns[0][0] + ns[1][0], ns[0][1] + ns[1][1]]);
    const cos = m[0] * ns[0][0] + m[1] * ns[0][1];
    return [p[0] + (m[0] * d) / cos, p[1] + (m[1] * d) / cos];
  });
}

const LEFT = offset(C, H);
const RIGHT = offset(C, -H);

/** A band across the pipe (fitting socket) starting at distance s along segment i. */
function band(i: number, s: number, len: number, grow: number) {
  const a = C[i];
  const u = norm(sub(C[i + 1], a));
  const n = nrm(u);
  const p0: P = [a[0] + u[0] * s, a[1] + u[1] * s];
  const p1: P = [p0[0] + u[0] * len, p0[1] + u[1] * len];
  const w = H + grow;
  return poly(
    [
      [p0[0] + n[0] * w, p0[1] + n[1] * w],
      [p1[0] + n[0] * w, p1[1] + n[1] * w],
      [p1[0] - n[0] * w, p1[1] - n[1] * w],
      [p0[0] - n[0] * w, p0[1] - n[1] * w],
    ],
    true,
  );
}

export const pipe = {
  body: poly([...LEFT, ...[...RIGHT].reverse()], true),
  socket: poly(
    [
      [SOCKET.x0, SOCKET.y0],
      [SOCKET.x1, SOCKET.y0],
      [SOCKET.x1, SOCKET.y1],
      [SOCKET.x0, SOCKET.y1],
    ],
    true,
  ),
  /** Joint seams at the two elbows (the line between the mitre points). */
  seams: [1, 2].map((i) => poly([LEFT[i], RIGHT[i]])),
  /** Fitting sockets: after the first elbow and at the top of the wall run. */
  collars: [band(1, 14, 8, 2.5), band(2, 10, 8, 2.5)],
  /** Wall clips on the vertical run, band plus fixing tab to the wall. */
  clips: [512].map((y) =>
    poly(
      [
        [PIPE_X - H - 2, y],
        [WALL_X, y],
        [WALL_X, y + 7],
        [PIPE_X - H - 2, y + 7],
      ],
      true,
    ),
  ),
  /** Gully hopper the downpipe discharges into, at ground level. Its right side is the wall. */
  hopperFill: poly(
    [
      [HOPPER.x0, HOPPER.y0],
      [HOPPER.x1, HOPPER.y0],
      [HOPPER.x1, VIEW.y + VIEW.h],
      [HOPPER.x0, VIEW.y + VIEW.h],
    ],
    true,
  ),
  hopper: poly([
    [HOPPER.x0, VIEW.y + VIEW.h],
    [HOPPER.x0, HOPPER.y0],
    [HOPPER.x1, HOPPER.y0],
  ]),
  hopperRim: poly([
    [HOPPER.x0, HOPPER.y0 + 6],
    [HOPPER.x1, HOPPER.y0 + 6],
  ]),
};

// ---------- Ground ----------
export const ground = {
  line: poly([
    [56, GROUND_Y],
    [HOPPER.x0, GROUND_Y],
  ]),
  hatch: Array.from({ length: 16 }, (_, i) => 66 + i * 14)
    .filter((x) => x < HOPPER.x0 - 2)
    .map((x) =>
      poly([
        [x, GROUND_Y + 2],
        [x - 7, GROUND_Y + 9],
      ]),
    )
    .join(""),
};

// ---------- Orange highlight: the roof edge, then along the gutter and down the outlet ----------
export const highlight = {
  roof: poly([
    [BREAK_X, T(BREAK_X)],
    [EDGE_X, T(EDGE_X)],
    [EDGE_X, A(EDGE_X)],
  ]),
  route:
    `M${g(-104, 7)}L${g(-104, 2)}A${R} ${R} 0 0 0 ${g(-114, 2)}L${g(-114, 20)}` +
    `C${g(-114, 31)} ${g(-103, 32)} ${g(-101, 42)}L${g(-96, 63)}Q${g(-94, 74)} ${g(-82, 74)}` +
    `L${SOCKET.x0} ${r1(SOCKET.y0)}L${SOCKET.x0} ${r1(SOCKET.y1)}L` +
    LEFT.map(pt).join("L"),
};

// ---------- Labels: leader runs from beside the text to a point on the part ----------
const front = gp(-114, 18);
export const LABELS = {
  roof: {
    text: "Roof edge",
    leader: [
      [118, 138],
      [176, 138],
      [EDGE_X, (A(EDGE_X) + T(EDGE_X)) / 2],
    ] as P[],
  },
  gutter: {
    text: "Gutter",
    leader: [
      [98, front[1]],
      [front[0], front[1]],
    ] as P[],
  },
  outlet: {
    text: "Outlet",
    leader: [
      [118, 382],
      [176, 382],
      [SOCKET.x0, SOCKET.y1 - 5],
    ] as P[],
  },
  downpipe: {
    text: "Downpipe",
    leader: [
      [226, 512],
      [PIPE_X - H, 512],
    ] as P[],
  },
} as const;
export const leaderPath = (pts: readonly P[]) => poly([...pts]);

// Grid, deliberately quiet.
export const GRID = 30;
