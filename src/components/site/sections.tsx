import Image from "next/image";
import Link from "next/link";
import { Lines } from "../lines";
import { IconArrow, Wordmark } from "./brand";
import { ENQUIRE, FOOTER_NOTE, HERO, NAV, SPEC } from "./content";

/* ---------- Hero ---------- */
export function Hero() {
  return (
    <section className="hero-s" aria-labelledby="hero-title">
      <div className="hero-s__media">
        {/* The photo and its roofline accent share one box of the photo's own ratio, so the line stays on the gutter. */}
        <div className="hero-s__plate">
          <Image
            src="/images/final/hero-arch-tall.webp"
            alt="Contemporary white house with dark box gutters and downpipes in late afternoon light. Illustrative image."
            fill
            priority
            sizes="(min-width: 900px) 100vw, 120vw"
            className="hero-s__img"
          />
          <svg className="hero-s__roofline" viewBox="0 0 1536 1324" aria-hidden="true">
            <path d="M624 824 1094 502" pathLength={1} />
          </svg>
        </div>
      </div>
      <div className="hero-s__copy">
        <h1 id="hero-title" className="hero-s__title">
          <span className="hero-s__line">{HERO.title[0]}</span>
          <span className="hero-s__line hero-s__line--accent">{HERO.title[1]}</span>
        </h1>
        <p className="hero-s__lede">{HERO.lede}</p>
        <a href="#enquire" className="btn-s btn-s--dark hero-s__action">
          <span>{HERO.action}</span>
          <IconArrow className="btn-s__icon" />
        </a>
      </div>
    </section>
  );
}

/* ---------- Specification guidance ---------- */
export function Spec() {
  return (
    <section className="spec" aria-labelledby="spec-title">
      <div className="spec__copy">
        <h2 id="spec-title" className="spec__title">
          {SPEC.title.slice(0, 3).map((l) => (
            <span key={l} className="ln-s">
              {l}{" "}
            </span>
          ))}
          <span className="ln-s spec__accent">{SPEC.title[3]}</span>
        </h2>
        <p className="spec__lede">
          <Lines text={SPEC.lede} />
        </p>
        <ul className="spec__factors" aria-label="What shapes the specification">
          {SPEC.factors.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
      <div className="spec__photos">
        <div className="spec__photo spec__photo--a">
          <Image
            src="/images/final/gable.webp"
            alt="Cape Dutch gable with a dark half-round gutter and downpipe. Illustrative image."
            fill
            sizes="(min-width: 900px) 37vw, 70vw"
          />
        </div>
        <div className="spec__photo spec__photo--b">
          <Image
            src="/images/final/corner.webp"
            alt="Modern house corner with a dark fascia, box gutter and slim downpipe. Illustrative image."
            fill
            sizes="(min-width: 900px) 28vw, 55vw"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Enquiry intro (orange panel) ---------- */
export function EnquireIntro() {
  return (
    <div className="enq__intro">
      <h2 id="enquire-title" className="enq__title">
        <span className="ln-s">{ENQUIRE.title[0]}</span> <span className="ln-s">{ENQUIRE.title[1]}</span>
      </h2>
      <p className="enq__lede">
        <Lines text={ENQUIRE.lede} />
      </p>
      <span className="enq__rule" aria-hidden="true" />
    </div>
  );
}

/* ---------- Footer ---------- */
export function SiteFooter() {
  return (
    <footer className="sf">
      {/* Thin rule that rises into the orange roofline at its right end (from the Home page 2 footer). */}
      <div className="sf__line" aria-hidden="true">
        <svg className="sf__roof" viewBox="0 0 132 17" preserveAspectRatio="none">
          <path d="M0 16 L48 1 L86.5 16 H132" />
        </svg>
      </div>
      <div className="sf__inner">
        <Link href="/" className="sf__brand" aria-label="Cape Gutters, home">
          <Wordmark tone="dark" className="sf__logo" />
        </Link>
        <nav aria-label="Footer">
          <ul className="sf__nav">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
            <li>
              <Link href="/variations">Variations</Link>
            </li>
          </ul>
        </nav>
        <span className="sf__rule" aria-hidden="true" />
        <p className="sf__note">{FOOTER_NOTE}</p>
      </div>
    </footer>
  );
}
