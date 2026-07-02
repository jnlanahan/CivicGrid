# CivicGrid

Real-time local event intelligence for Columbus, OH. CivicGrid turns public-safety
signals into structured, mappable events and shows residents **what is happening
around them and how reliable that information is** — every event carries a transparent
confidence score, a source count, and an evolving status.

This repo is the **working MVP** of the consumer web app. It proves the core thesis:
**AI can convert emergency-communication text into structured, useful, mappable events.**
You submit an emergency-radio snippet → Claude extracts a structured event → it's
geocoded, deduplicated against recent events, saved to a real database, and appears
live on the map.

> **Scope of this pass:** text-in extraction. Live scanner audio + speech-to-text,
> user accounts, and cloud deploy are deferred to later phases (see the PRD).

## Stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript** + **Tailwind CSS**
- **Claude** (`@anthropic-ai/sdk`) for structured event extraction
- **Drizzle ORM** + **libSQL** (local `civicgrid.db` file — no cloud account needed)
- **Zod** for validation
- **Mapbox GL** (`react-map-gl`) for the live map + geocoding
- **lucide-react** icons

## Getting started

1. **Install:**
   ```bash
   npm install
   ```
2. **Configure secrets** — copy the template and fill in the two real values:
   ```bash
   cp .env.example .env.local
   ```
   - `ANTHROPIC_API_KEY` — from https://console.anthropic.com (required for extraction)
   - `NEXT_PUBLIC_MAPBOX_TOKEN` + `MAPBOX_SERVER_TOKEN` — from https://account.mapbox.com
     (the same token value works for both; used for the map tiles and geocoding)
   - `EXTRACTION_MODEL` — defaults to `claude-sonnet-4-6`. Switch to `claude-haiku-4-5`
     (cheapest) or `claude-opus-4-8` (max accuracy) with no code change.
3. **Set up the database** (creates `civicgrid.db` and loads sample events):
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
4. **Run:**
   ```bash
   npm run dev      # http://localhost:3000
   ```

> Without a Mapbox token the app still runs — it falls back to the warm styled map.
> Without an Anthropic key the app reads/serves seeded events fine, but submitting a
> new signal in the Console will fail at the extraction step.

## Using it

- **`/`** — the live map, event feed, filters, detail card, confidence & timeline panels,
  and the My Area view. Polls the API every 15s for a "live" feel.
- **`/console`** (Account ▸ Signal Console) — the internal proof surface. Paste an
  emergency-radio snippet (or pick a sample) and submit. Claude extracts a structured
  event; it's geocoded, deduped, saved, and shows up on the map. Re-submitting a
  similar signal **corroborates** the existing event (bumps source count, appends a
  timeline update) instead of creating a duplicate.

  > The Console is unauthenticated and local-only. Do not expose it publicly.

## The pipeline

```text
transcript text
   → keyword filter        (lib/server/keyword-filter.ts — skip non-incidents, no LLM cost)
   → Claude extraction     (lib/server/extract.ts — Zod-validated structured output, privacy-guarded)
   → geocode               (lib/server/geocode.ts — Mapbox, Columbus-biased, centroid fallback)
   → dedup / cluster       (lib/server/dedup.ts — same category + near + recent)
   → persist               (lib/server/persist.ts — new event or corroborate + timeline update)
   → serialize to UI types (lib/server/mappers.ts)
```

Orchestrated by `lib/server/pipeline.ts`, exposed at `POST /api/ingest`.

**Privacy guardrails** (from the PRD/PRFAQ) are enforced in the extraction system
prompt and a post-extraction sanitizer: never output names, license plates, phone
numbers, medical/victim details, or raw transcript; locations are approximate;
language stays tentative ("Possible…", "unverified estimate").

## Database commands

| Command | What it does |
|---|---|
| `npm run db:generate` | Generate a SQL migration after editing `db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations to `civicgrid.db` |
| `npm run db:seed` | Load sample events (idempotent) |
| `npm run db:studio` | Browse the database in a local UI |

> After **any** change to `db/schema.ts`, run `db:generate` then `db:migrate` before
> testing. To start clean: stop the app, delete `civicgrid.db*` (including the
> `-wal`/`-shm` sidecars), then `db:migrate` and `db:seed` again.

## Project layout

```text
app/            App Router: page, /console, and /api routes (ingest, events, my-area)
components/     UI components (header, filter bar, map, feed, panels, My Area, console)
  map/          Mapbox canvas, pin badge, styled fallback canvas
lib/            types, tokens, client API helpers, app state store
  server/       the extraction pipeline (server-only)
db/             Drizzle schema, client, migrations, seed, sample transcripts
data/           dummy-data.json (used only to seed the database)
docs/           product docs (PRD, PRFAQ)
design_handoff_civicgrid/   original design reference + screenshots
```

See [docs/mvp-prd.md](docs/mvp-prd.md) and [docs/civicgrid-prfaq.md](docs/civicgrid-prfaq.md)
for product intent.
