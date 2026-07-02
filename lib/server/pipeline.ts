import "server-only";
import type { CivicEvent } from "@/lib/types";
import { looksLikeIncident } from "./keyword-filter";
import { extractEvent } from "./extract";
import { geocode, COLUMBUS_CENTER } from "./geocode";
import { ingestExtracted } from "./persist";
import { serializeEvent } from "./mappers";

export type IngestStatus = "created" | "corroborated" | "skipped" | "not_incident";
export interface IngestResult {
  status: IngestStatus;
  event?: CivicEvent;
  reason?: string;
}

/** Full pipeline: filter → extract → geocode → dedup → persist → serialize. */
export async function ingestTranscript(text: string): Promise<IngestResult> {
  // 1. Cheap keyword gate (cost control) — skip the LLM entirely if not an incident.
  if (!looksLikeIncident(text)) {
    return { status: "skipped", reason: "no_incident_signal" };
  }

  // 2. Claude extraction.
  const extracted = await extractEvent(text);
  if (!extracted || !extracted.is_incident) {
    return { status: "not_incident" };
  }

  // 3. Geocode (fall back to Columbus centroid, lower confidence, on a miss).
  const geo = await geocode(extracted.location_text);
  const coord = geo
    ? { lat: geo.lat, lng: geo.lng, confidence: extracted.confidence }
    : { ...COLUMBUS_CENTER, confidence: Math.max(0.4, extracted.confidence - 0.15) };

  // 4 + 5. Dedup and persist.
  const now = Date.now();
  const { event, created } = await ingestExtracted(extracted, coord, now);

  return {
    status: created ? "created" : "corroborated",
    event: serializeEvent(event, now),
  };
}
