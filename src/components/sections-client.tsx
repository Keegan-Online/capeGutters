"use client";

import { useState } from "react";
import { Arrow, Plus } from "./icons";
import { NOT_SURE, SERVICE_IDS, SERVICE_TITLES, type ServiceId } from "./content";
import { useEnquiry } from "./enquiry/enquiry-context";
import { Lines } from "./lines";

export function ServiceList({ items, variant }: { items: Record<ServiceId, string>; variant: "one" | "two" }) {
  const { goToForm, service } = useEnquiry();
  return (
    <>
      <ul className="services__list">
        {SERVICE_IDS.map((id) => (
          <li key={id} className="service">
            <button
              type="button"
              className="service__button"
              aria-pressed={service === id}
              onClick={() => goToForm({ service: id })}
            >
              <span className="service__title">{SERVICE_TITLES[id]}</span>
              <span className="service__text">
                <Lines text={items[id]} />
              </span>
              <Arrow className="service__arrow" />
              <span className="sr-only">. Start a quote request for this.</span>
            </button>
          </li>
        ))}
      </ul>
      {variant === "two" && <span className="services__bar" aria-hidden="true" />}
      <p className="services__unsure">
        <button type="button" className="unsure" onClick={() => goToForm({ focus: "message" })}>
          <strong>{NOT_SURE.lead}</strong> {NOT_SURE.rest}
        </button>
      </p>
    </>
  );
}

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  // Open by default, as in the mockup; each row still collapses and reopens.
  const [open, setOpen] = useState<boolean[]>(() => items.map(() => true));
  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const id = `faq-${i}`;
        return (
          <div key={item.q} className="faq" data-open={open[i] ? "" : undefined}>
            <h3 className="faq__q">
              <button
                type="button"
                className="faq__toggle"
                aria-expanded={open[i]}
                aria-controls={id}
                onClick={() => setOpen((o) => o.map((v, j) => (j === i ? !v : v)))}
              >
                <span>{item.q}</span>
                <Plus className="faq__icon" open={open[i]} />
              </button>
            </h3>
            <div id={id} className="faq__a" hidden={!open[i]}>
              <p>
                <Lines text={item.a} />
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
