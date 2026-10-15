"use client";

import { useActionState, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/actions";
import { useEnquiry } from "./enquiry-context";
import { validateEnquiry, type EnquiryErrors, type FieldName } from "./validate";

export const FIELD_ORDER: FieldName[] = ["name", "contact", "suburb", "message"];

/**
 * Shared enquiry behaviour for every form on the site: validation that keeps
 * values, the server action, and an honest result (demo, failed or sent).
 */
export function useEnquiryForm() {
  const ctx = useEnquiry();
  const { values, setField, resetValues, setService, setArea, registerForm } = ctx;
  const [clientErrors, setClientErrors] = useState<EnquiryErrors>({});
  const [showResult, setShowResult] = useState(false);
  const [state, formAction, pending] = useActionState<EnquiryState, FormData>(
    async (prev, fd) => {
      const next = await submitEnquiry(prev, fd);
      // Only a real delivery clears the form. Demo, invalid and failed keep every value.
      if (next.status === "sent") {
        resetValues();
        setService(null);
        setArea(null);
      }
      setShowResult(true);
      return next;
    },
    { status: "idle" },
  );
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  useEffect(() => registerForm(formRef.current), [registerForm]);

  const serverErrors = state.status === "invalid" ? state.errors : {};
  const errors: EnquiryErrors = { ...serverErrors, ...clientErrors };

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const found = validateEnquiry(values);
    setClientErrors(found);
    if (Object.keys(found).length) {
      e.preventDefault();
      setShowResult(false);
      const first = FIELD_ORDER.find((f) => found[f]);
      if (first) (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
    }
  }

  function update(name: FieldName, value: string) {
    setField(name, value);
    setShowResult(false);
    if (clientErrors[name]) setClientErrors((errs) => ({ ...errs, [name]: undefined }));
  }

  const result = showResult && !pending ? state.status : "idle";
  return { ...ctx, values, errors, update, onSubmit, formAction, pending, result, formRef, uid };
}
