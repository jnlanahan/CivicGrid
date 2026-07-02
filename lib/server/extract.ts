import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { CategoryKey, StatusKey } from "@/lib/types";

const CATEGORIES: CategoryKey[] = [
  "vehicle_accident", "fire", "ems", "police", "hazard", "civic",
];
const STATUSES: StatusKey[] = [
  "reported", "corroborated", "confirmed", "resolved", "unsubstantiated",
];

// Zod schema — validates Claude's structured output after parsing.
export const ExtractedEventSchema = z.object({
  is_incident: z.boolean(),
  title: z.string(),
  event_type: z.string(),
  category: z.enum(CATEGORIES as [CategoryKey, ...CategoryKey[]]),
  status: z.enum(STATUSES as [StatusKey, ...StatusKey[]]),
  location_text: z.string(),
  neighborhood: z.string(),
  confidence: z.number(),
  confidence_factors: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
      pct: z.number(),
      note: z.string(),
    })
  ),
  is_major: z.boolean(),
  signal_trend: z.enum(["rising", "steady", "falling"]),
  summary_head: z.string(),
  summary_body: z.string(),
});

export type ExtractedEvent = z.infer<typeof ExtractedEventSchema>;

// JSON Schema sent to the API (structured-outputs supported subset — no min/max).
const JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    is_incident: { type: "boolean" },
    title: { type: "string" },
    event_type: { type: "string" },
    category: { type: "string", enum: CATEGORIES },
    status: { type: "string", enum: STATUSES },
    location_text: { type: "string" },
    neighborhood: { type: "string" },
    confidence: { type: "number" },
    confidence_factors: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          value: { type: "string" },
          pct: { type: "number" },
          note: { type: "string" },
        },
        required: ["name", "value", "pct", "note"],
      },
    },
    is_major: { type: "boolean" },
    signal_trend: { type: "string", enum: ["rising", "steady", "falling"] },
    summary_head: { type: "string" },
    summary_body: { type: "string" },
  },
  required: [
    "is_incident", "title", "event_type", "category", "status",
    "location_text", "neighborhood", "confidence", "confidence_factors",
    "is_major", "signal_trend", "summary_head", "summary_body",
  ],
} as const;

const SYSTEM_PROMPT = `You convert ONE raw emergency-radio snippet into ONE structured civic event for a public, real-time situational-awareness map of Columbus, Ohio.

PRIVACY — HARD RULES (never violate):
- NEVER output personal names, license plates, phone numbers, medical details, patient/victim information, or verbatim transcript text.
- Locations are APPROXIMATE — the nearest intersection, landmark, highway, or exit. Never an exact residential address of an individual.

LANGUAGE — tentative, never certain:
- Titles start with "Possible…" (e.g. "Possible Vehicle Collision").
- Bodies use "reported", "unverified estimate", "appears to". Never assert something as confirmed fact.
- A single, uncorroborated signal is "reported" or "unsubstantiated" — NEVER "confirmed".

FIELDS:
- is_incident: false if the text is not a real incident (radio checks, chatter, tests). If false, still fill the other fields with best-effort placeholders.
- category: one of vehicle_accident, fire, ems, police, hazard, civic.
- location_text: a concise phrase suitable for geocoding, e.g. "I-71 North near 17th Ave" (do NOT append the city — that is added downstream).
- neighborhood: a Columbus neighborhood if inferable, else "".
- confidence: 0..1, an explicit UNVERIFIED estimate.
- confidence_factors: 3–5 transparent factors, each { name, value (short), pct 0-100, note (one sentence) } — cover independent sources, signal clarity, corroboration, location specificity, recency.
- is_major: true for structure fires, multi-vehicle collisions, shootings, or anything warranting a "major incidents" filter.
- signal_trend: rising | steady | falling.
- summary_head: a short headline for the first timeline entry.
- summary_body: one tentative sentence describing what the signal indicates.`;

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

/** Blank digit-runs that look like phone numbers or plates (defense-in-depth). */
function sanitize(text: string): string {
  return text
    .replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, "[redacted]")
    .replace(/\b[A-Z]{2,3}[-\s]?\d{3,4}\b/g, "[redacted]");
}

export async function extractEvent(text: string): Promise<ExtractedEvent | null> {
  const model = process.env.EXTRACTION_MODEL ?? "claude-sonnet-4-6";
  const response = await getClient().messages.create({
    model,
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    output_config: { format: { type: "json_schema", schema: JSON_SCHEMA } },
    messages: [{ role: "user", content: text }],
  } as Anthropic.MessageCreateParamsNonStreaming);

  if (response.stop_reason === "refusal") return null;

  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text"
  );
  if (!textBlock) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    return null;
  }

  const result = ExtractedEventSchema.safeParse(parsed);
  if (!result.success) return null;

  const e = result.data;
  return {
    ...e,
    title: sanitize(e.title),
    summary_head: sanitize(e.summary_head),
    summary_body: sanitize(e.summary_body),
    location_text: sanitize(e.location_text),
    confidence: Math.min(1, Math.max(0, e.confidence)),
  };
}
