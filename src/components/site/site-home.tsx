import { EnquiryProvider } from "../enquiry/enquiry-context";
import { GutterDrawing } from "./gutter-drawing";
import { Faqs, ServiceRows, SiteEnquiryForm } from "./interactive";
import { EnquireIntro, Hero, SiteFooter, Spec } from "./sections";
import { SiteHeader } from "./site-header";
import { SiteMap } from "./site-map";

export function SiteHome() {
  const deliveryConfigured = Boolean(process.env.ENQUIRY_WEBHOOK_URL);
  return (
    <EnquiryProvider>
      <div className="site" id="top">
        <a href="#main" className="skip-s">
          Skip to content
        </a>
        <SiteHeader overHero />
        <main id="main">
          <Hero />

          <section id="services" className="svc-sec" aria-labelledby="services-title">
            <div className="svc-sec__list">
              <h2 id="services-title" className="sr-only">
                Services
              </h2>
              <ServiceRows />
            </div>
            <div className="svc-sec__panel">
              <GutterDrawing />
            </div>
          </section>

          <Spec />
          <SiteMap />

          <section id="enquire" className="enq" aria-labelledby="enquire-title">
            <EnquireIntro />
            <div className="enq__form">
              <SiteEnquiryForm deliveryConfigured={deliveryConfigured} />
            </div>
            <div className="enq__faqs">
              <Faqs />
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </EnquiryProvider>
  );
}
