// Final site wording, from the Architectural Authority mockup.
// The mockup's small decorative slogans are removed by brief. Services and
// FAQ answers are proposed until Cape Gutters confirms them (see PROGRESS.md).
// A "|" marks a desktop line break (see <Lines>).

import type { ServiceId } from "../content";

export const NAV = [
  { href: "/#services", label: "Services" },
  { href: "/#areas", label: "Areas" },
  { href: "/#enquire", label: "Enquire" },
];

export const HERO = {
  title: ["Every roofline.", "Considered."] as const,
  lede: "Gutter installation, replacement, repairs and cleaning.",
  action: "Discuss your project",
};

export const SERVICES: { id: ServiceId; title: string; text: string }[] = [
  { id: "install", title: "Installation &|replacement", text: "A clean, effective system|for long term performance." },
  { id: "repair", title: "Repairs", text: "Targeted solutions|to keep your gutters|working as they should." },
  { id: "clear", title: "Cleaning &|maintenance", text: "Remove debris and|keep water flowing freely." },
];

/** What the enquiry form shows for each service row. */
export const SERVICE_LABELS: Record<ServiceId, string> = {
  install: "Installation & replacement",
  repair: "Repairs",
  clear: "Cleaning & maintenance",
};

export const SPEC = {
  title: ["The right", "specification", "starts with", "your roof."] as const,
  lede: "Roof layout, gutter condition and access|help define the work required.",
  factors: ["Roof layout", "Gutter condition", "Access"],
};

export const AREAS = {
  title: ["Cape Town.", "Connected."] as const,
  lede: "Enter your suburb to check availability.",
  caption: "Illustrative area map. Areas are a guide, not service boundaries.",
  credit: "Coastline and suburbs © OpenStreetMap contributors.",
};

export const ENQUIRE = {
  title: ["Let’s talk", "guttering."] as const,
  lede: "Tell us about your project and we will be in touch|to discuss the next steps.",
};

export const FAQS = [
  {
    q: "Repair or replace?",
    a: "It depends on the condition, age and extent of the issue. We can assess your gutters and advise on the most suitable option.",
  },
  {
    q: "What helps with a quote?",
    a: "A few photos, your suburb and a brief description of the work needed help us provide an accurate response.",
  },
];

export const FOOTER_NOTE = "Pitch concept. Proposed services and illustrative imagery.";

/** Parts named on the gutter system drawing, in drawing order. */
export const DRAWING_LABELS = [
  { id: "roof", label: "Roof edge" },
  { id: "gutter", label: "Gutter" },
  { id: "outlet", label: "Outlet" },
  { id: "downpipe", label: "Downpipe" },
] as const;
