import type { SVGProps } from "react";

/*
  Proposed Cape Gutters identity (until the client's own assets are confirmed).

  The symbol is two rooflines: a charcoal gable, and an orange roof whose eave
  runs on as the gutter line and ends in a short downpipe drop. The wordmark is
  set in Archivo, slightly expanded, and fitted to the gutter line's exact length.
*/

type Tone = "light" | "dark";

/** Full lockup: symbol above the wordmark. 200 x 66 units, proportions from the approved mockup. */
export function Wordmark({
  tone = "light",
  className,
  title = "Cape Gutters",
}: {
  tone?: Tone;
  className?: string;
  title?: string;
}) {
  const ink = tone === "light" ? "var(--ink)" : "var(--paper)";
  return (
    <svg viewBox="0 0 200 66" className={className} role="img" aria-label={title} data-tone={tone}>
      <path d="M2.4 33.4 77.8 4.6 104 21.6" fill="none" stroke={ink} strokeWidth="2.3" strokeLinejoin="miter" />
      <path
        className="brand-gutter"
        d="M93.6 2.2 119 29.4H197.2V37"
        fill="none"
        stroke="var(--orange)"
        strokeWidth="2.3"
        strokeLinejoin="miter"
      />
      <text x="1.6" y="63.4" textLength="196.4" lengthAdjust="spacingAndGlyphs" fill={ink} className="brand-type">
        CAPE GUTTERS
      </text>
    </svg>
  );
}

/** Symbol on its own (favicon, small spaces). 64 x 28 units. */
export function Symbol({ tone = "light", className }: { tone?: Tone; className?: string }) {
  const ink = tone === "light" ? "var(--ink)" : "var(--paper)";
  return (
    <svg viewBox="0 0 64 28" className={className} aria-hidden="true">
      <path d="M2 25 25.6 6.2 35.4 12.6" fill="none" stroke={ink} strokeWidth="2.2" />
      <path d="M31 3.6 45 17.4H61.6V23.6" fill="none" stroke="var(--orange)" strokeWidth="2.2" />
    </svg>
  );
}

/* ---------- Icons: 24-unit grid, 1.5 stroke, square ends ---------- */

type IconProps = SVGProps<SVGSVGElement>;
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square" as const,
  "aria-hidden": true,
};

export const IconArrow = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3.5 12h16M14 6.5l5.5 5.5-5.5 5.5" />
  </svg>
);

export const IconSearch = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="10.5" cy="10.5" r="6.25" />
    <path d="m15.2 15.2 5.3 5.3" />
  </svg>
);

export const IconPlusMinus = ({ open, ...p }: IconProps & { open?: boolean }) => (
  <svg {...base} {...p} data-open={open ? "" : undefined}>
    <path d="M4.5 12h15" />
    <path className="icon-pm__v" d="M12 4.5v15" />
  </svg>
);

/** Water drop with a flow line: "Show water flow". */
export const IconFlow = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3.5c3 3.8 5 6.7 5 9.4a5 5 0 0 1-10 0c0-2.7 2-5.6 5-9.4Z" />
    <path d="M9.6 13.4a2.6 2.6 0 0 0 2.4 2.4" />
  </svg>
);

export const IconReplay = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5.2 9.2A7.5 7.5 0 1 1 4.5 13" />
    <path d="M4.6 4.8v4.6h4.6" />
  </svg>
);

/** Gutter profile: install / replace. */
export const IconGutter = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 7.5h18M5 7.5v3.2c0 2.6 1.9 4.3 4.5 4.3h5c2.6 0 4.5-1.7 4.5-4.3V7.5M12 15v5.5" />
  </svg>
);

export const IconNorth = (p: IconProps) => (
  <svg {...base} {...p} viewBox="0 0 24 32">
    <path d="M12 9 17 27l-5-4-5 4 5-18Z" strokeLinecap="butt" strokeLinejoin="miter" />
    <path d="M9 7.5V1.5l6 6V1.5" strokeWidth="1.3" />
  </svg>
);

export const IconMenu = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3.5 8.5h17M3.5 15.5h17" />
  </svg>
);

export const IconClose = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
  </svg>
);
