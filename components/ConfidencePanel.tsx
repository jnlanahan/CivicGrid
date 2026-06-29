"use client";

import { Info, Sparkles, X } from "lucide-react";
import { confidenceFactors, getEvent, statusModel } from "@/lib/data";
import { StatusChip } from "@/components/StatusChip";
import { Modal } from "@/components/Modal";
import { useApp } from "@/lib/store";

export function ConfidencePanel() {
  const { setPanel, selectedEventId } = useApp();
  const event = getEvent(selectedEventId ?? "evt_456") ?? getEvent("evt_456")!;
  const pct = Math.round(event.confidence * 100);

  return (
    <Modal onClose={() => setPanel(null)} width={560}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-tile bg-[#E2ECF4]">
            <Sparkles size={21} className="text-[#3E7CB1]" />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-[21px] font-semibold tracking-display text-ink">
              How we calculate confidence
            </h2>
            <p className="mt-0.5 font-mono text-[12px] text-text-muted">
              {event.id} · {event.title}
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

        {/* Principle banner */}
        <div className="mt-4 flex items-start gap-2.5 rounded-[12px] border border-border-warm-4 bg-warm-panel p-3.5">
          <Info size={16} className="mt-0.5 shrink-0 text-accent" />
          <p className="text-[12.5px] leading-snug text-text-secondary">
            CivicGrid{" "}
            <strong className="font-semibold text-ink">
              never presents uncertain information as fact.
            </strong>{" "}
            Confidence is a transparent estimate built from the signals below — not a verdict.{" "}
            <strong className="font-semibold text-ink">{pct}% is an unverified estimate.</strong>
          </p>
        </div>

        {/* Factors */}
        <h3 className="label-mono mt-5 text-[11px] text-text-muted-2">
          What goes into the score
        </h3>
        <div className="mt-3 space-y-3.5">
          {confidenceFactors.factors.map((f) => (
            <div key={f.name}>
              <div className="flex items-baseline justify-between">
                <span className="font-sans text-[13.5px] font-semibold text-ink">{f.name}</span>
                <span className="font-mono text-[12px] text-text-muted">{f.value}</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#F0EADF]">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${f.pct}%` }}
                />
              </div>
              <p className="mt-1 text-[11.5px] text-text-muted">{f.note}</p>
            </div>
          ))}
        </div>

        {/* Status legend */}
        <h3 className="label-mono mt-6 text-[11px] text-text-muted-2">
          What the status means
        </h3>
        <div className="mt-3 space-y-2.5">
          {statusModel.map((s) => (
            <div key={s.key} className="flex items-center gap-3">
              <StatusChip status={s.key} fixedWidth />
              <span className="text-[12.5px] text-text-secondary">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
