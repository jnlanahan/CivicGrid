import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type {
  CategoryKey,
  ConfidenceFactor,
  SignalTrend,
  StatusKey,
} from "@/lib/types";

/**
 * Events. The display-derived `detected_ago` is NOT stored — it is computed at
 * read time from `first_seen_at`. Coordinates come from geocoding.
 */
export const events = sqliteTable(
  "events",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    eventType: text("event_type").notNull(),
    category: text("category").$type<CategoryKey>().notNull(),
    status: text("status").$type<StatusKey>().notNull(),
    confidence: real("confidence").notNull(),
    sourceCount: integer("source_count").notNull().default(1),
    locationLabel: text("location_label").notNull(),
    neighborhood: text("neighborhood").notNull().default(""),
    lat: real("lat").notNull(),
    lng: real("lng").notNull(),
    signalTrend: text("signal_trend").$type<SignalTrend>().notNull().default("steady"),
    isMajor: integer("is_major", { mode: "boolean" }).notNull().default(false),
    firstSeenAt: integer("first_seen_at", { mode: "timestamp_ms" }).notNull(),
    lastUpdateAt: integer("last_update_at", { mode: "timestamp_ms" }).notNull(),
    confidenceFactors: text("confidence_factors", { mode: "json" })
      .$type<ConfidenceFactor[]>()
      .notNull()
      .default(sql`'[]'`),
  },
  (t) => ({
    dedupIdx: index("events_category_last_update_idx").on(t.category, t.lastUpdateAt),
  })
);

/** One row per signal / corroboration — maps to the UI's TimelineEntry. */
export const eventUpdates = sqliteTable(
  "event_updates",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    status: text("status").$type<StatusKey>().notNull(),
    head: text("head").notNull(),
    body: text("body").notNull(),
    sourceCountAtUpdate: integer("source_count_at_update").notNull(),
  },
  (t) => ({
    byEventIdx: index("event_updates_event_created_idx").on(t.eventId, t.createdAt),
  })
);

export type EventRow = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
export type EventUpdateRow = typeof eventUpdates.$inferSelect;
export type InsertEventUpdate = typeof eventUpdates.$inferInsert;
