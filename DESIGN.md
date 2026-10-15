# Design system

One system, two themes. Live reference: `/style-guide`. The source of truth is `src/styles/home.css`, with tokens per `[data-variant]`.

## Themes

| Token | Home page 1 (light) | Home page 2 (warm charcoal) |
| --- | --- | --- |
| Background | `#fcfbfa` off-white | `#211e19` charcoal (services `#24211c`) |
| Light section | none | `#f0ebe2` ivory (assessment, FAQs) |
| Ink | `#161513` | `#f2efe7` on dark, `#15130f` on ivory |
| Muted | `#5f626a` | `#d8d4cc` on dark, `#5d5b57` on ivory |
| Orange | `#eb6826` (links `#b34914` for contrast) | `#ec6b2e` |
| Band / rules | band `#352d27`, rules `#8f8d8c` | rules `#5d5852` on dark, `#cdc6ba` on ivory |
| Map water / land | `#d3e4ec` / sand tints `#eedcc6` to `#f6eadb` | page charcoal / stone tints `#b8ad9c` to `#c9beb0` |

Page 2 colours a closing full stop orange (`.dot`). Page 1 colours "Cape Town" orange in the hero.

## Type

- Inter (variable, optical sizes). Page 1 headings are 800 with tight tracking (-0.035 to -0.04em). Page 2 headings are 600, or 700 on ivory, with near-normal tracking.
- Small spaced captions: uppercase, 0.32em tracking. They are the mockups' own words. Never add new ones.
- Buttons are 700 weight and at least 18.7px, so white on orange counts as large text.

## Scale rule (desktop, 900px and up)

- `--s` = one mockup px = `min(100cqw, 1440px) / 765`. Layout and headings use it.
- `--m` (ledes, titles) is capped at 1.86px per mockup px. `--t` (body) is capped at 1.8px. `--h` (header) is capped at 1.7px.
- Line breaks come from `|` markers in `content.ts`, so they match the mockups.
- Header has three tiers:
  - under 900px: logo and Menu;
  - 900 to 1359px: logo, version switch, quote button and Menu;
  - 1360px and up: the full mockup nav, plus the version switch.

## Shared pieces (`src/components/`)

- `SiteHeader`
- `Logo` / `LogoMark` (the roofline mark redrawn from the mockup)
- `.btn`
- `ServiceList` (each row opens the form with that service as a chip)
- `Steps`
- `AreaMap` (OSM coastline, eight simplified regions, HTML labels, keyboard buttons)
- `FaqAccordion`
- `EnquiryForm` (inline persistent labels, chips, errors, the DEMO note)
- `SiteFooter` (page 2 adds the roofline rule)

Fix a shared piece, never one page's copy of it.

## Motion

- 200 to 350ms ease-out for: hover colour, the arrow nudge, map lift on hover or select, FAQ reveal, menu drop.
- Reduced motion turns off animation and smooth scrolling.
