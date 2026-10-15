# Handover

**Date:** 2026-10-15. **State:** both homepages built and tested locally. Not deployed (Keegan: local only).

## What exists

- `/home-page-1` (light; `/` opens it) and `/home-page-2` (warm charcoal). Both share the same components and content file. Each keeps its own mockup's wording and look.
- `/style-guide`: both themes, plus every shared piece rendered from the real components.
- The header on both pages has labelled "Home page 1" and "Home page 2" links. The active one is underlined in orange. On mobile they sit in the menu.

## How it's built

- `src/components/content.ts` holds all wording, verbatim from the mockups. A `|` marks a desktop line break.
- `src/styles/home.css` is the whole visual system: tokens per variant, mobile first, and the desktop composition in mockup units (`--s`). See DECISIONS.md for the scale rule.
- `src/components/area-map/`: real OSM coastline. `node scripts/build-map.mjs` regenerates `geo.ts`. The region outlines live in that script.
- `src/app/actions.ts`: the enquiry server action. Set `ENQUIRY_WEBHOOK_URL` (before building, since the pages prerender) to deliver for real. Without it the form is labelled DEMO and says nothing was sent.

## Run and check

- `npm run dev -- --port 3217`, then open http://localhost:3217
- `node scripts/shoot.mjs <dir>` takes full-page screenshots at 1440, 390 and 765.
- `node scripts/check.mjs` runs the behaviour checks: switching, nav, map with mouse, keyboard and touch, FAQ, form, mobile menu and reduced motion.

## Next

- Keegan reviews both pages locally.
- If he shares the map style screenshot (`references/`), compare it with the map and tune the palette and depth.
- Open gaps are listed in PROGRESS.md.
