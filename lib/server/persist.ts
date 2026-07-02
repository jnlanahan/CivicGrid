import "server-only";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { events, eventUpdates, type EventRow } from "@/db/schema";
import type { StatusKey } from "@/lib/types";
import type { ExtractedEvent } from "./extract";
import { findMatchingEvent } from "./dedup";

function shortId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

/** A brand-new single-source event can never be "confirmed". */
function initialStatus(extracted: ExtractedEvent): StatusKey {
  if (extracted.status === "unsubstantiated" || extracted.status === "resolved") {
    return extracted.status;
  }
  return "reported";
}

function statusForCount(count: number): StatusKey {
  if (count >= 3) return "confirmed";
  if (count >= 2) return "corroborated";
  return "reported";
}

export interface IngestOutcome {
  event: EventRow;
  created: boolean;
}

export async function ingestExtracted(
  extracted: ExtractedEvent,
  coord: { lat: number; lng: number; confidence: number },
  now: number
): Promise<IngestOutcome> {
  const nowDate = new Date(now);
  const match = await findMatchingEvent(
    { category: extracted.category, lat: coord.lat, lng: coord.lng },
    now
  );

  if (match) {
    const newCount = match.sourceCount + 1;
    const newStatus =
      match.status === "confirmed" ? "confirmed" : statusForCount(newCount);
    const newConfidence = Math.min(
      0.97,
      Math.max(match.confidence, coord.confidence) + 0.05
    );

    const updated = await db.transaction(async (tx) => {
      await tx
        .update(events)
        .set({
          sourceCount: newCount,
          status: newStatus,
          confidence: newConfidence,
          signalTrend: "rising",
          lastUpdateAt: nowDate,
        })
        .where(eq(events.id, match.id));

      await tx.insert(eventUpdates).values({
        id: shortId("upd"),
        eventId: match.id,
        createdAt: nowDate,
        status: newStatus,
        head: extracted.summary_head,
        body: extracted.summary_body,
        sourceCountAtUpdate: newCount,
      });

      const [row] = await tx.select().from(events).where(eq(events.id, match.id));
      return row;
    });

    return { event: updated, created: false };
  }

  // No match → create a new event with its first timeline entry.
  const id = shortId("evt");
  const status = initialStatus(extracted);
  const created = await db.transaction(async (tx) => {
    await tx.insert(events).values({
      id,
      title: extracted.title,
      eventType: extracted.event_type,
      category: extracted.category,
      status,
      confidence: coord.confidence,
      sourceCount: 1,
      locationLabel: extracted.location_text,
      neighborhood: extracted.neighborhood,
      lat: coord.lat,
      lng: coord.lng,
      signalTrend: extracted.signal_trend,
      isMajor: extracted.is_major,
      firstSeenAt: nowDate,
      lastUpdateAt: nowDate,
      confidenceFactors: extracted.confidence_factors,
    });

    await tx.insert(eventUpdates).values({
      id: shortId("upd"),
      eventId: id,
      createdAt: nowDate,
      status,
      head: extracted.summary_head,
      body: extracted.summary_body,
      sourceCountAtUpdate: 1,
    });

    const [row] = await tx.select().from(events).where(eq(events.id, id));
    return row;
  });

  return { event: created, created: true };
}
