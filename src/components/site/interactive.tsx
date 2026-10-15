"use client";

import { useState } from "react";
import { Lines } from "../lines";
import { useEnquiry } from "../enquiry/enquiry-context";
import { useEnquiryForm } from "../enquiry/use-enquiry-form";
import type { FieldName } from "../enquiry/validate";
import { IconArrow, IconPlusMinus } from "./brand";
import { FAQS, SERVICES, SERVICE_LABELS } from "./content";

/* ---------- Service rows: each opens the enquiry with that service ---------- */
export function ServiceRows() {
  const { goToForm, service } = useEnquiry();
  return (
    <ul className="svc">
      {SERVICES.map((s) => (
        <li key={s.id} className="svc__row">
          <button
            type="button"
            className="svc__button"
            aria-pressed={service === s.id}
            onClick={() => goToForm({ service: s.id })}
          >
            <span className="svc__title">
              <Lines text={s.title} />
            </span>
            <span className="svc__text">
              <Lines text={s.text} />
            </span>
            <IconArrow className="svc__arrow" />
            <span className="sr-only"> Start an enquiry about this.</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Enquiry form ---------- */
const FIELDS: { name: FieldName; label: string; autoComplete?: string; multiline?: boolean }[] = [
  { name: "name", label: "Name", autoComplete: "name" },
  { name: "contact", label: "Phone or email", autoComplete: "on" },
  { name: "suburb", label: "Suburb", autoComplete: "address-level2" },
  { name: "message", label: "Project details", multiline: true },
];

export function SiteEnquiryForm({ deliveryConfigured }: { deliveryConfigured: boolean }) {
  const {
    service,
    area,
    setService,
    setArea,
    values,
    errors,
    update,
    onSubmit,
    formAction,
    pending,
    result,
    formRef,
    uid,
  } = useEnquiryForm();
  return (
    <form
      ref={formRef}
      className="ef"
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      aria-describedby={`${uid}-mode`}
    >
      <input type="hidden" name="service" value={service ?? ""} />
      <input type="hidden" name="area" value={area ?? ""} />
      <input type="hidden" name="page" value="final" />

      {(service || area) && (
        <div className="ef__context" aria-live="polite">
          {service && (
            <span className="ef__chip">
              {SERVICE_LABELS[service]}
              <button type="button" onClick={() => setService(null)} aria-label={`Remove ${SERVICE_LABELS[service]}`}>
                <IconPlusMinus open={false} className="ef__chip-x" />
              </button>
            </span>
          )}
          {area && (
            <span className="ef__chip">
              Area: {area}
              <button type="button" onClick={() => setArea(null)} aria-label={`Remove area ${area}`}>
                <IconPlusMinus open={false} className="ef__chip-x" />
              </button>
            </span>
          )}
        </div>
      )}

      {FIELDS.map((f) => {
        const id = `${uid}-${f.name}`;
        const err = errors[f.name];
        const common = {
          id,
          name: f.name,
          value: values[f.name],
          autoComplete: f.autoComplete,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `${id}-err` : undefined,
          required: true,
        } as const;
        return (
          <div
            key={f.name}
            className="ef__field"
            data-multi={f.multiline ? "" : undefined}
            data-error={err ? "" : undefined}
          >
            <label htmlFor={id} className="ef__label">
              {f.label}
            </label>
            {f.multiline ? (
              <textarea {...common} rows={3} onChange={(e) => update(f.name, e.target.value)} />
            ) : (
              <input {...common} type="text" onChange={(e) => update(f.name, e.target.value)} />
            )}
            {err && (
              <p id={`${id}-err`} className="ef__error">
                {err}
              </p>
            )}
          </div>
        );
      })}

      <button type="submit" className="btn-s btn-s--dark btn-s--block" disabled={pending}>
        <span>{pending ? "Checking" : "Send enquiry"}</span>
        <IconArrow className="btn-s__icon" />
      </button>

      <div className="ef__status" aria-live="polite">
        {result === "demo" && (
          <p className="ef__notice" data-kind="demo">
            <strong>Demo only.</strong> Your details passed the checks, but this form is not connected yet, so nothing
            was sent. Your details are still in the form.
          </p>
        )}
        {result === "failed" && (
          <p className="ef__notice" data-kind="error">
            <strong>Not sent.</strong> Something went wrong on our side. Your details are still in the form, so please
            try again.
          </p>
        )}
        {result === "sent" && (
          <p className="ef__notice" data-kind="sent">
            <strong>Sent.</strong> Thank you. We will be in touch.
          </p>
        )}
      </div>

      <p id={`${uid}-mode`} className="ef__mode">
        {deliveryConfigured ? null : (
          <>
            <span className="ef__tag">Demo</span> This form is not connected yet. Nothing you enter is sent.
          </>
        )}
      </p>
    </form>
  );
}

/* ---------- FAQs ---------- */
export function Faqs() {
  const [open, setOpen] = useState<boolean[]>(() => FAQS.map(() => true));
  return (
    <div className="fq">
      <h2 className="fq__heading">FAQs</h2>
      {FAQS.map((item, i) => {
        const id = `fq-${i}`;
        return (
          <div key={item.q} className="fq__item" data-open={open[i] ? "" : undefined}>
            <h3 className="fq__q">
              <button
                type="button"
                aria-expanded={open[i]}
                aria-controls={id}
                onClick={() => setOpen((o) => o.map((v, j) => (j === i ? !v : v)))}
              >
                <span>{item.q}</span>
                <IconPlusMinus open={open[i]} className="fq__icon" />
              </button>
            </h3>
            <div id={id} className="fq__a" data-open={open[i] ? "" : undefined} inert={!open[i]}>
              <div className="fq__a-inner">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
