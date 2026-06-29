"use client";

import { getCategory } from "@/lib/data";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ConfidenceGauge } from "@/components/ConfidenceGauge";
import { Sparkline } from "@/components/Sparkline";
import { StatusChip } from "@/components/StatusChip";
import type { CivicEvent } from "@/lib/types";

export function FeedCard({
  event,
  selected,
  onClick,
}: {
  event: CivicEvent;
  selected: boolean;
  onClick: () => void;
}) {
  const cat = getCategory(event.category);
  const resolved = event.status === "resolved";

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-card border bg-white p-3 text-left transition-shadow ${
        selected
          ? "border-accent shadow-card-subtle ring-1 ring-accent/40"
          : "border-border-warm-3 hover:shadow-card-subtle"
      }`}
      style={{ opacity: resolved ? 0.85 : 1 }}
    >
      <div className="flex items-start gap-2.5">
        <span
          className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-tile"
          style={{ backgroundColor: cat.tint }}
        >
          <CategoryIcon category={event.category} size={18} color={cat.color} />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-sans text-[14.5px] font-semibold leading-tight text-ink">
            {event.title}
          </h3>
          <p className="mt-0.5 truncate text-[12px] text-text-muted">
            {event.location_label}
          </p>
        </div>

        <div className="shrink-0">
          <ConfidenceGauge
            value={event.confidence}
            color={cat.color}
            size={52}
            showLabel={false}
          />
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <StatusChip status={event.status} />
        <Sparkline trend={event.signal_trend} color={cat.color} width={56} height={16} opacity={0.6} />
        <span className="ml-auto font-mono text-[11.5px] text-text-muted-2">
          {event.detected_ago}
        </span>
      </div>
    </button>
  );
}
