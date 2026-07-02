import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { events } from "@/db/schema";
import { serializeConfidence } from "@/lib/server/mappers";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [row] = await db.select().from(events).where(eq(events.id, id));
  if (!row) {
    return NextResponse.json({ factors: [] });
  }
  return NextResponse.json({ factors: serializeConfidence(row) });
}
