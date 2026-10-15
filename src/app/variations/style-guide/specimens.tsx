"use client";

import { Arrow } from "@/components/icons";
import { useEnquiry } from "@/components/enquiry/enquiry-context";

/** Style guide specimens that use the theme's real enquiry form. */
export function QuoteSpecimen() {
  const { goToForm } = useEnquiry();
  return (
    <button type="button" className="btn" onClick={() => goToForm()}>
      <span>Request a quote</span>
      <Arrow className="btn__arrow" />
    </button>
  );
}

export function AreaActionSpecimen() {
  const { goToForm } = useEnquiry();
  return (
    <button
      type="button"
      className="link-action"
      onClick={() => goToForm({ area: "Southern Suburbs", focus: "suburb" })}
    >
      Use this area in my enquiry
      <Arrow className="link-action__arrow" />
    </button>
  );
}
