// All page wording, taken verbatim from the two supplied mockups.
// A "|" marks where the mockup breaks the line on desktop (see <Lines>).
// The pages share structure and behaviour; where the mockups word things
// differently, each variant keeps its own wording.

export type Variant = "one" | "two";

export const SERVICE_IDS = ["install", "repair", "clear"] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

export const SERVICE_TITLES: Record<ServiceId, string> = {
  install: "Install or replace",
  repair: "Repair a problem",
  clear: "Clear blocked gutters",
};

type Copy = {
  hero: {
    title: [string, string];
    lede: string[];
    sideLabel: string[];
    footLabel?: string;
  };
  services: {
    title: string;
    items: Record<ServiceId, string>;
  };
  assessment: {
    title: string;
    lede: string;
    steps: { title: string; text?: string }[];
  };
  map: { title: [string, string]; lede: string; caption: string };
  faqs: { title: string; items: { q: string; a: string }[] };
  enquiry: { kicker?: string; title: string; lede: string; signoff?: string[] };
  footerNote: string;
};

const FAQS_ONE = [
  {
    q: "Repair or replace?",
    a: "The condition of the gutter, joints and supports will guide|the recommendation.",
  },
  {
    q: "What helps with a quote?",
    a: "Your suburb, the type of work and clear photos of the gutter|and property access.",
  },
];

const FAQS_TWO = [
  {
    q: "Repair or replace?",
    a: "The condition of the gutter, joints and|supports will guide the recommendation.",
  },
  {
    q: "What helps with a quote?",
    a: "Your suburb, the type of work and clear|photos of the gutter and property access.",
  },
];

const STEPS = ["Share your suburb|and a few photos", "Arrange a site|assessment", "Receive a quote for|the agreed work"];

export const COPY: Record<Variant, Copy> = {
  one: {
    hero: {
      title: ["Gutters for", "Cape Town homes."],
      lede: ["New gutters, replacements, repairs and cleaning.", "Tell us what your property needs."],
      sideLabel: ["Keep", "your home", "protected"],
    },
    services: {
      title: "What does your home need?",
      items: {
        install: "New gutters or upgrade old systems with|durable, modern materials.",
        repair: "Fix leaks, loose joints, sagging gutters|and other issues.",
        clear: "Remove leaves and blockages so your|gutters work properly again.",
      },
    },
    assessment: {
      title: "Start with the right assessment.",
      lede: "The right approach depends on the gutter condition,|roof access and the work required.",
      steps: STEPS.map((title) => ({ title })),
    },
    map: {
      title: ["Cape Town", "and surrounds."],
      lede: "Tell us your suburb to|check availability.",
      caption: "Illustrative area map.",
    },
    faqs: { title: "Frequently asked questions", items: FAQS_ONE },
    enquiry: {
      title: "Tell us what you need.",
      lede: "Share a few details about your property|and we will be in touch.",
      signoff: ["Cape Gutters", "Happier homes"],
    },
    footerNote: "Pitch concept. Proposed services and illustrative imagery.",
  },
  two: {
    hero: {
      title: ["Gutters for", "Cape Town homes."],
      lede: ["New gutters, replacements, repairs|and cleaning. Tell us what your|property needs."],
      sideLabel: ["Clean", "functional", "homes for", "Cape Town"],
      footLabel: "Protection for what matters",
    },
    services: {
      title: "What does your home need?",
      items: {
        install: "New gutters or modern replacements|for lasting protection.",
        repair: "Fix leaks, loose joints and other|gutter issues.",
        clear: "Remove leaves and blockages to keep|your gutters working properly.",
      },
    },
    assessment: {
      title: "Start with the right assessment.",
      lede: "The right approach depends on the gutter condition, roof access and the work required.",
      steps: [
        { title: "Share your suburb|and a few photos", text: "Give us some details about|your property." },
        { title: "Arrange a site|assessment", text: "We will plan a convenient|time to assess the work|required." },
        { title: "Receive a quote|for the agreed work", text: "You will get a clear quote|based on your property|and needs." },
      ],
    },
    map: {
      title: ["Cape Town", "and surrounds."],
      lede: "Tell us your suburb to|check availability.",
      caption: "Illustrative area map.",
    },
    faqs: { title: "Frequently asked questions.", items: FAQS_TWO },
    enquiry: {
      kicker: "Get in touch",
      title: "Tell us what|you need.",
      lede: "Fill in a few details and we will|be in touch about your project.",
    },
    footerNote: "Pitch concept. Proposed services and illustrative imagery.",
  },
};

export const NOT_SURE = { lead: "Not sure?", rest: "Tell us what happens when it rains." };

export const VERSIONS = [
  { href: "/home-page-1", label: "Home page 1", variant: "one" as const },
  { href: "/home-page-2", label: "Home page 2", variant: "two" as const },
];

export const NAV = [
  { href: "#services", label: "Services" },
  { href: "#areas", label: "Areas" },
  { href: "#faqs", label: "FAQs" },
];
