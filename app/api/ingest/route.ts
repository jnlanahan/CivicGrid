import { NextResponse } from "next/server";
import { z } from "zod";
import { ingestTranscript } from "@/lib/server/pipeline";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
  text: z.string().min(1).max(4000),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "text is required (1-4000 chars)" }, { status: 400 });
  }

  try {
    const result = await ingestTranscript(parsed.data.text);
    return NextResponse.json(result);
  } catch (err) {
    console.error("ingest failed:", err);
    return NextResponse.json({ error: "Ingest failed" }, { status: 500 });
  }
}
