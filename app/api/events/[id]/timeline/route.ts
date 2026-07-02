import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { eventUpdates } from "@/db/schema";
import { serializeTimeline } from "@/lib/server/mappers";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(eventUpdates)
    .where(eq(eventUpdates.eventId, id))
    .orderBy(desc(eventUpdates.createdAt));
  return NextResponse.json({ entries: serializeTimeline(rows) });
}
