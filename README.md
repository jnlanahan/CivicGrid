# CivicGrid

Real-time local event intelligence for Columbus, OH. CivicGrid turns public-safety
signals into structured, mappable events and shows residents **what is happening
around them and how reliable that information is** — every event carries a transparent
confidence score, a source count, and an evolving status.

This repo contains the **consumer web MVP prototype**: a clickable, navigable
front-end shell populated with realistic dummy data. The real ingestion / AI /
geocoding pipeline is out of scope for this pass.

## Stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** with the "Warm Civic" design token system
- **lucide-react** icons
- Styled static map placeholder (no Mapbox token required); markers are driven by
  each event's `map_pos_pct`

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm start        # serve the production build
```

## What's built

- **Live Map** — styled Columbus canvas, category-colored event pins with status
  chips and a pulse ring on the selected pin, zoom controls, and the floating
  **Event Detail** card with a semicircular confidence gauge.
- **Event Intelligence feed** — per-event cards with confidence gauges and signal
  sparklines; selection is synced between pins and feed cards.
- **Filters** — category chips fade non-matching pins, show a count, and surface a
  dismissible toast.
- **Confidence Explained** and **Event Timeline** panels.
- **My Area** — personalized neighborhood view with stats and nearby events.
- Lightweight loading / empty / error states and open/close/pulse animations.

## Project layout

```text
app/            Next.js App Router (layout, page, globals, icon)
components/     UI components (header, filter bar, map, feed, panels, My Area)
  map/          map canvas + pins
lib/            data access, types, and the app state store
data/           dummy-data.json (drop-in dataset)
docs/           product docs (PRD, PRFAQ)
design_handoff_civicgrid/   design reference, screenshots, dataset
```

See [docs/mvp-prd.md](docs/mvp-prd.md) and [docs/civicgrid-prfaq.md](docs/civicgrid-prfaq.md)
for product intent, and [design_handoff_civicgrid/README.md](design_handoff_civicgrid/README.md)
for the design hand-off this build was created from.
