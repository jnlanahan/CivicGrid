"use client";

import {
  Flame,
  Layers,
  Share2,
  Shield,
  SquarePlus,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";
import { events, filters, getCategory, matchesFilter } from "@/lib/data";
import { useApp } from "@/lib/store";
import type { CategoryKey, FilterKey } from "@/lib/types";

const FILTER_ICON: Record<FilterKey, LucideIcon> = {
  all: Layers,
  major: Share2,
  police: Shield,
  fire: Flame,
  ems: SquarePlus,
  hazard: TriangleAlert,
};

const CATEGORY_FILTERS: FilterKey[] = ["police", "fire", "ems", "hazard"];

function filterColor(key: FilterKey): string | null {
  if (CATEGORY_FILTERS.includes(key)) return getCategory(key as CategoryKey).color;
  return null;
}

export function FilterBar() {
  const { activeFilter, setFilter } = useApp();

  const matchCount = events.filter((e) => matchesFilter(e, activeFilter)).length;
  const activeLabel = filters.find((f) => f.key === activeFilter)?.label ?? "";
  const countColor = filterColor(activeFilter);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border-warm-2 bg-surface px-5 py-2.5">
      <span className="label-mono text-[11px] text-text-muted-2">Filters</span>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => {
          const Icon = FILTER_ICON[f.key];
          const selected = activeFilter === f.key;
          const color = filterColor(f.key);
          const solidBg = color ?? "#2A2419";

          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 rounded-[9px] border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                selected
                  ? "border-transparent text-white"
                  : "border-border-warm-2 bg-white text-text-secondary hover:bg-surface-alt"
              }`}
              style={
                selected
                  ? {
                      backgroundColor: solidBg,
                      boxShadow: color ? `0 4px 12px ${color}40` : undefined,
                    }
                  : undefined
              }
            >
              <Icon
                size={14}
                strokeWidth={2.2}
                style={{ color: selected ? "#fff" : color ?? "#8A8070" }}
              />
              {f.label}
              {selected && f.key !== "all" && (
                <X
                  size={13}
                  className="ml-0.5 opacity-80 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilter("all");
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-4">
        {activeFilter !== "all" && (
          <span
            className="font-mono text-[12px] font-medium"
            style={{ color: countColor ?? "#2A2419" }}
          >
            {matchCount} {activeLabel.toLowerCase()} event{matchCount === 1 ? "" : "s"}
          </span>
        )}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-live-glow rounded-full bg-live-green" />
          </span>
          <span className="font-mono text-[11.5px] font-medium text-ink">LIVE</span>
          <span className="font-mono text-[11.5px] text-text-muted-2">· updated 12s ago</span>
        </div>
      </div>
    </div>
  );
}
