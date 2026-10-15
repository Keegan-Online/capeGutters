import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryProvider } from "@/components/enquiry/enquiry-context";
import {
  IconArrow,
  IconFlow,
  IconGutter,
  IconMenu,
  IconNorth,
  IconPlusMinus,
  IconReplay,
  IconSearch,
  Symbol,
  Wordmark,
} from "@/components/site/brand";
import { GutterDrawing } from "@/components/site/gutter-drawing";
import { Faqs, ServiceRows, SiteEnquiryForm } from "@/components/site/interactive";
import { SiteFooter } from "@/components/site/sections";
import { SiteHeader } from "@/components/site/site-header";
import { SiteMap } from "@/components/site/site-map";

export const metadata: Metadata = { title: "Cape Gutters | Style guide" };

const COLOURS = [
  { name: "Charcoal", token: "--char", hex: "#1D1B17", note: "Dark sections, buttons, footer" },
  { name: "Ink", token: "--ink", hex: "#1C1A16", note: "Text on paper" },
  { name: "Paper", token: "--paper", hex: "#F3F0E9", note: "Page and light sections" },
  { name: "Paper light", token: "--paper-2", hex: "#F8F6F0", note: "Form area, cards" },
  { name: "Orange", token: "--orange", hex: "#E8642A", note: "Accent, gutter line, panel" },
  { name: "Orange deep", token: "--orange-deep", hex: "#D95A1E", note: "Large orange text on paper" },
  { name: "Orange ink", token: "--orange-ink", hex: "#B4470F", note: "Small orange text and links" },
  { name: "Ink 2", token: "--ink-2", hex: "#4A463F", note: "Secondary text on paper" },
];

const TYPE = [
  {
    name: "Display",
    spec: "Inter 650 · 76/0.88 mockup px · -0.038em",
    sample: "Every roofline.",
    cls: "fsg-t-display",
  },
  {
    name: "Section",
    spec: "Inter 600 to 700 · 47 to 51 · -0.035em",
    sample: "Cape Town. Connected.",
    cls: "fsg-t-section",
  },
  { name: "Service", spec: "Inter 500 · 30 · -0.03em", sample: "Installation & replacement", cls: "fsg-t-service" },
  {
    name: "Lede",
    spec: "Inter 400 · 12.5",
    sample: "Gutter installation, replacement, repairs and cleaning.",
    cls: "fsg-t-lede",
  },
  {
    name: "Body",
    spec: "Inter 400 · 11.5 / 1.5",
    sample: "Roof layout, gutter condition and access help define the work required.",
    cls: "fsg-t-body",
  },
  {
    name: "Small",
    spec: "Inter 500 · 9.5",
    sample: "Targeted solutions to keep your gutters working as they should.",
    cls: "fsg-t-small",
  },
];

const SPACE = [4, 8, 12, 16, 24, 32, 48, 72, 96];

const ICONS = [
  ["Arrow", IconArrow],
  ["Search", IconSearch],
  ["Expand", IconPlusMinus],
  ["Menu", IconMenu],
  ["Gutter", IconGutter],
  ["Flow", IconFlow],
  ["Replay", IconReplay],
  ["North", IconNorth],
] as const;

export default function StyleGuide() {
  return (
    <EnquiryProvider>
      <div className="site fsg">
        <SiteHeader />
        <main className="fsg__main">
          <header className="fsg__intro">
            <h1 className="fsg__title">Style guide</h1>
            <p className="fsg__lede">
              Proposed identity and components for the Cape Gutters website, from the Architectural Authority direction.
              Every piece below is the live component used on the site. The identity stays a proposal until Cape
              Gutters&rsquo; own brand assets are confirmed.
            </p>
          </header>

          <section className="fsg__block" aria-labelledby="fsg-logo">
            <h2 id="fsg-logo" className="fsg__h">
              Wordmark and symbol
            </h2>
            <p className="fsg__note">
              Two rooflines: a charcoal gable, and an orange roof whose eave runs on as the gutter line and ends in a
              short downpipe drop. Archivo, slightly expanded, fitted to the gutter line. Keep clear space equal to the
              symbol height; never recolour the gutter line.
            </p>
            <div className="fsg__logos">
              <div className="fsg__logo-tile">
                <Wordmark className="fsg__logo" />
              </div>
              <div className="fsg__logo-tile fsg__logo-tile--dark">
                <Wordmark tone="dark" className="fsg__logo" />
              </div>
              <div className="fsg__logo-tile fsg__logo-tile--orange">
                <Symbol className="fsg__symbol" />
              </div>
            </div>
          </section>

          <section className="fsg__block" aria-labelledby="fsg-colour">
            <h2 id="fsg-colour" className="fsg__h">
              Colour
            </h2>
            <ul className="fsg__swatches">
              {COLOURS.map((c) => (
                <li key={c.token}>
                  <span className="fsg__chip" style={{ background: c.hex }} />
                  <span className="fsg__sw-name">{c.name}</span>
                  <code>{c.hex}</code>
                  <span className="fsg__sw-note">{c.note}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="fsg__block" aria-labelledby="fsg-type">
            <h2 id="fsg-type" className="fsg__h">
              Typography
            </h2>
            <ul className="fsg__type">
              {TYPE.map((t) => (
                <li key={t.name}>
                  <span className="fsg__type-meta">
                    <strong>{t.name}</strong> {t.spec}
                  </span>
                  <span className={t.cls}>{t.sample}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="fsg__block" aria-labelledby="fsg-space">
            <h2 id="fsg-space" className="fsg__h">
              Spacing
            </h2>
            <p className="fsg__note">
              Desktop sizes come from the approved mockup in mockup pixels (one mockup pixel is about 1.9px at 1440).
              Mobile uses this px scale.
            </p>
            <ul className="fsg__space">
              {SPACE.map((n) => (
                <li key={n}>
                  <span style={{ width: n, height: n }} />
                  {n}
                </li>
              ))}
            </ul>
          </section>

          <section className="fsg__block" aria-labelledby="fsg-icons">
            <h2 id="fsg-icons" className="fsg__h">
              Icons
            </h2>
            <p className="fsg__note">24-unit grid, 1.5 stroke, square ends. Drawn for this site.</p>
            <ul className="fsg__icons">
              {ICONS.map(([name, Icon]) => (
                <li key={name}>
                  <Icon />
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="fsg__block" aria-labelledby="fsg-buttons">
            <h2 id="fsg-buttons" className="fsg__h">
              Buttons and links
            </h2>
            <div className="fsg__row">
              <Link href="/#enquire" className="btn-s btn-s--dark">
                <span>Discuss your project</span>
                <IconArrow className="btn-s__icon" />
              </Link>
              <Link href="/#areas" className="link-s">
                Check availability
                <IconArrow />
              </Link>
            </div>
          </section>

          <section className="fsg__block fsg__block--flush" aria-labelledby="fsg-nav">
            <h2 id="fsg-nav" className="fsg__h fsg__pad">
              Navigation
            </h2>
            <p className="fsg__note fsg__pad">
              Over the hero on the homepage, solid once scrolled. Variations is the tab for the earlier homepages.
            </p>
            <div className="fsg__header-demo">
              <SiteHeader />
            </div>
          </section>

          <section className="fsg__block fsg__block--split" aria-labelledby="fsg-services">
            <div className="fsg__pad">
              <h2 id="fsg-services" className="fsg__h">
                Service rows
              </h2>
              <p className="fsg__note">Each row opens the enquiry with that service attached.</p>
              <ServiceRows />
            </div>
            <div className="svc-sec__panel fsg__panel">
              <GutterDrawing />
            </div>
          </section>

          <section className="fsg__block" aria-labelledby="fsg-form">
            <h2 id="fsg-form" className="fsg__h">
              Enquiry form and FAQs
            </h2>
            <p className="fsg__note">
              Persistent labels, validation that keeps what you typed, and an honest DEMO result. Try sending it empty.
            </p>
            <div className="fsg__form">
              <SiteEnquiryForm deliveryConfigured={Boolean(process.env.ENQUIRY_WEBHOOK_URL)} />
              <Faqs />
            </div>
          </section>

          <section className="fsg__block fsg__block--flush" aria-labelledby="fsg-map">
            <h2 id="fsg-map" className="fsg__h fsg__pad">
              Map states
            </h2>
            <p className="fsg__note fsg__pad">
              Select a region or search a suburb: the region fills orange, a callout names it and carries it into the
              enquiry. A geographic guide, never a promise of coverage.
            </p>
            <SiteMap />
          </section>

          <section className="fsg__block" aria-labelledby="fsg-motion">
            <h2 id="fsg-motion" className="fsg__h">
              Motion
            </h2>
            <ul className="fsg__motion">
              <li>
                <strong>Hero entrance</strong> Headline, lede and button rise 14px into place once, 700ms, strong
                ease-out.
              </li>
              <li>
                <strong>Roofline</strong> The orange gutter line on the hero photo draws once, 1s, after the headline.
              </li>
              <li>
                <strong>Gutter drawing</strong> The white section never moves. Once, when it enters view, the fine orange
                highlight draws in order: down the roof to its edge, then along the gutter and down through the outlet
                (about 3s). It then holds.
              </li>
              <li>
                <strong>Feedback</strong> Buttons press to 98%, arrows nudge 3px, links underline from the left. 160 to
                220ms.
              </li>
              <li>
                <strong>Map</strong> Region fill eases in, callout slides 6px, 260ms.
              </li>
              <li>
                <strong>FAQs and form</strong> Answers open by height, 280ms. A field with an error nudges once.
              </li>
              <li>
                <strong>Reduced motion</strong> Everything is shown in its finished state, with no movement.
              </li>
            </ul>
          </section>
        </main>
        <SiteFooter />
      </div>
    </EnquiryProvider>
  );
}
