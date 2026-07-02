import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { events, eventUpdates, type InsertEvent, type InsertEventUpdate } from "./schema";
import raw from "../data/dummy-data.json";
import type { CategoryKey, ConfidenceFactor, SignalTrend, StatusKey } from "../lib/types";

// Standalone client (not db/client.ts — that is server-only and throws under tsx).
const client = createClient({ url: process.env.DATABASE_URL ?? "file:./civicgrid.db" });
const db = drizzle(client, { schema: { events, eventUpdates } });

interface DummyEvent {
  id: string;
  title: string;
  event_type: string;
  category: CategoryKey;
  status: StatusKey;
  confidence: number;
  source_count: number;
  location_label: string;
  neighborhood: string;
  detected_ago: string;
  coord: { lat: number; lng: number };
  signal_trend: SignalTrend;
  is_major: boolean;
}

const data = raw as unknown as {
  events: DummyEvent[];
  confidenceFactors: { _for_event: string; factors: ConfidenceFactor[] };
  timeline: {
    _for_event: string;
    entries: { time: string; status: StatusKey; head: string; body: string; sources: string }[];
  };
};

function agoMs(detected: string): number {
  const h = /(\d+)\s*h/.exec(detected);
  if (h) return Number(h[1]) * 60 * 60 * 1000;
  const m = /(\d+)\s*m/.exec(detected);
  if (m) return Number(m[1]) * 60 * 1000;
  return 5 * 60 * 1000;
}

function sourcesToCount(s: string): number {
  const n = /(\d+)/.exec(s);
  return n ? Number(n[1]) : 1;
}

function syntheticFactors(e: DummyEvent): ConfidenceFactor[] {
  return [
    {
      name: "Independent sources",
      value: `${e.source_count} source${e.source_count === 1 ? "" : "s"}`,
      pct: Math.min(90, 30 + e.source_count * 20),
      note: e.source_count > 1 ? "Multiple signals agree." : "A single signal lowers confidence.",
    },
    { name: "Signal clarity", value: "Moderate", pct: 70, note: "Transcription was mostly clear." },
    { name: "Location specificity", value: "Street-level", pct: 72, note: "Named cross-street referenced." },
    { name: "Recency", value: e.detected_ago, pct: 80, note: "Recent signals weigh more." },
  ];
}

async function main() {
  const now = Date.now();

  // Idempotent: clear both tables (updates first for the FK).
  await db.delete(eventUpdates);
  await db.delete(events);

  const eventRows: InsertEvent[] = data.events.map((e) => {
    const first = new Date(now - agoMs(e.detected_ago));
    const factors =
      e.id === data.confidenceFactors._for_event
        ? data.confidenceFactors.factors
        : syntheticFactors(e);
    return {
      id: e.id,
      title: e.title,
      eventType: e.event_type,
      category: e.category,
      status: e.status,
      confidence: e.confidence,
      sourceCount: e.source_count,
      locationLabel: e.location_label,
      neighborhood: e.neighborhood,
      lat: e.coord.lat,
      lng: e.coord.lng,
      signalTrend: e.signal_trend,
      isMajor: e.is_major,
      firstSeenAt: first,
      lastUpdateAt: first,
      confidenceFactors: factors,
    };
  });
  await db.insert(events).values(eventRows);

  const updateRows: InsertEventUpdate[] = [];
  for (const e of data.events) {
    const first = new Date(now - agoMs(e.detected_ago));
    if (e.id === data.timeline._for_event) {
      // Reuse the dummy timeline; oldest first so createdAt increases.
      const entries = [...data.timeline.entries].reverse();
      entries.forEach((entry, i) => {
        updateRows.push({
          id: `upd_seed_${e.id}_${i}`,
          eventId: e.id,
          createdAt: new Date(first.getTime() + i * 2 * 60 * 1000),
          status: entry.status,
          head: entry.head,
          body: entry.body,
          sourceCountAtUpdate: sourcesToCount(entry.sources),
        });
      });
    } else {
      updateRows.push({
        id: `upd_seed_${e.id}_0`,
        eventId: e.id,
        createdAt: first,
        status: e.status,
        head: e.title,
        body: "Signal detected in the area. Unverified estimate.",
        sourceCountAtUpdate: e.source_count,
      });
    }
  }
  await db.insert(eventUpdates).values(updateRows);

  console.log(`Seeded ${eventRows.length} events and ${updateRows.length} timeline entries.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
