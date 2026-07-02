"use client";

import { getCategory, getStatus } from "@/lib/data";
import { CategoryIcon } from "@/components/CategoryIcon";
import type { CivicEvent } from "@/lib/types";

/**
 * Presentational pin badge — circle + category-colored border + icon + status chip
 * (+ pulse ring when selected). It does NOT position itself; the caller (a Mapbox
 * Marker or the fallback overlay) handles placement.
 */
export function PinBadge({
  event,
  selected,
  dimmed,
  onClick,
}: {
  event: CivicEvent;
  selected: boolean;
  dimmed: boolean;
  onClick: () => void;
}) {
  const cat = getCategory(event.category);
  const status = getStatus(event.status);
  const resolved = event.status === "resolved";

  const color = resolved ? "#7B8794" : cat.color;
  const size = resolved ? 40 : selected ? 52 : 46;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="group flex flex-col items-center transition-opacity duration-200"
      style={{
        opacity: dimmed ? 0.22 : resolved ? 0.7 : 1,
        zIndex: selected ? 20 : 10,
      }}
      aria-label={`${event.title} — ${status.label}`}
    >
      <span className="relative grid place-items-center" style={{ width: size, height: size }}>
        {selected && !dimmed && (
          <span
            className="absolute left-1/2 top-1/2 animate-pulse-ring rounded-full"
            style={{ width: size, height: size, border: `2px solid ${color}` }}
          />
        )}
        <span
          className="grid place-items-center rounded-full bg-white"
          style={{
            width: size,
            height: size,
            border: `3px solid ${color}`,
            boxShadow: selected
              ? "0 8px 18px rgba(232,131,58,.35)"
              : "0 6px 14px rgba(0,0,0,.18)",
          }}
        >
          <CategoryIcon category={event.category} size={size * 0.42} color={color} />
        </span>
      </span>

      <span
        className="label-mono mt-1 rounded-[5px] bg-white px-1.5 py-0.5 text-[9px] font-medium text-text-secondary"
        style={{ boxShadow: "0 2px 5px rgba(0,0,0,.12)" }}
      >
        {status.label}
      </span>
    </button>
  );
}
