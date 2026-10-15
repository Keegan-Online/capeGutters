"use client";

import { Arrow } from "../icons";
import { SERVICE_TITLES, type Variant } from "../content";
import { useEnquiryForm } from "./use-enquiry-form";
import type { FieldName } from "./validate";

const FIELDS: {
  name: FieldName;
  label: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
}[] = [
  { name: "name", label: "Name", autoComplete: "name" },
  { name: "contact", label: "Phone or email", autoComplete: "on" },
  { name: "suburb", label: "Suburb", autoComplete: "address-level2" },
  { name: "message", label: "What needs attention?", multiline: true },
];

export function EnquiryForm({ variant, deliveryConfigured }: { variant: Variant; deliveryConfigured: boolean }) {
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
      className="enquiry"
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      aria-describedby={`${uid}-mode`}
    >
      <input type="hidden" name="service" value={service ?? ""} />
      <input type="hidden" name="area" value={area ?? ""} />
      <input type="hidden" name="page" value={variant === "one" ? "home-page-1" : "home-page-2"} />

      <div className="enquiry__card">
        {(service || area) && (
          <div className="enquiry__context" aria-live="polite">
            {service && (
              <span className="chip">
                <span className="chip__text">{SERVICE_TITLES[service]}</span>
                <button
                  type="button"
                  className="chip__remove"
                  onClick={() => setService(null)}
                  aria-label={`Remove ${SERVICE_TITLES[service]}`}
                >
                  ×
                </button>
              </span>
            )}
            {area && (
              <span className="chip">
                <span className="chip__text">Area: {area}</span>
                <button
                  type="button"
                  className="chip__remove"
                  onClick={() => setArea(null)}
                  aria-label={`Remove area ${area}`}
                >
                  ×
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
            <div key={f.name} className={`field${f.multiline ? " field--multi" : ""}${err ? " field--error" : ""}`}>
              <label htmlFor={id} className="field__label">
                {f.label}
              </label>
              {f.multiline ? (
                <textarea {...common} rows={3} onChange={(e) => update(f.name, e.target.value)} />
              ) : (
                <input {...common} type="text" onChange={(e) => update(f.name, e.target.value)} />
              )}
              {err && (
                <p id={`${id}-err`} className="field__error">
                  {err}
                </p>
              )}
            </div>
          );
        })}

        <button type="submit" className="btn btn--block" disabled={pending}>
          <span>{pending ? "Checking" : "Request a quote"}</span>
          <Arrow className="btn__arrow" />
        </button>

        <div className="enquiry__status" aria-live="polite">
          {result === "demo" && (
            <p className="notice notice--demo">
              <strong>Demo only.</strong> Your details passed the checks, but this form is not connected yet, so nothing
              was sent. Your details are still in the form.
            </p>
          )}
          {result === "failed" && (
            <p className="notice notice--error">
              <strong>Not sent.</strong> Something went wrong on our side. Your details are still in the form, so please
              try again.
            </p>
          )}
          {result === "sent" && (
            <p className="notice notice--sent">
              <strong>Sent.</strong> Thank you. We will be in touch.
            </p>
          )}
        </div>
      </div>

      <p id={`${uid}-mode`} className="enquiry__mode">
        {deliveryConfigured ? null : (
          <>
            <span className="tag">Demo</span> This form is not connected yet. Nothing you enter is sent.
          </>
        )}
      </p>
    </form>
  );
}
