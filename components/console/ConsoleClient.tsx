"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, RadioTower, Send } from "lucide-react";
import { ingest, type IngestResult } from "@/lib/api";
import { SAMPLE_TRANSCRIPTS } from "@/db/sample-transcripts";
import { getCategory } from "@/lib/data";
import { CategoryIcon } from "@/components/CategoryIcon";
import { StatusChip } from "@/components/StatusChip";
import { ConfidenceGauge } from "@/components/ConfidenceGauge";

const STATUS_COPY: Record<IngestResult["status"], { label: string; cls: string }> = {
  created: { label: "Created new event", cls: "text-[#3F8F5B] bg-[#DDEEE3]" },
  corroborated: { label: "Corroborated existing event", cls: "text-[#356C9B] bg-[#DEEAF3]" },
  skipped: { label: "Skipped — no incident signal", cls: "text-[#6B7682] bg-[#E7EAED]" },
  not_incident: { label: "Not an incident", cls: "text-[#9A5A4C] bg-[#F0E3DF]" },
};

export function ConsoleClient() {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<IngestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!text.trim() || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await ingest(text.trim()));
    } catch {
      setError("Something went wrong. Check the server logs and your API key.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <div className="mb-6 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-tile bg-accent-tint">
          <RadioTower size={18} className="text-accent" />
        </span>
        <div className="flex-1">
          <h1 className="font-display text-[22px] font-bold tracking-display text-ink">
            Signal Console
          </h1>
          <p className="text-[13px] text-text-muted">
            Internal tool — paste an emergency-radio snippet to run the extraction pipeline.
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-btn border border-border-warm-2 bg-white px-3 py-2 text-[13px] font-medium text-ink hover:bg-surface-alt"
        >
          <ArrowLeft size={15} />
          Map
        </Link>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="e.g. Engine 17 responding to a reported collision on I-71 north near 17th Ave…"
        className="w-full resize-y rounded-card border border-border-warm-2 bg-white p-3.5 text-[14px] text-ink placeholder:text-text-faint focus:border-accent focus:outline-none"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="label-mono mr-1 text-[11px] text-text-muted-2">Samples</span>
        {SAMPLE_TRANSCRIPTS.map((s) => (
          <button
            key={s.label}
            onClick={() => setText(s.text)}
            className="rounded-chip border border-border-warm-2 bg-white px-2.5 py-1 text-[12px] text-text-secondary hover:bg-surface-alt"
          >
            {s.label}
          </button>
        ))}
      </div>

      <button
        onClick={submit}
        disabled={busy || !text.trim()}
        className="mt-4 flex items-center gap-2 rounded-btn bg-ink px-4 py-2.5 text-[14px] font-medium text-white hover:bg-ink/90 disabled:opacity-50"
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {busy ? "Processing…" : "Submit signal"}
      </button>

      {error && (
        <p className="mt-4 rounded-card border border-[#E9D6B8] bg-[#FBF1DD] p-3 text-[13px] text-[#8A6A1E]">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6">
          <span
            className={`inline-block rounded-chip px-2.5 py-1 text-[12.5px] font-semibold ${STATUS_COPY[result.status].cls}`}
          >
            {STATUS_COPY[result.status].label}
          </span>

          {result.event && (
            <div className="mt-3 rounded-card border border-border-warm-3 bg-white p-3.5">
              <div className="flex items-start gap-3">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-tile"
                  style={{ backgroundColor: getCategory(result.event.category).tint }}
                >
                  <CategoryIcon
                    category={result.event.category}
                    size={20}
                    color={getCategory(result.event.category).color}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-sans text-[15px] font-semibold text-ink">
                    {result.event.title}
                  </h3>
                  <p className="mt-0.5 text-[12.5px] text-text-muted">
                    {result.event.location_label} · {result.event.neighborhood}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusChip status={result.event.status} />
                    <span className="font-mono text-[11.5px] text-text-muted-2">
                      {result.event.source_count} source
                      {result.event.source_count === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
                <ConfidenceGauge
                  value={result.event.confidence}
                  color={getCategory(result.event.category).color}
                  size={56}
                  showLabel={false}
                />
              </div>
              <Link
                href="/"
                className="mt-3 inline-block text-[13px] font-medium text-accent hover:underline"
              >
                View on map ›
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
