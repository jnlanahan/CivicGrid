# Handoff: CivicGrid — Live Event Intelligence (Web MVP)

> **Goal of this build:** a **clickable prototype** of the CivicGrid web app, populated with **realistic dummy data**, with **all components in place and mock interactions wired up**. The real ingestion/AI/geocoding pipeline is *out of scope* for this pass — no backend needs to work yet. Think "navigable, believable front-end shell," not "production app."

---

## 1. Overview

CivicGrid is a real-time local event intelligence platform for Columbus, OH. It turns public-safety signals into structured, mappable events and shows residents **what is happening around them and how reliable that information is**. The product's core principle is **never present uncertain information as fact** — every event carries a transparent confidence score, a source count, and an evolving status.

This handoff covers the **consumer web MVP**: a live map of Columbus events, an event-intelligence feed, category filters, an event detail card, a confidence explainer, an event timeline, and a personalized "My Area" view.

Two product docs ship with this repo and are the source of truth for *product intent*:
- `docs/mvp-prd.md` — MVP scope, event model, functional requirements, tech stack.
- `docs/civicgrid-prfaq.md` — positioning, principles, the 5-state status model, risks.

This README is the source of truth for *what to build and how it should look*.

---

## 2. About the design files

The files in `design/` are a **design reference created in HTML** — a prototype that shows the intended look, layout, and behavior. **They are not production code to copy verbatim.** Your job is to **recreate these designs in the target stack** (see §3) using its idiomatic patterns and components.

- `design/CivicGrid.dc.html` — the full design. Open it in a browser to explore. It is laid out as a **pannable canvas** containing multiple frames (screens + reference panels). Pan/scroll to see them all.
- `design/support.js` — runtime that powers the HTML prototype. **Not part of your app** — it only makes the reference file render. Ignore it when building.
- `data/dummy-data.json` — the exact dummy dataset used in the mocks (events, status model, categories, confidence factors, timeline, My Area). **Use this directly** to populate the prototype.
- `screenshots/` — rendered PNG of each screen (see §5).

### Important note on the canvas
The HTML reference also contains a **second visual direction ("Direction B — Signal Room")** and a **system reference panel**. **Build Direction A only** (see §4). Direction B (`screenshots/07-alt-signal-room.png`) is included purely as an alternative for reference — do **not** implement it.

---

## 3. Target stack

Per `docs/mvp-prd.md`, the intended stack is:

- **Next.js** (App Router) + **React**
- **Tailwind CSS** for styling
- **Mapbox GL JS** for the map

The repo is currently empty (docs only), so scaffold a fresh Next.js + Tailwind app. Recommendations:
- **Icons:** the mock uses a Lucide-style icon set (see §9). Use **`lucide-react`** — the glyphs match closely.
- **Map:** use **Mapbox GL JS** (`react-map-gl` is fine) with a light/muted custom style. For *this* clickable-prototype pass you may instead render a **static styled map placeholder** with absolutely-positioned markers driven by each event's `map_pos_pct` (see `dummy-data.json`) — both are acceptable. If you wire up real Mapbox, place markers from each event's `coord`. Keep the map visually calm and warm-neutral so the colored pins pop.
- **State:** local React state / context is plenty (no server). See §8.
- **Data:** import `data/dummy-data.json`. No fetching, no auth, no pipeline.

---

## 4. Fidelity

**Treat the mocks as a layout & flow guide — match the structure and component inventory closely, but apply your own polish.** You do not need pixel-perfect parity. The **design tokens in §10 are the intended palette/type/spacing** — stay within that system (warm-cream surfaces, ink text, single orange accent, the 5 status colors, the 6 category colors). Use the exact hex values for the **status and category color system** (those carry meaning and must be consistent), and stay faithful to the type pairing. Everything else (exact paddings, shadow depths, micro-spacing) you may refine with good judgment.

---

## 5. Screens / views

All screenshots are in `screenshots/`. Frames were captured from the HTML reference (scaled to fit, so resolution is moderate — open `design/CivicGrid.dc.html` for crisp detail and exact measurements).

| # | File | Screen |
|---|------|--------|
| 1 | `01-warm-civic-main.png` | **Live Map** (primary screen) |
| 2 | `02-filters-in-action.png` | **Filter active** state |
| 3 | `03-my-area.png` | **My Area** (personalized) |
| 4 | `04-confidence-explained.png` | **Confidence Explained** panel |
| 5 | `05-event-timeline.png` | **Event Timeline** panel |
| 6 | `06-system-reference.png` | Design system reference (categories, status ladder, type) |
| 7 | `07-alt-signal-room.png` | *Alternative direction — do not build* |

---

### 5.1 — Live Map (primary screen) · `01-warm-civic-main.png`

**Purpose:** The home view. User scans a live map of Columbus events, reads the intelligence feed, filters by category, and opens an event for detail.

**Layout (top → bottom):**
1. **App header** — single row, white surface, 1px bottom border.
   - Left: logo lockup — a grid-glyph icon (orange) + wordmark **"CivicGrid"** (Bricolage Grotesque, 700, ~21px, ink `#2A2419`).
   - Center (flex:1, max ~560px): **search field** — rounded 11px, white, 1px border `#E8E0D2`, search icon + placeholder "Search Columbus events, neighborhoods, addresses…".
   - Right: **Account** button — white pill, user icon (orange) + label + chevron-down.
2. **Filter bar** — single row, 1px bottom border.
   - Mono uppercase label "FILTERS" (`#a89e8d`, JetBrains Mono, ~11px, letter-spacing .08em).
   - **Category chips** (left→right): `All events` (selected = solid ink `#2A2419`, white text), `Major incidents`, `Police`, `Fire`, `EMS`, `Hazards`. Unselected = white, 1px border `#E8E0D2`, ink-muted text, category-colored icon. Each chip = icon + label, radius ~9px.
   - Right: **LIVE indicator** — green dot `#5CC15F` with soft glow ring + "LIVE" (mono, 500) + "· updated 12s ago".
3. **Main grid** — two columns: `1fr` (map) + `350px` (feed rail), height ~660px.
   - **Map area** (left): muted warm canvas `#ECE6DB` with subtle grid lines, soft park blobs `#D9E4CB`, a river band `#C7D8E6`, highway ribbons `#F2B27C`, faint neighborhood labels (mono, uppercase, `#9a8f7c`: "Short North", "Italian Village", "German Village"), and a large faint "Columbus" wordmark centered.
     - **Zoom controls** top-right: white rounded stack, plus / minus.
     - **Event pins** (see §7 for spec): circular white markers with a 3px category-colored border and the category icon inside; a small mono status chip sits beneath each pin ("REPORTED" / "CORROBORATED" / "RESOLVED"). The **active/selected** pin is larger (~52px) with an animated pulse ring. Resolved pins are greyed and ~70% opacity.
     - **Floating Event Detail card** (bottom-left of map) — see §5.1a.
     - Map attribution bottom-left: "© Mapbox · OpenStreetMap" (mono, tiny, muted).
   - **Event Intelligence feed** (right rail): warm off-white `#FBF8F2`, 1px left border.
     - Header: "Event Intelligence" (Bricolage 600 ~16px) + subline "6 active · Columbus" (mono, muted) + a "Newest" sort chip (radio icon).
     - Scrolling list of **event cards** (see §5.1b), gap ~10px.

**5.1a — Floating Event Detail card** (the highlighted event):
- White, radius 16px, big soft shadow `0 18px 50px rgba(30,20,10,.24)`, ~392px wide.
- Top: a 5px category-colored accent strip (`#E8833A` for traffic).
- Header row: rounded-square icon tile (category tint bg `#FBEAD9`, category-colored icon) + title **"Possible Vehicle Collision"** (Bricolage 600 ~20px) + location row with pin icon "I-71 North near 17th Ave" + a close (×) icon top-right.
- Status row: a **status chip** ("Reported" — `#B5791A` on `#F4EAD2`, with a leading dot) + mono meta "1 source · 4 min ago".
- **Confidence block:** warm panel `#FAF6EF`, 1px border `#EFE7D8`, radius 12px, containing a **semicircular gauge** (88px) drawn as an SVG arc — track `#EBE0CC`, fill in category color, big "81%" in the center (JetBrains Mono 600) — plus a "CONFIDENCE" mono label and the line: "Scanner signals suggest a possible multi-vehicle collision. This is an **unverified estimate.**"
- **Signal sparkline row:** mono "SIGNAL" label + a small rising sparkline (category color) + "↑ rising" (green).
- **Actions:** two buttons — primary **"Show timeline"** (solid ink `#2A2419`, white text, clock icon) and secondary **"Confidence explained"** (white, 1px border, orange info icon). These open the Timeline (§5.5) and Confidence (§5.4) panels respectively.

**5.1b — Feed event card** (right rail, repeats per event):
- White, 1px border `#EEE6D8`, radius 13px, padding ~13px.
- Row 1: category icon tile (38px, tint bg, colored icon) + title (Hanken 600 ~14.5px) + truncated location (muted, ~12px) + a small **semicircular confidence gauge** (~52px) with the % in the center.
- Row 2: a status chip + a tiny sparkline (category color, 60% opacity) + relative time (mono, e.g. "4m").

---

### 5.2 — Filter active state · `02-filters-in-action.png`

**Purpose:** Shows what happens when a single category filter (here **Police**) is selected.

**Behavior / layout deltas from the primary screen:**
- The selected chip ("Police") becomes **solid in its category color** (`#C9503E`, white text, soft colored shadow) and gains a small **× to clear**. Other chips return to the muted white style.
- Filter-bar right side shows a mono count in the category color: "2 police events".
- On the map: **non-matching pins fade to ~22% opacity**; matching (Police) pins stay full-strength, and the active one keeps its pulse ring.
- A **toast** appears centered near the top of the map: dark pill `#2A2419`, white text, eye icon — "Showing **Police** only · 4 events hidden" + an orange **"Clear"** action.

Apply the same pattern for every category. "All events" clears the filter. "Major incidents" filters to `is_major: true` events.

---

### 5.3 — My Area · `03-my-area.png`

**Purpose:** A personalized neighborhood view (the user's watched area, "Short North", 1.2 mi radius). *Note: the MVP PRD lists user accounts as a non-goal — treat this as a **mock/personalized demo screen** in the prototype, with no real auth.*

**Layout:**
- **Header:** home icon (green `#3F8F5B`) + neighborhood name "Short North" (Bricolage 700 ~22px) + subline "Your watched area · 1.2 mi radius" + an "Alerts on" toggle button (right, bell icon).
- **Stat row:** three equal cards (white, 1px border, radius 13px), each = a small colored dot/icon + label, a big value (Bricolage 600 ~24px), and a sub-line:
  - "Area status" → **Moderate** · "2 active events nearby" (amber dot).
  - "Last 24 hours" → **7 events** · "Mostly traffic & EMS" (EMS-blue activity icon).
  - "Avg. detect time" → **38 sec** · "Signal → mapped event" (orange clock).
- **"Nearby right now"** section: mono uppercase label + an orange "View on map ›" link (navigates back to the Live Map). Below: a vertical list of **nearby event rows** (white, 1px border, radius 13px): category icon tile + title + "location · distance away" + status chip + right-aligned confidence %. The resolved item is dimmed (~72% opacity).

---

### 5.4 — Confidence Explained panel · `04-confidence-explained.png`

**Purpose:** Transparency modal that explains how a confidence score is derived — central to the product principle.

**Layout (modal card, white, radius 16px):**
- **Header:** sparkles icon tile (blue tint `#E2ECF4`) + title "How we calculate confidence" (Bricolage 600 ~21px) + subline "Event evt_456 · Possible Vehicle Collision" + close ×.
- **Principle banner:** warm panel `#FAF6EF`, info icon, copy: "CivicGrid **never presents uncertain information as fact.** Confidence is a transparent estimate built from the signals below — not a verdict. **81% is an unverified estimate.**"
- **"What goes into the score":** a list of **factor bars**. Each = factor name (Hanken 600) + value (mono, right-aligned), then a thin progress bar (track `#F0EADF`, fill orange `#E8833A`, rounded), then a small grey note. Factors (from `dummy-data.json › confidenceFactors`):
  - Independent sources · "1 source" · 35% · "A single signal lowers confidence."
  - Signal clarity · "High" · 82% · "Transcription was clear."
  - Corroboration · "Partial" · 48% · "Some agreement across signals."
  - Location specificity · "Street-level" · 74% · "Named cross-street referenced."
  - Recency · "4 min ago" · 88% · "Recent signals weigh more."
- **"What the status means":** the full status legend — each row = a fixed-width status chip + its description. Use `dummy-data.json › statusModel` (all 5: Reported, Corroborated, Confirmed, Resolved, Unsubstantiated).

---

### 5.5 — Event Timeline panel · `05-event-timeline.png`

**Purpose:** Shows how an event evolved as signals arrived (status progression over time).

**Layout (modal card, white, radius 16px):**
- **Header:** event title "Possible Vehicle Collision" (Bricolage 600 ~19px) + close × + subline "How this event evolved as signals arrived".
- **Status progress track:** a horizontal 4-node stepper — **Reported → Corroborated → Confirmed → Resolved**. Completed nodes are filled in their status color with a connecting gradient line; future nodes are hollow with a muted ring. (In the mock, the event has reached "Corroborated".)
- **Update list:** a vertical timeline (dot + connector line on the left). Each entry = time (mono) + status chip + right-aligned source count, then a bold headline, then a muted body line. Use `dummy-data.json › timeline.entries` (newest first):
  - 2:39 PM · Corroborated · 3 sources · "EMS dispatch referenced in area"
  - 2:36 PM · Corroborated · 2 sources · "Second signal matches location"
  - 2:34 PM · Reported · 1 source · "Unit referenced location; speeds estimated"
  - 2:32 PM · Reported · 1 source · "First reference detected"
- **Footer note:** a dashed warm panel with a radio icon: "Monitoring for further signals — status updates automatically."

---

### 5.6 — System reference · `06-system-reference.png`

Not a screen — a reference panel documenting the **6 event categories** (icon + tint + color), the **5-step status ladder**, and the **type system**. Use it to validate your token setup (§10). It mirrors `dummy-data.json › categories` and `statusModel`.

---

## 6. Privacy & copy guardrails (do not violate)

These come straight from the PRD/PRFAQ and shape the copy in every component:
- **Never** show raw scanner audio, raw transcripts, names, license plates, medical details, or victim information.
- Use **tentative language**: "Possible…", "Reported", "unverified estimate". Never label something "Confirmed" unless status is `confirmed`.
- Always surface **confidence + source count** alongside any event.
- Locations are **approximate** ("near", cross-streets), never precise addresses of individuals.

---

## 7. Pin / marker spec

- **Shape:** circle, white fill, **3px solid border in the event's category color**, category icon centered (same color), drop shadow.
- **Sizes:** default ~46px; **active/selected** ~52px with an animated **pulse ring** (a same-color ring that scales from ~0.85→2.4 and fades, ~2.2s ease-out, infinite). Resolved events: smaller (~40px), greyed (`#7B8794`), ~70% opacity.
- **Status chip under pin:** tiny mono uppercase label on a white rounded chip with a small shadow (e.g. "REPORTED", "CORROBORATED", "RESOLVED").
- **Positioning:** anchored bottom-center (transform `translate(-50%,-100%)`). In the static-map prototype, place via each event's `map_pos_pct` `{x,y}` (percentages of the map area).

---

## 8. Interactions & state

For the clickable prototype, wire these with dummy data — they should *feel* real but need no backend.

**Interactions:**
- **Click a pin** → select that event: open/replace the Floating Event Detail card, emphasize the pin (pulse), and highlight the matching feed card.
- **Click a feed card** → same as clicking its pin.
- **Click a filter chip** → set the active filter, restyle the chip (solid category color), fade non-matching pins, and show the count toast with a **Clear** action. "All events" resets.
- **"Show timeline"** (detail card) → open the **Event Timeline** panel (§5.5).
- **"Confidence explained"** (detail card) → open the **Confidence Explained** panel (§5.4).
- **Close (×)** on detail card / panels → dismiss.
- **"View on map"** (My Area) → navigate to the Live Map.
- **Search field & Account dropdown** → mock only (non-functional or trivial demo behavior).
- **LIVE indicator** → static pulse animation + "updated 12s ago" label (optionally tick a fake timer).

**Suggested state shape:**
```ts
type ViewKey = 'map' | 'my-area';
type PanelKey = null | 'timeline' | 'confidence';
type FilterKey = 'all' | 'major' | 'police' | 'fire' | 'ems' | 'hazard';

interface AppState {
  view: ViewKey;            // top-level navigation
  events: Event[];          // from dummy-data.json
  activeFilter: FilterKey;  // drives map fade + toast
  selectedEventId: string;  // drives detail card + pin emphasis
  openPanel: PanelKey;      // timeline / confidence modal
}
```

**Animations / transitions:**
- Pin pulse ring: ~2.2s ease-out infinite.
- LIVE dot blink/glow: ~2s infinite (subtle).
- Panel/detail open: fade + slight slide/scale (~150–200ms ease-out).
- Pin fade on filter: ~200ms opacity.

**Loading / empty / error states** (build lightweight versions):
- Loading: skeleton feed cards + a "Connecting to live feed…" line.
- Empty (filter with no matches): "No active <category> events" in the feed + cleared map.
- Error: a non-blocking banner ("Live feed unavailable — showing last known events").

---

## 9. Icons

The mock uses a **Lucide-style line-icon set** (2px stroke, rounded). Map each to `lucide-react`:

| Mock use | Lucide icon |
|---|---|
| Traffic / collision | `Car` |
| Fire | `Flame` |
| EMS / medical | `Cross` / `Plus` in a box → `SquarePlus` |
| Police | `Shield` |
| Hazard | `TriangleAlert` |
| Location | `MapPin` |
| Search | `Search` |
| Filters / layers | `Layers` |
| Major incidents | `Share2` |
| Live / monitoring | `RadioTower` / `Activity` |
| Confidence / AI | `Sparkles` |
| Info | `Info` |
| Time | `Clock` |
| Account | `User` |
| Alerts | `Bell` |
| Home / My Area | `Home` |
| Zoom +/− | `Plus` / `Minus` |
| Close | `X` |
| Chevron | `ChevronDown` / `ChevronRight` |

All strokes are 2px, `stroke-linecap`/`linejoin` round.

---

## 10. Design tokens (Direction A — "Warm Civic")

### Color — surfaces & text
| Token | Hex | Use |
|---|---|---|
| App background | `#F6F1E9` | main warm-cream canvas |
| Surface / card | `#FFFFFF` | cards, header, panels |
| Surface alt | `#FBF8F2` | feed rail |
| Warm panel | `#FAF6EF` | confidence/info insets |
| Border | `#EBE3D6` · `#E8E0D2` · `#EEE6D8` · `#EFE7D8` | hairlines (warm greys) |
| Ink (primary text) | `#2A2419` | headings, solid buttons |
| Text secondary | `#5B5346` | body |
| Text muted | `#8A8070` · `#A89E8D` | meta, captions |
| Text faint | `#B0A594` · `#B6AC9C` | placeholders, attribution |
| Accent (brand) | `#E8833A` | logo, primary accent, links, gauges |
| Accent tint | `#FBEAD9` | accent icon tiles / strips |
| Live green | `#5CC15F` | LIVE indicator |
| Canvas backdrop | `#CFC8BC` | (reference-canvas only; not an app surface) |

### Color — status (semantic, use exact values)
| Status | Text/dot | Background |
|---|---|---|
| Reported | `#B5791A` | `#F4EAD2` |
| Corroborated | `#356C9B` | `#DEEAF3` |
| Confirmed | `#3F8F5B` | `#DDEEE3` |
| Resolved | `#6B7682` | `#E7EAED` |
| Unsubstantiated | `#9A5A4C` | `#F0E3DF` |

### Color — category (semantic, use exact values)
| Category | Color | Tint (icon tile bg) |
|---|---|---|
| Traffic / Collision | `#E8833A` | `#FBEAD9` |
| Fire | `#D9534F` | `#F7E2E1` |
| EMS / Medical | `#3E7CB1` | `#E2ECF4` |
| Police | `#C9503E` | `#F6E3DF` |
| Hazard | `#E0A526` | `#F8EFD6` |
| Other / civic | `#7B8794` | `#EAEDF0` |

### Map palette
Canvas `#ECE6DB` · grid lines `#FBFAF6` · parks `#D9E4CB` · river `#C7D8E6` · highways `#F2B27C` / `#F4C79B` · area labels `#9A8F7C` · city wordmark `#B7AD98`.

### Typography
Load via Google Fonts. **Direction A uses three families:**
- **Bricolage Grotesque** — display / headings (600–700). Tighten tracking ~−.01em.
- **Hanken Grotesk** — UI & body (400–700).
- **JetBrains Mono** — data, metrics, IDs, timestamps, and uppercase micro-labels (400–600; labels use letter-spacing .06–.12em, uppercase).

*(Newsreader and Spline Sans appear in the reference only for Direction B — ignore them.)*

Approx scale: display/section titles 19–22px · big stat values 24px · event detail title 20px · card titles 14.5–15px · body 13.5–15px · meta 12–13px · mono micro-labels 11px · pin status chips 9px.

### Radii
Pills/chips 6–9px · buttons ~10px · cards 13px · panels/modals 16px · app-shell frame 14px · icon tiles 10–13px.

### Shadows
- Subtle card: `0 1px 2px rgba(0,0,0,.02)`
- Pin: `0 6px 14px rgba(0,0,0,.18)` (active `0 8px 18px rgba(232,131,58,.35)`)
- Floating detail card: `0 18px 50px rgba(30,20,10,.24)`
- Toast: `0 8px 22px rgba(0,0,0,.25)`

### Spacing
Roughly an 8px-ish rhythm: card padding 13–22px · header padding 16–26px · grid gaps 10–14px · section gaps 14–20px.

---

## 11. Data model

Use `data/dummy-data.json`. Core **Event** shape (extends the PRD's event object with display-derived fields):

```jsonc
{
  "id": "evt_456",
  "title": "Possible Vehicle Collision",
  "event_type": "vehicle_accident",   // PRD field
  "category": "vehicle_accident",      // → category color/icon/tint (see §10)
  "status": "reported",                // → status color/label (see §10)
  "confidence": 0.81,                  // 0–1, render as %
  "source_count": 1,
  "location_label": "I-71 North near 17th Ave",
  "neighborhood": "Italian Village",
  "detected_ago": "4m",
  "coord": { "lat": 39.985, "lng": -82.997 }, // for real Mapbox markers
  "map_pos_pct": { "x": 48, "y": 24 },        // for static-map placeholder markers
  "signal_trend": "rising",            // rising | steady | falling (sparkline)
  "is_major": true                     // drives "Major incidents" filter
}
```

The JSON also contains: `statusModel`, `categories`, `filters`, `confidenceFactors` (for evt_456), `timeline` (for evt_456), and `myArea`. For the prototype, the Confidence and Timeline panels can show the evt_456 data regardless of which event is selected (or you can synthesize per-event variants if you want extra polish).

---

## 12. Assets

- **Icons:** `lucide-react` (no custom SVGs needed). See §9.
- **Map:** Mapbox GL JS (needs a public token) **or** a CSS/static styled-map placeholder for this pass. No real tiles are shipped in this bundle.
- **Fonts:** Google Fonts — Bricolage Grotesque, Hanken Grotesk, JetBrains Mono.
- **Imagery:** none required. The design is icon- and type-driven; there are no photographic assets.

---

## 13. Files in this bundle

```
design_handoff_civicgrid/
├── README.md                         ← you are here
├── design/
│   ├── CivicGrid.dc.html             ← full HTML design reference (open in browser)
│   └── support.js                    ← runtime for the reference only (ignore in build)
├── data/
│   └── dummy-data.json               ← drop-in dummy dataset
└── screenshots/
    ├── 01-warm-civic-main.png        ← Live Map (primary)
    ├── 02-filters-in-action.png      ← Filter active state
    ├── 03-my-area.png                ← My Area
    ├── 04-confidence-explained.png   ← Confidence panel
    ├── 05-event-timeline.png         ← Timeline panel
    ├── 06-system-reference.png       ← design system reference
    └── 07-alt-signal-room.png        ← alternative direction (DO NOT build)
```

Also in the repo root: `docs/mvp-prd.md` and `docs/civicgrid-prfaq.md` (product context).

---

## 14. Suggested build order

1. Scaffold Next.js + Tailwind; define the token system from §10 (Tailwind theme: colors, fonts, radii, shadows). Load the 3 Google Fonts.
2. Build the **app shell** (header + filter bar) and the **two-column layout**.
3. Build the **map area** (static styled placeholder or Mapbox) with **pins** driven by `dummy-data.json` (§7).
4. Build the **Event Intelligence feed** cards.
5. Build the **Floating Event Detail card** + the confidence gauge.
6. Wire **selection** (pin ↔ feed ↔ detail card) and **filtering** (chip → fade + toast).
7. Build the **Confidence** and **Timeline** panels; wire the detail-card buttons.
8. Build the **My Area** view + top-level nav.
9. Add light **loading/empty/error** states and the open/close/pulse animations.
10. Pass for polish against the screenshots.

The end state is a believable, navigable CivicGrid front-end on dummy data — ready to later swap in the real event pipeline.
