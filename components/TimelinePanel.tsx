"use client";

import { RadioTower, X } from "lucide-react";
import { getEvent, getStatus, timeline } from "@/lib/data";
import { StatusChip } from "@/components/StatusChip";
import { Modal } from "@/components/Modal";
import { useApp } from "@/lib/store";
import type { StatusKey } from "@/lib/types";

const STEPS: StatusKey[] = ["reported", "corroborated", "confirmed", "resolved"];

export function TimelinePanel() {
  const { setPanel, selectedEventId } = useApp();
  const event = getEvent(selectedEventId ?? "evt_456") ?? getEvent("evt_456")!;

  // Highest step the event has reached, derived from the timeline entries.
  const reachedIndex = timeline.entries.reduce((max, e) => {
    const i = STEPS.indexOf(e.status);
    return i > max ? i : max;
  }, 0);

  return (
    <Modal onClose={() => setPanel(null)} width={560}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-[19px] font-semibold tracking-display text-ink">
              {event.title}
            </h2>
            <p className="mt-0.5 text-[12.5px] text-text-muted">
              How this event evolved as signals arrived
            </p>
          </div>
          <button
            onClick={() => setPanel(null)}
            className="rounded-md p-1 text-text-muted hover:bg-surface-alt hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status progress stepper */}
        <div className="mt-5 flex items-start">
          {STEPS.map((step, i) => {
            const s = getStatus(step);
            const done = i <= reachedIndex;
            return (
              <div key={step} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {/* left connector */}
                  <span
                    className="h-0.5 flex-1 rounded-full"
                    style={{
                      backgroundColor: i === 0 ? "transparent" : i <= reachedIndex ? s.color : "#EBE3D6",
                    }}
                  />
                  <span
                    className="grid h-3.5 w-3.5 place-items-center rounded-full"
                    style={
                      done
                        ? { backgroundColor: s.color }
                        : { border: "2px solid #DAD0BF", backgroundColor: "#fff" }
                    }
                  />
                  {/* right connector */}
                  <span
                    className="h-0.5 flex-1 rounded-full"
                    style={{
                      backgroundColor:
                        i === STEPS.length - 1
                          ? "transparent"
                          : i < reachedIndex
                          ? getStatus(STEPS[i + 1]).color
                          : "#EBE3D6",
                    }}
                  />
                </div>
                <span
                  className="mt-1.5 text-[11.5px] font-medium"
                  style={{ color: done ? s.color : "#A89E8D" }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Update list */}
        <div className="mt-6">
          {timeline.entries.map((entry, i) => {
            const s = getStatus(entry.status);
            const last = i === timeline.entries.length - 1;
            return (
              <div key={i} className="flex gap-3">
                {/* dot + connector */}
                <div className="flex flex-col items-center">
                  <span
                    className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-white"
                    style={{ backgroundColor: s.color, boxShadow: `0 0 0 1px ${s.color}` }}
                  />
                  {!last && <span className="w-0.5 flex-1 bg-border-warm" />}
                </div>
                <div className={`min-w-0 flex-1 ${last ? "" : "pb-5"}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] text-text-muted">{entry.time}</span>
                    <StatusChip status={entry.status} />
                    <span className="ml-auto font-mono text-[11.5px] text-text-muted-2">
                      {entry.sources}
                    </span>
                  </div>
                  <h4 className="mt-1.5 font-sans text-[14px] font-semibold text-ink">
                    {entry.head}
                  </h4>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-text-muted">{entry.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-2 flex items-center gap-2 rounded-[12px] border border-dashed border-border-warm-2 bg-warm-panel px-3.5 py-3">
          <RadioTower size={15} className="shrink-0 text-text-muted" />
          <span className="text-[12.5px] text-text-muted">
            Monitoring for further signals — status updates automatically.
          </span>
        </div>
      </div>
    </Modal>
  );
}
