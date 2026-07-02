import type { CivicEvent, ConfidenceFactor, MyArea, TimelineEntry } from "./types";

export type IngestStatus = "created" | "corroborated" | "skipped" | "not_incident";
export interface IngestResult {
  status: IngestStatus;
  event?: CivicEvent;
  reason?: string;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export function getEvents(): Promise<CivicEvent[]> {
  return getJson<CivicEvent[]>("/api/events");
}

export async function getTimeline(id: string): Promise<TimelineEntry[]> {
  const data = await getJson<{ entries: TimelineEntry[] }>(
    `/api/events/${id}/timeline`
  );
  return data.entries;
}

export async function getConfidence(id: string): Promise<ConfidenceFactor[]> {
  const data = await getJson<{ factors: ConfidenceFactor[] }>(
    `/api/events/${id}/confidence`
  );
  return data.factors;
}

export function getMyArea(): Promise<MyArea> {
  return getJson<MyArea>("/api/my-area");
}

export async function ingest(text: string): Promise<IngestResult> {
  const res = await fetch("/api/ingest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Ingest failed: ${res.status}`);
  return res.json() as Promise<IngestResult>;
}
