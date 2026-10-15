# Project: Cape Gutters

Read with the team rules in `~/Work/CLAUDE.md`, then `DECISIONS.md`, `PROGRESS.md`, `HANDOVER.md`.

## The job

- **Client:** Cape Gutters, a Cape Town gutter specialist (installs, replacements, repairs, cleaning).
- **What this must prove:** both supplied homepage mockups work as real, responsive, fully working sites.
- **The feeling we're selling:** clear, careful and local; calm confidence, no hard sell.
- **Audience:** the Cape Gutters decision-maker at the pitch; behind them, Cape Town homeowners.
- **Where it's shown:** locally (Keegan, 2026-10-15: no Netlify deploy).

## Source material (this is the spec)

- Home page 1 mockup (light): `references/home-page-1-mockup.png` (copy in `boards/`)
- Home page 2 mockup (charcoal): `references/home-page-2-mockup.png` (copy in `boards/`)
- Map style reference: Keegan's screenshot could not be read (macOS permissions). Built from his written brief. Drop it in `references/` to compare.
- Wording: verbatim from the mockups, in `src/components/content.ts`.
- Photography: generated pitch imagery, originals in `references/generated-photos/`. Never presented as Cape Gutters work.

## Skills for this project

Director's kickoff recommendation (Keegan may change):

- **Lead design skill:** `impeccable` (craft only: adapt, harden, polish; the mockups are the fixed direction)
- **Supporting:** `divine-discontent` (first), `playwright-cli`, `emil-design-eng`, `mobile-native`

## Project rules

- **Keep:** the two mockups' composition, wording and palettes. Only the map and the header nav may depart from them.
- Never invent business rules, contact details, prices, guarantees or reviews. Anything made up is labelled DEMO.
- Keep `DECISIONS.md` and `PROGRESS.md` current. Write `HANDOVER.md` at the end of big sessions.
- **Stack:** Next.js 16 (App Router), Tailwind 4 (base only), hand-written CSS system in `src/styles/home.css`.
- **Run it:** `npm run dev -- --port 3217`, then open http://localhost:3217 (redirects to `/home-page-1`).
- **Style guide:** `/style-guide`. Pages are assembled from the shared pieces in `src/components/`.
- **Screens:** `node scripts/shoot.mjs <outDir>` (1440, 390, 765) with the dev server running.
- **Map data:** `node scripts/build-map.mjs` rebuilds `src/components/area-map/geo.ts` from OSM coastline data.
- **Live link:** none by request. Local only.
