import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { events } from "@/db/schema";
import { serializeEvent } from "@/lib/server/mappers";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  const rows = await db.select().from(events).orderBy(desc(events.lastUpdateAt));
  return NextResponse.json(rows.map((r) => serializeEvent(r, now)));
}
