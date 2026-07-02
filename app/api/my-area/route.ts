import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { events } from "@/db/schema";
import { serializeMyArea } from "@/lib/server/mappers";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  const rows = await db.select().from(events);
  return NextResponse.json(serializeMyArea(rows, now));
}
