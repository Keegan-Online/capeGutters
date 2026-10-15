import type { Metadata } from "next";
import Link from "next/link";
import { AreaMap } from "@/components/area-map/area-map";
import { COPY, type Variant } from "@/components/content";
import { EnquiryProvider } from "@/components/enquiry/enquiry-context";
import { EnquiryForm } from "@/components/enquiry/enquiry-form";
import { Arrow, Logo } from "@/components/icons";
import { FaqAccordion, ServiceList } from "@/components/sections-client";
import { SiteFooter, Steps } from "@/components/home-page";
import { SiteHeader } from "@/components/site-header";
import { AreaActionSpecimen, QuoteSpecimen } from "./specimens";
import "./style-guide.css";

export const metadata: Metadata = { title: "Cape Gutters | Style guide" };

const SWATCHES: Record<Variant, { name: string; value: string }[]> = {
  one: [
    { name: "Off-white", value: "#fcfbfa" },
    { name: "Ink", value: "#161513" },
    { name: "Orange", value: "#eb6826" },
    { name: "Band", value: "#352d27" },
    { name: "Muted", value: "#696c74" },
    { name: "Water", value: "#d3e4ec" },
    { name: "Land", value: "#f4e7d7" },
  ],
  two: [
    { name: "Charcoal", value: "#211e19" },
    { name: "Ivory", value: "#f0ebe2" },
    { name: "Orange", value: "#ec6b2e" },
    { name: "Text on dark", value: "#f2efe7" },
    { name: "Muted on ivory", value: "#5d5b57" },
    { name: "Land", value: "#c4b9ab" },
    { name: "Rule", value: "#5d5852" },
  ],
};

function Theme({ variant }: { variant: Variant }) {
  const c = COPY[variant];
  const label = variant === "one" ? "Home page 1: light" : "Home page 2: warm charcoal";
  const page = variant === "one" ? "/home-page-1" : "/home-page-2";
  return (
    <EnquiryProvider>
      <div className="cg sg-theme" data-variant={variant}>
        <header className="sg-head">
          <h2 className="sg-title">{label}</h2>
          <Link href={variant === "one" ? "/home-page-1" : "/home-page-2"} className="sg-open">
            Open page <Arrow className="btn__arrow" />
          </Link>
        </header>

        <section className="sg-block sg-flush">
          <h3 className="sg-label">Header with version switch (section links open that homepage)</h3>
          <SiteHeader variant={variant} linkBase={page} />
        </section>

        <section className="sg-block">
          <h3 className="sg-label">Colour</h3>
          <ul className="sg-swatches">
            {SWATCHES[variant].map((s) => (
              <li key={s.name}>
                <span className="sg-chip" style={{ background: s.value }} />
                <span className="sg-swatch-name">{s.name}</span>
                <code>{s.value}</code>
              </li>
            ))}
          </ul>
        </section>

        <section className="sg-block">
          <h3 className="sg-label">Type (Inter, optical sizes)</h3>
          <div className="sg-type">
            <p className="h-hero">Gutters for Cape Town homes.</p>
            <p className="h-section">What does your home need?</p>
            <p className="service__title">Install or replace</p>
            <p className="hero__lede">New gutters, replacements, repairs and cleaning.</p>
            <p className="service__text">Fix leaks, loose joints and other gutter issues.</p>
            <p className="spaced sg-spaced">Protection for what matters</p>
          </div>
        </section>

        <section className="sg-block">
          <h3 className="sg-label">Logo and actions</h3>
          <div className="sg-row">
            <Logo />
            <QuoteSpecimen />
            <AreaActionSpecimen />
          </div>
        </section>

        <section className="sg-block sg-services">
          <h3 className="sg-label">Service rows</h3>
          <div className="services__copy sg-flat">
            <ServiceList items={c.services.items} variant={variant} />
          </div>
        </section>

        <section className="sg-block sg-steps">
          <h3 className="sg-label">Assessment steps</h3>
          <Steps steps={c.assessment.steps} />
        </section>

        {variant === "one" && (
          <section className="sg-block">
            <h3 className="sg-label">FAQ row</h3>
            <div className="faqs sg-flat">
              <FaqAccordion items={c.faqs.items.slice(0, 1)} />
            </div>
          </section>
        )}

        <section className="sg-block">
          <h3 className="sg-label">Enquiry form: chips, errors and the DEMO result (submit it empty, then filled)</h3>
          <div className="quote sg-flat sg-quote">
            <div className="quote__form">
              <EnquiryForm variant={variant} deliveryConfigured={Boolean(process.env.ENQUIRY_WEBHOOK_URL)} />
            </div>
          </div>
        </section>

        <section className="sg-block sg-flush">
          <h3 className="sg-label">Footer</h3>
          <SiteFooter variant={variant} linkBase={page} />
        </section>

        <section className="sg-block sg-map">
          <h3 className="sg-label">Area map</h3>
          <AreaMap title={c.map.title} lede={c.map.lede} caption={c.map.caption} sectionId={`areas-${variant}`} />
        </section>
      </div>
    </EnquiryProvider>
  );
}

export default function StyleGuide() {
  return (
    <main className="sg">
      <div className="sg-intro">
        <h1>Cape Gutters style guide</h1>
        <p>
          One system, two themes. Every piece below is the real component used on the pages. Pitch concept: proposed
          services and illustrative imagery.
        </p>
      </div>
      <Theme variant="one" />
      <Theme variant="two" />
    </main>
  );
}
