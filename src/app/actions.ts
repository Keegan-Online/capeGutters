"use server";

import { SERVICE_TITLES, type ServiceId } from "@/components/content";
import { validateEnquiry, type EnquiryErrors, type EnquiryValues } from "@/components/enquiry/validate";

export type EnquiryState =
  | { status: "idle" }
  | { status: "invalid"; errors: EnquiryErrors }
  | { status: "demo" }
  | { status: "sent" }
  | { status: "failed" };

const read = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return typeof value === "string" ? value.slice(0, 2000) : "";
};

/**
 * Sends the enquiry to ENQUIRY_WEBHOOK_URL when one is configured.
 * Without a destination the form is a demo: it validates, says plainly that
 * nothing was sent, and never reports success.
 */
export async function submitEnquiry(_prev: EnquiryState, fd: FormData): Promise<EnquiryState> {
  const values: EnquiryValues = {
    name: read(fd, "name"),
    contact: read(fd, "contact"),
    suburb: read(fd, "suburb"),
    message: read(fd, "message"),
    service: read(fd, "service"),
    area: read(fd, "area"),
  };

  const errors = validateEnquiry(values);
  if (Object.keys(errors).length) return { status: "invalid", errors };

  const destination = process.env.ENQUIRY_WEBHOOK_URL;
  if (!destination) return { status: "demo" };

  const service = values.service in SERVICE_TITLES ? SERVICE_TITLES[values.service as ServiceId] : "";
  try {
    const res = await fetch(destination, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, service, page: read(fd, "page"), receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10000),
    });
    return res.ok ? { status: "sent" } : { status: "failed" };
  } catch {
    return { status: "failed" };
  }
}
