"use client";

import { Activity, Bell, ChevronRight, Clock, Home } from "lucide-react";
import { getCategory, myArea } from "@/lib/data";
import { CategoryIcon } from "@/components/CategoryIcon";
import { StatusChip } from "@/components/StatusChip";
import { useApp } from "@/lib/store";

const TONE_COLOR: Record<string, string> = {
  hazard: "#E0A526",
  ems: "#3E7CB1",
  accent: "#E8833A",
};

export function MyAreaView() {
  const { setView, selectEvent } = useApp();

  return (
    <div className="mx-auto max-w-5xl px-5 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Home size={26} strokeWidth={2.2} className="text-[#3F8F5B]" />
        <div className="flex-1">
          <h1 className="font-display text-[22px] font-bold tracking-display text-ink">
            {myArea.name}
          </h1>
          <p className="text-[13px] text-text-muted">
            Your watched area · {myArea.radius_mi} mi radius
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-btn border border-border-warm-2 bg-white px-3.5 py-2 text-[13px] font-medium text-ink hover:bg-surface-alt">
          <Bell size={15} strokeWidth={2.2} className="text-accent" />
          Alerts {myArea.alerts_on ? "on" : "off"}
        </button>
      </div>

      {/* Stat row */}
      <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {myArea.stats.map((stat) => {
          const color = TONE_COLOR[stat.tone] ?? "#8A8070";
          return (
            <div
              key={stat.label}
              className="rounded-card border border-border-warm-3 bg-white p-4"
            >
              <div className="flex items-center gap-2">
                {stat.tone === "ems" ? (
                  <Activity size={14} style={{ color }} />
                ) : stat.tone === "accent" ? (
                  <Clock size={14} style={{ color }} />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                )}
                <span className="text-[12.5px] text-text-muted">{stat.label}</span>
              </div>
              <p className="mt-2 font-display text-[24px] font-semibold tracking-display text-ink">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[12.5px] text-text-muted">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Nearby right now */}
      <div className="mt-7 flex items-center justify-between">
        <h2 className="label-mono text-[11px] text-text-muted-2">Nearby right now</h2>
        <button
          onClick={() => setView("map")}
          className="flex items-center gap-0.5 text-[13px] font-medium text-accent hover:underline"
        >
          View on map <ChevronRight size={15} />
        </button>
      </div>

      <div className="mt-3 space-y-2.5">
        {myArea.nearby.map((n) => {
          const cat = getCategory(n.category);
          const resolved = n.status === "resolved";
          return (
            <button
              key={n.id}
              onClick={() => {
                selectEvent(n.id);
                setView("map");
              }}
              className="flex w-full items-center gap-3 rounded-card border border-border-warm-3 bg-white p-3.5 text-left hover:shadow-card-subtle"
              style={{ opacity: resolved ? 0.72 : 1 }}
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-tile"
                style={{ backgroundColor: cat.tint }}
              >
                <CategoryIcon category={n.category} size={19} color={cat.color} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-sans text-[14.5px] font-semibold text-ink">
                  {n.title}
                </h3>
                <p className="truncate text-[12.5px] text-text-muted">
                  {n.location_label} · {n.distance_mi} mi away
                </p>
              </div>
              <StatusChip status={n.status} />
              <span className="ml-1 w-10 text-right font-mono text-[14px] font-semibold text-ink">
                {Math.round(n.confidence * 100)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
