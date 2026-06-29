"use client";

import { Clock, Info, MapPin, X } from "lucide-react";
import { getCategory } from "@/lib/data";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ConfidenceGauge } from "@/components/ConfidenceGauge";
import { Sparkline } from "@/components/Sparkline";
import { StatusChip } from "@/components/StatusChip";
import { useApp } from "@/lib/store";
import type { CivicEvent } from "@/lib/types";

function formatAgo(detected: string): string {
  const n = detected.replace(/[^0-9]/g, "");
  return n ? `${n} min ago` : detected;
}

const TREND_LABEL: Record<CivicEvent["signal_trend"], { text: string; cls: string }> = {
  rising: { text: "↑ rising", cls: "text-live-green" },
  steady: { text: "→ steady", cls: "text-text-muted" },
  falling: { text: "↓ falling", cls: "text-[#9A5A4C]" },
};

export function EventDetailCard({ event }: { event: CivicEvent }) {
  const { selectEvent, setPanel } = useApp();
  const cat = getCategory(event.category);
  const trend = TREND_LABEL[event.signal_trend];

  return (
    <div className="absolute bottom-4 left-4 z-30 w-[392px] max-w-[calc(100%-2rem)] animate-panel-in overflow-hidden rounded-panel bg-white shadow-detail">
      {/* Accent strip */}
      <div className="h-[5px]" style={{ backgroundColor: cat.color }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-tile"
            style={{ backgroundColor: cat.tint }}
          >
            <CategoryIcon category={event.category} size={22} color={cat.color} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[20px] font-semibold leading-tight tracking-display text-ink">
              {event.title}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-[13px] text-text-secondary">
              <MapPin size={13} className="shrink-0 text-text-muted" />
              {event.location_label}
            </p>
          </div>
          <button
            onClick={() => selectEvent(null)}
            className="shrink-0 rounded-md p-1 text-text-muted hover:bg-surface-alt hover:text-ink"
            aria-label="Close event detail"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status row */}
        <div className="mt-3 flex items-center gap-2.5">
          <StatusChip status={event.status} />
          <span className="font-mono text-[12px] text-text-muted">
            {event.source_count} source{event.source_count === 1 ? "" : "s"} · {formatAgo(event.detected_ago)}
          </span>
        </div>

        {/* Confidence block */}
        <div className="mt-3 flex items-center gap-4 rounded-[12px] border border-border-warm-4 bg-warm-panel p-3.5">
          <div className="shrink-0">
            <ConfidenceGauge value={event.confidence} color={cat.color} size={88} />
          </div>
          <p className="text-[12.5px] leading-snug text-text-secondary">
            Scanner signals suggest a possible {cat.label.split(" / ")[0].toLowerCase()} event. This is an{" "}
            <strong className="font-semibold text-ink">unverified estimate.</strong>
          </p>
        </div>

        {/* Signal sparkline row */}
        <div className="mt-3 flex items-center gap-2.5">
          <span className="label-mono text-[10.5px] text-text-muted-2">Signal</span>
          <Sparkline trend={event.signal_trend} color={cat.color} width={120} height={18} />
          <span className={`text-[12px] font-medium ${trend.cls}`}>{trend.text}</span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2.5">
          <button
            onClick={() => setPanel("timeline")}
            className="flex flex-1 items-center justify-center gap-2 rounded-btn bg-ink py-2.5 text-[13.5px] font-medium text-white hover:bg-ink/90"
          >
            <Clock size={15} strokeWidth={2.2} />
            Show timeline
          </button>
          <button
            onClick={() => setPanel("confidence")}
            className="flex flex-1 items-center justify-center gap-2 rounded-btn border border-border-warm-2 bg-white py-2.5 text-[13.5px] font-medium text-ink hover:bg-surface-alt"
          >
            <Info size={15} strokeWidth={2.2} className="text-accent" />
            Confidence explained
          </button>
        </div>
      </div>
    </div>
  );
}
