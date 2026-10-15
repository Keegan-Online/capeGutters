# Decisions

## Compass (director, 2026-10-15)

- **Goal:** two working pitch homepages: `/home-page-1` (light, default) and `/home-page-2` (warm charcoal). Together they prove both mockups work as real responsive sites.
- **Audience and feeling:** the Cape Gutters decision-maker, then Cape Town homeowners. Clear, careful, local; calm confidence. Dream: Cape Gutters reads as the obvious local specialist and the homeowner knows the next step.
- **Direction:** the two supplied mockups (A/B/C milestone not needed). The only deliberate departures are the map and the header nav.
- **Sequence:** hero, three services, assessment with three steps, map, two FAQs, enquiry form and footer. Wording verbatim per mockup.
- **Out of scope:** any deploy (Keegan: local only), real form delivery, extra pages, anything from the rejected moss-green concept.
- **Constraints:** no invented contacts, guarantees, credentials, prices, reviews, stats, badges, ratings, slogans or em dashes. Services and assessment are proposals. Map regions are geographic references, not service boundaries.
- **Success:** each page matches its mockup at the same proportions, works at 1440 and 390, and every control does something real. Passes the one test.

## Decisions

- 2026-10-15: Next.js 16 + Tailwind 4 base, hand-written CSS system. Reason: pixel-matching two mockups is clearer in one token-driven stylesheet than in utility classes.
- 2026-10-15: Scale rule. Desktop (900px and up) uses 1 mockup px = `min(100cqw, 1440px) / 765`. Layout and headings scale fully; ledes and titles cap at 1.82px per mockup px, body text at 1.7px. Straight scaling gives a 23px nav and 24px body text at 1440. Line breaks are fixed with `|` markers so they match the mockups whatever the text size.
- 2026-10-15: Below 900px a deliberate stacked layout with fixed px sizes. A literal 765px viewport therefore shows the tablet layout; the desktop composition is compared at 1440 scaled to 765.
- 2026-10-15: Photos regenerated at full resolution from the mockup crops (Codex image generation). Page 1 uses three distinct gutter photos and page 2 uses two.
- 2026-10-15: Map coastline from OpenStreetMap (ODbL, credited in the caption). Eight simplified regions clipped to the real coast: the mockup's four (Cape Town, Northern Suburbs, Southern Suburbs, South Peninsula) plus Atlantic Seaboard, Blaauwberg, Cape Flats and Helderberg, so the land is fully covered.
- 2026-10-15: The map action adds an "Area" chip to the form. It never replaces the Suburb field, which stays required.
- 2026-10-15: The FAQ on page 1 opens by default, as in the mockup. Its icon shows a minus while open (honest state) instead of the mockup's plus.
- 2026-10-15: Form: with no `ENQUIRY_WEBHOOK_URL` the form is labelled DEMO and a valid submit says nothing was sent. Success shows only after a real 2xx delivery.
- 2026-10-15: The mockups' small spaced captions ("Keep your home protected" and similar) are supplied wording, so they stay. Nothing new was added.
- 2026-10-15: Cache Components are off. Kept-alive hidden pages would duplicate the section ids, so anchor links could break between versions.
