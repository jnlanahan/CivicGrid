"use client";

import { Radio } from "lucide-react";
import { FeedCard } from "@/components/FeedCard";
import { useApp } from "@/lib/store";
import type { CivicEvent } from "@/lib/types";

export function FeedRail({
  events,
  totalActive,
  emptyLabel,
}: {
  events: CivicEvent[];
  totalActive: number;
  emptyLabel: string | null;
}) {
  const { selectedEventId, selectEvent } = useApp();

  return (
    <aside className="flex h-full flex-col border-l border-border-warm-2 bg-surface-alt">
      <div className="flex items-center gap-2 border-b border-border-warm-2 px-4 py-3">
        <div>
          <h2 className="font-display text-[16px] font-semibold tracking-display text-ink">
            Event Intelligence
          </h2>
          <p className="font-mono text-[11.5px] text-text-muted-2">
            {totalActive} active · Columbus
          </p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-[8px] border border-border-warm-2 bg-white px-2.5 py-1 text-[12px] text-text-secondary">
          <Radio size={13} className="text-accent" />
          Newest
        </span>
      </div>

      <div className="scroll-thin flex-1 space-y-2.5 overflow-y-auto p-3">
        {events.length === 0 ? (
          <div className="mt-10 px-4 text-center">
            <p className="font-sans text-[14px] font-medium text-ink">{emptyLabel}</p>
            <p className="mt-1 text-[12.5px] text-text-muted">
              Try clearing the filter to see all active events.
            </p>
          </div>
        ) : (
          events.map((e) => (
            <FeedCard
              key={e.id}
              event={e}
              selected={selectedEventId === e.id}
              onClick={() => selectEvent(e.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
