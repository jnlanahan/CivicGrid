import "server-only";
import { and, eq, gte } from "drizzle-orm";
import { db } from "@/db/client";
import { events, type EventRow } from "@/db/schema";
import type { CategoryKey } from "@/lib/types";

const RECENT_WINDOW_MS = 45 * 60 * 1000; // 45 minutes
const NEAR_RADIUS_M = 400; // ~1-2 blocks

export function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Find a recent event of the same category near the candidate coordinates. */
export async function findMatchingEvent(
  candidate: { category: CategoryKey; lat: number; lng: number },
  now: number
): Promise<EventRow | null> {
  const cutoff = new Date(now - RECENT_WINDOW_MS);
  const recent = await db
    .select()
    .from(events)
    .where(and(eq(events.category, candidate.category), gte(events.lastUpdateAt, cutoff)));

  let best: EventRow | null = null;
  let bestDist = NEAR_RADIUS_M;
  for (const row of recent) {
    if (row.status === "resolved") continue;
    const dist = haversineMeters(candidate, { lat: row.lat, lng: row.lng });
    if (dist <= bestDist) {
      best = row;
      bestDist = dist;
    }
  }
  return best;
}
