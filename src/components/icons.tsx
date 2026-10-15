import type { SVGProps } from "react";

/** Roofline mark: roof pitch, gutter run and a downpipe. Redrawn from the mockup. */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 77 32" fill="none" aria-hidden="true" {...props}>
      <path
        d="M1.5 30.4 39.4 2.2 53.9 16.4H75.4M67.8 16.4V29.4H62.6"
        stroke="currentColor"
        strokeWidth="4.2"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`logo ${className ?? ""}`}>
      <LogoMark className="logo__mark" />
      <span className="logo__word">Cape Gutters</span>
    </span>
  );
}

export function Arrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 16" fill="none" aria-hidden="true" {...props}>
      <path d="M1 8h17M11.5 1.5 18 8l-6.5 6.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function Plus({ open, ...props }: SVGProps<SVGSVGElement> & { open?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" data-open={open ? "" : undefined} {...props}>
      <path d="M0 8h16" stroke="currentColor" strokeWidth="1.6" />
      <path className="plus__v" d="M8 0v16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
