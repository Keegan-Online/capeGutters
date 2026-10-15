import Image from "next/image";
import { AreaMap } from "./area-map/area-map";
import { COPY, NAV, type Variant } from "./content";
import { EnquiryProvider } from "./enquiry/enquiry-context";
import { EnquiryForm } from "./enquiry/enquiry-form";
import { Arrow, Logo, LogoMark } from "./icons";
import { FaqAccordion, ServiceList } from "./sections-client";
import { Lines } from "./lines";
import { SiteHeader } from "./site-header";

export function Steps({ steps }: { steps: { title: string; text?: string }[] }) {
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li key={s.title} className="step">
          <div className="step__body">
            <p className="step__title">
              <Lines text={s.title} />
            </p>
            {s.text && (
              <p className="step__text">
                <Lines text={s.text} />
              </p>
            )}
          </div>
          {i < steps.length - 1 && <Arrow className="step__arrow" />}
        </li>
      ))}
    </ol>
  );
}

export function SiteFooter({ variant, linkBase = "" }: { variant: Variant; linkBase?: string }) {
  return (
    <footer className="site-footer">
      {variant === "two" && (
        <div className="site-footer__rule" aria-hidden="true">
          <svg viewBox="0 0 132 17" preserveAspectRatio="none" className="site-footer__roof">
            <path d="M0 16 L48 1 L86.5 16 H132" />
          </svg>
        </div>
      )}
      <div className="site-footer__inner">
        <a href={`${linkBase}#top`} className="site-footer__brand" aria-label="Cape Gutters, back to top">
          <Logo />
        </a>
        <nav aria-label="Footer">
          <ul className="site-footer__nav">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={`${linkBase}${n.href}`}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="site-footer__note">{COPY[variant].footerNote}</p>
      </div>
    </footer>
  );
}

/** Splits a closing full stop off so the second page can colour it. */
function Stop({ text }: { text: string }) {
  if (!text.endsWith(".")) return <>{text}</>;
  return (
    <>
      {text.slice(0, -1)}
      <span className="dot">.</span>
    </>
  );
}

export function HomePage({ variant }: { variant: Variant }) {
  const c = COPY[variant];
  const one = variant === "one";
  const deliveryConfigured = Boolean(process.env.ENQUIRY_WEBHOOK_URL);

  return (
    <EnquiryProvider>
      <div className="cg" data-variant={variant} id="top">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader variant={variant} />

        <main id="main">
          {/* Hero */}
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero__media">
              <Image
                src={one ? "/images/hero-light-wide.webp" : "/images/hero-dark.webp"}
                alt="Corner of a white rendered house with a dark half-round gutter and downpipe. Illustrative image."
                fill
                priority
                sizes="100vw"
                className="hero__img"
              />
            </div>
            <div className="hero__content">
              <h1 id="hero-title" className="h-hero">
                {one ? (
                  <>
                    {c.hero.title[0]}
                    <br />
                    <span className="accent">Cape Town</span> homes.
                  </>
                ) : (
                  <>
                    {c.hero.title[0]}
                    <br />
                    <Stop text={c.hero.title[1]} />
                  </>
                )}
              </h1>
              <p className="hero__lede">
                <Lines text={c.hero.lede.join("|")} />
              </p>
              <a href="#quote" className="btn btn--hero">
                <span>Request a quote</span>
                <Arrow className="btn__arrow" />
              </a>
              {c.hero.footLabel && (
                <p className="hero__foot">
                  <span className="rule-accent" aria-hidden="true" />
                  <span className="spaced">{c.hero.footLabel}</span>
                </p>
              )}
            </div>
            <p className="hero__side spaced" aria-hidden="true">
              {c.hero.sideLabel.map((l) => (
                <span key={l}>{l}</span>
              ))}
              {one && <span className="rule-accent" />}
            </p>
          </section>

          {/* Services */}
          <section id="services" className="services" aria-labelledby="services-title">
            <div className="services__copy">
              <h2 id="services-title" className="h-section">
                {c.services.title}
              </h2>
              <ServiceList items={c.services.items} variant={variant} />
            </div>
            <div className="services__media">
              <Image
                src="/images/gutter-closeup.webp"
                alt="Close-up of a dark half-round gutter joint and square downpipe outlet. Illustrative image."
                fill
                sizes="(min-width: 900px) 50vw, 100vw"
                className="services__img"
              />
            </div>
          </section>

          {/* Assessment */}
          <section className="assess" aria-labelledby="assess-title">
            {one && (
              <div className="assess__media" aria-hidden="true">
                <Image
                  src="/images/gutter-band.webp"
                  alt=""
                  fill
                  sizes="(min-width: 900px) 35vw, 100vw"
                  className="assess__img"
                />
              </div>
            )}
            <div className="assess__copy">
              <h2 id="assess-title" className="h-section h-assess">
                <Stop text={c.assessment.title} />
              </h2>
              <p className="assess__lede">
                <Lines text={c.assessment.lede} />
              </p>
              <Steps steps={c.assessment.steps} />
            </div>
          </section>

          {/* Map */}
          <AreaMap title={c.map.title} lede={c.map.lede} caption={c.map.caption} />

          {/* FAQs */}
          <section id="faqs" className="faqs" aria-labelledby="faqs-title">
            <h2 id="faqs-title" className="h-section h-faqs">
              <Stop text={c.faqs.title} />
            </h2>
            {one ? (
              <FaqAccordion items={c.faqs.items} />
            ) : (
              <div className="faq-columns">
                {c.faqs.items.map((f) => (
                  <div key={f.q} className="faq-col">
                    <h3 className="faq-col__q">{f.q}</h3>
                    <p className="faq-col__a">
                      <Lines text={f.a} />
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Enquiry */}
          <section id="quote" className="quote" aria-labelledby="quote-title">
            <div className="quote__copy">
              {c.enquiry.kicker && <p className="quote__kicker spaced">{c.enquiry.kicker}</p>}
              <h2 id="quote-title" className="h-quote">
                {c.enquiry.title.split("|").map((part, i, all) => (
                  <span key={i} className="ln">
                    {i === all.length - 1 ? <Stop text={part} /> : `${part} `}
                  </span>
                ))}
              </h2>
              <p className="quote__lede">
                <Lines text={c.enquiry.lede} />
              </p>
              {c.enquiry.signoff && (
                <p className="quote__signoff" aria-hidden="true">
                  <LogoMark className="quote__mark" />
                  <span className="spaced">
                    {c.enquiry.signoff.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </span>
                </p>
              )}
            </div>
            <div className="quote__form">
              <EnquiryForm variant={variant} deliveryConfigured={deliveryConfigured} />
            </div>
          </section>
        </main>

        <SiteFooter variant={variant} />
      </div>
    </EnquiryProvider>
  );
}
