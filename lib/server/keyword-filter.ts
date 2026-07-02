import "server-only";

// Cheap pre-LLM gate: skip the Claude call when a snippet clearly isn't an incident.
// Kept intentionally broad — false positives cost one LLM call; false negatives lose events.
export const INCIDENT_KEYWORDS = [
  "accident", "collision", "crash", "mva", "rollover", "vehicle",
  "fire", "smoke", "flames", "structure",
  "ems", "medic", "medical", "injuries", "injured", "unconscious", "cardiac",
  "shots", "shooting", "weapon", "robbery", "burglary", "assault", "disturbance", "suspect", "officer",
  "hazard", "debris", "spill", "wires down", "gas leak", "flooding", "closed",
  "respond", "responding", "engine", "medic", "en route",
  "lane", "blocked", "highway", "interstate", "overpass", "exit",
];

const ROUTE_PATTERN = /\bi[- ]?\d{1,3}\b|\brt\.?\s?\d+|\bsr[- ]?\d+|\bus[- ]?\d+/i;
const CROSS_STREET_PATTERN = /\b(and|&|at|near)\b.*\b(st|ave|rd|blvd|dr|street|avenue|road)\b/i;

export function looksLikeIncident(text: string): boolean {
  const t = text.toLowerCase().trim();
  if (t.length < 12) return false;
  if (INCIDENT_KEYWORDS.some((k) => t.includes(k))) return true;
  if (ROUTE_PATTERN.test(text)) return true;
  if (CROSS_STREET_PATTERN.test(text)) return true;
  return false;
}
