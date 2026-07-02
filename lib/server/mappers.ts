import "server-only";
import type { EventRow, EventUpdateRow } from "@/db/schema";
import type {
  CivicEvent,
  ConfidenceFactor,
  MyArea,
  MyAreaNearby,
  TimelineEntry,
} from "@/lib/types";
import { MY_AREA_CONFIG } from "@/lib/tokens";
import { haversineMeters } from "./dedup";

/** e.g. 240000ms -> "4m", 5400000ms -> "1h". */
export function formatAgo(ms: number): string {
  const mins = Math.max(0, Math.round(ms / 60000));
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  return `${hours}h`;
}

function formatClock(d: Date): string {
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function serializeEvent(row: EventRow, now: number): CivicEvent {
  return {
    id: row.id,
    title: row.title,
    event_type: row.eventType,
    category: row.category,
    status: row.status,
    confidence: row.confidence,
    source_count: row.sourceCount,
    location_label: row.locationLabel,
    neighborhood: row.neighborhood,
    detected_ago: formatAgo(now - row.firstSeenAt.getTime()),
    coord: { lat: row.lat, lng: row.lng },
    map_pos_pct: { x: 50, y: 50 }, // legacy; unused with Mapbox
    signal_trend: row.signalTrend,
    is_major: row.isMajor,
  };
}

export function serializeTimeline(updates: EventUpdateRow[]): TimelineEntry[] {
  return updates.map((u) => ({
    time: formatClock(u.createdAt),
    status: u.status,
    head: u.head,
    body: u.body,
    sources: `${u.sourceCountAtUpdate} source${u.sourceCountAtUpdate === 1 ? "" : "s"}`,
  }));
}

export function serializeConfidence(row: EventRow): ConfidenceFactor[] {
  return row.confidenceFactors ?? [];
}

/** Derive the My Area view from events near the watched-area center. */
export function serializeMyArea(rows: EventRow[], now: number): MyArea {
  const center = MY_AREA_CONFIG.center;
  const radiusM = MY_AREA_CONFIG.radius_mi * 1609.34;

  const withDist = rows
    .map((r) => ({
      row: r,
      dist: haversineMeters(center, { lat: r.lat, lng: r.lng }),
    }))
    .filter((x) => x.dist <= radiusM)
    .sort((a, b) => a.dist - b.dist);

  const activeNearby = withDist.filter((x) => x.row.status !== "resolved");
  const last24 = rows.filter(
    (r) => now - r.firstSeenAt.getTime() <= 24 * 60 * 60 * 1000
  ).length;

  const nearby: MyAreaNearby[] = withDist.slice(0, 6).map((x) => ({
    id: x.row.id,
    title: x.row.title,
    category: x.row.category,
    status: x.row.status,
    distance_mi: Math.round((x.dist / 1609.34) * 10) / 10,
    location_label: x.row.locationLabel,
    confidence: x.row.confidence,
  }));

  const areaStatus =
    activeNearby.length >= 3 ? "Elevated" : activeNearby.length >= 1 ? "Moderate" : "Quiet";

  return {
    name: MY_AREA_CONFIG.name,
    radius_mi: MY_AREA_CONFIG.radius_mi,
    alerts_on: MY_AREA_CONFIG.alerts_on,
    stats: [
      {
        label: "Area status",
        value: areaStatus,
        sub: `${activeNearby.length} active event${activeNearby.length === 1 ? "" : "s"} nearby`,
        tone: "hazard",
      },
      {
        label: "Last 24 hours",
        value: `${last24} event${last24 === 1 ? "" : "s"}`,
        sub: "Detected in your area",
        tone: "ems",
      },
      {
        label: "Avg. detect time",
        value: "38 sec",
        sub: "Signal → mapped event",
        tone: "accent",
      },
    ],
    nearby,
  };
}
