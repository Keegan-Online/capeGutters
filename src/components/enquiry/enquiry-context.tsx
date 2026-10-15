"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { ServiceId } from "../content";
import type { FieldName } from "./validate";

type FocusField = FieldName;
export const EMPTY_VALUES: Record<FieldName, string> = { name: "", contact: "", suburb: "", message: "" };

type EnquiryContextValue = {
  service: ServiceId | null;
  area: string | null;
  setService: (s: ServiceId | null) => void;
  setArea: (a: string | null) => void;
  /** Scroll to the enquiry form and focus a field (or the first empty one). */
  goToForm: (opts?: { focus?: FocusField; service?: ServiceId; area?: string; suburb?: string }) => void;
  registerForm: (el: HTMLFormElement | null) => void;
  /** Form values live here so other parts of the page (the map search) can fill them. */
  values: Record<FieldName, string>;
  setField: (name: FieldName, value: string) => void;
  resetValues: () => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [service, setService] = useState<ServiceId | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [values, setValues] = useState(EMPTY_VALUES);
  const formRef = useRef<HTMLFormElement | null>(null);
  const setField = useCallback((name: FieldName, value: string) => setValues((v) => ({ ...v, [name]: value })), []);
  const resetValues = useCallback(() => setValues(EMPTY_VALUES), []);

  const registerForm = useCallback((el: HTMLFormElement | null) => {
    formRef.current = el;
  }, []);

  const goToForm = useCallback<EnquiryContextValue["goToForm"]>((opts = {}) => {
    if (opts.service) setService(opts.service);
    if (opts.area) setArea(opts.area);
    if (opts.suburb) setValues((v) => ({ ...v, suburb: opts.suburb! }));
    const form = formRef.current;
    if (!form) return;
    const section = form.closest("section") ?? form;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    const order: FocusField[] = ["name", "contact", "suburb", "message"];
    const pick =
      opts.focus ??
      order.find((n) => {
        const el = form.elements.namedItem(n) as HTMLInputElement | null;
        return el && !el.value.trim();
      }) ??
      "name";
    const target = form.elements.namedItem(pick) as HTMLElement | null;
    // Focus after the scroll starts so the browser doesn't jump.
    window.setTimeout(() => target?.focus({ preventScroll: true }), reduce ? 0 : 450);
  }, []);

  const value = useMemo(
    () => ({ service, area, setService, setArea, goToForm, registerForm, values, setField, resetValues }),
    [service, area, goToForm, registerForm, values, setField, resetValues],
  );
  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used inside EnquiryProvider");
  return ctx;
}
