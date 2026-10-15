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
- 2026-10-15: Scale rule. Desktop (900px and up) uses 1 mockup px = `min(100cqw, 1440px) / 765`. Layout and headings scale fully. Ledes and titles cap at 1.86px per mockup px and body text at 1.8px, which is about 96% of the mockup at 1440 (raised after the review). Line breaks are fixed with `|` markers, so they match the mockups whatever the text size.
- 2026-10-15: The header has three tiers, because the full nav plus the version switch only fits from about 1360px:
  - from 1360px: the full mockup nav plus the version switch;
  - 900 to 1359px: logo, version switch, quote button and a Menu for the section links;
  - under 900px: logo and Menu.
- 2026-10-15: The page 1 hero photo's sky was extended on the left (mirrored and blended), so the house sits where the mockup has it and the gutter clears the lede at 1024px. Above 1440px the hero photo keeps its 1440 composition, anchored right. The extra width is sky on page 1 and charcoal on page 2.
- 2026-10-15: Buttons are 700 weight and at least 18.7px. White on the mockup orange is 3.2:1, which passes only as large text.
- 2026-10-15: Below 900px a deliberate stacked layout with fixed px sizes. A literal 765px viewport therefore shows the tablet layout; the desktop composition is compared at 1440 scaled to 765.
- 2026-10-15: Photos regenerated at full resolution from the mockup crops (Codex image generation). Page 1 uses three distinct gutter photos and page 2 uses two.
- 2026-10-15: Map coastline from OpenStreetMap (ODbL, credited in the caption). Eight simplified regions clipped to the real coast: the mockup's four (Cape Town, Northern Suburbs, Southern Suburbs, South Peninsula) plus Atlantic Seaboard, Blaauwberg, Cape Flats and Helderberg, so the land is fully covered.
- 2026-10-15: The map action adds an "Area" chip to the form. It never replaces the Suburb field, which stays required.
- 2026-10-15: The FAQ on page 1 opens by default, as in the mockup. Its icon shows a minus while open (honest state) instead of the mockup's plus.
- 2026-10-15: Form: with no `ENQUIRY_WEBHOOK_URL` the form is labelled DEMO and a valid submit says nothing was sent. Success shows only after a real 2xx delivery.
- 2026-10-15: The mockups' small spaced captions ("Keep your home protected" and similar) are supplied wording, so they stay. Nothing new was added.
- 2026-10-15: Cache Components are off. Kept-alive hidden pages would duplicate the section ids, so anchor links could break between versions.

## Final site (Architectural Authority)

- 2026-10-15: Keegan chose the Architectural Authority mockup as the final direction. It brings in the gutter-system visual from the engineered concept. The earlier homepages stay under a Variations tab.
- 2026-10-15: The identity is a proposal. The wordmark is two rooflines, the orange one running on as the gutter line, set in Archivo. The palette is orange, warm charcoal and warm off-white.
- 2026-10-15: The gutter drawing is an authored 2D section, not a 3D wireframe, for the precision of a detail drawing (Keegan's feedback). The gutter profile is the focus.
- 2026-10-15: Keegan's motion direction for the drawing: keep it simple, no water simulation, and no scroll-linked drawing. The white drawing stays still, and the orange highlight draws once on entering view, roof edge then gutter then outlet, and then holds.
- 2026-10-15: The mockup's small decorative slogans are removed, by the brief.
- 2026-10-15: On mobile the map's selection card sits below the map, so it never covers region labels.
- 2026-10-15: Keegan: no Netlify deploy until he approves on localhost.
