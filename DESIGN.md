# Design system: Cape Gutters final site

The direction is Architectural Authority (`references/final/architectural-authority-mockup.png`). Live reference: `/style-guide`. Source: `src/styles/site.css`, scoped to `.site`. Components: `src/components/site/`. Everything here is a **proposed identity** until Cape Gutters' own brand assets are confirmed.

## Idea

Authority through precision. The site is calm and architectural, and specific to gutters: a roofline you can trust, drawn like a technical detail. One orange line carries the brand, from the logo's gutter line to the hero's roofline and the drawn gutter system.

## Identity

- **Wordmark:** two rooflines over "CAPE GUTTERS".
  - The charcoal line is a gable.
  - The orange line is a second roof whose eave runs on as the gutter line, ending in a short downpipe drop.
  - The type is Archivo 450, width 108, fitted exactly to the gutter line.
  - It comes in light and dark tones. The symbol works alone for small sizes.
  - Clear space: equal to the symbol height. Never recolour the orange line.
- **Signature line:** a fine orange line that follows a gutter. Use it sparingly: the logo, the hero roofline, the gutter drawing, small rules.

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| `--char` | `#1D1B17` | Dark sections, buttons, footer |
| `--ink` | `#1C1A16` | Text on paper |
| `--ink-2` | `#4A463F` | Secondary text on paper (AA) |
| `--paper` | `#F3F0E9` | Page, light sections |
| `--paper-2` | `#F8F6F0` | Form area, cards |
| `--orange` | `#E8642A` | Accent, enquiry panel, line-work |
| `--orange-deep` | `#D95A1E` | Large orange text on paper (3.4:1) |
| `--orange-ink` | `#B4470F` | Small orange text and links (4.8:1) |

Text on the orange panel is white for the large heading and ink for body text. White body text on this orange fails AA.

## Type

- Inter (variable, optical sizes) for everything except the wordmark.
- **Display:** 650 weight, tight tracking (-0.038em, never past -0.04em).
- **Sections:** 600 to 700 weight.
- **Services:** 500 weight, large and quiet.
- **Body:** 400 weight, at least 15px on any screen.
- No decorative slogans and no eyebrow labels above headings.

## Scale

- Desktop (900px and up): 1 mockup px = `--s` = `min(100cqw, 1440px) / 763`.
- Display text uses `--d` (capped at 1.85px). Titles use `--m` (1.8px). Body uses `--t` (1.75px), so text stays comfortable at 1440.
- Line breaks follow the mockup through `|` markers.
- Mobile (under 900px): stacked layouts in px with a 20px gutter. Spacing steps are 4, 8, 12, 16, 24, 32, 48, 72 and 96.

## Components

| Component | Notes |
| --- | --- |
| `SiteHeader` | Sits over the hero, solid once scrolled. The **Variations** tab is set apart by a rule. Phones get a Menu panel with a backdrop. |
| Buttons (`.btn-s`) | Charcoal, square corners, arrow icon. |
| `ServiceRows` | Each row opens the enquiry with its service attached as a chip. |
| `GutterDrawing` | An authored 2D section at the eaves (`gutter-detail.ts`): roof covering over the rafter and fascia, a K-style gutter as the focus, a socketed drop outlet, two 45° elbows back to the wall, a clip, and a gully hopper. Warm-white structure in thin strokes, a fine orange highlight and labelled leaders. |
| `SiteMap` | OSM coastline, eight simplified regions. A suburb search (OSM place names) carries the area and suburb into the form. North arrow and a true scale bar. |
| `SiteEnquiryForm` | Persistent labels, validation that keeps values. Shows DEMO until `ENQUIRY_WEBHOOK_URL` is set. |
| `Faqs` | Open by default. Minus when open, plus when closed. |
| `SiteFooter` | Charcoal footer. |

Icons are drawn on a 24-unit grid with a 1.5 stroke and square ends.

## Motion

Use `--ease-out` `cubic-bezier(0.23, 1, 0.32, 1)` and `--ease-in-out` `cubic-bezier(0.77, 0, 0.175, 1)`.

- **Hero entrance:** once, 700ms.
- **Hero roofline:** draws once, 1s.
- **Gutter drawing:** the white section never moves. The orange highlight draws once on entering view, down the roof (950ms), then along the gutter and down the outlet (1950ms), and then holds.
- **Feedback:** 160 to 220ms.
- **Map:** selection 240 to 320ms.
- **FAQ:** 280ms.
- **Form errors:** a single nudge.

There is no scroll-linked motion, no looping motion and no hover-only content. Reduced motion shows the finished states.

## Variations

The two earlier homepages live under `/variations` with their own system in `src/styles/home.css`, scoped to `.cg`. That system is recorded at git tag `v1-variations`.
