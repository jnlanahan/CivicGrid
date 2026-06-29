"use client";

import { Minus, Plus } from "lucide-react";
import { events, filters, getEvent, matchesFilter } from "@/lib/data";
import { useApp } from "@/lib/store";
import { MapCanvas } from "@/components/map/MapCanvas";
import { Pin } from "@/components/map/Pin";
import { EventDetailCard } from "@/components/EventDetailCard";
import { FeedRail } from "@/components/FeedRail";
import { FilterToast } from "@/components/Toast";

export function MapView() {
  const { activeFilter, setFilter, selectedEventId, selectEvent } = useApp();

  const matching = events.filter((e) => matchesFilter(e, activeFilter));
  const hiddenCount = events.length - matching.length;
  const activeLabel = filters.find((f) => f.key === activeFilter)?.label ?? "";

  const selectedEvent = selectedEventId ? getEvent(selectedEventId) : undefined;
  const selectedMatches =
    selectedEvent && matchesFilter(selectedEvent, activeFilter);

  return (
    <div className="grid h-[660px] grid-cols-1 lg:grid-cols-[1fr_350px]">
      {/* Map area */}
      <div className="relative overflow-hidden">
        <MapCanvas />

        {/* Pins */}
        {events.map((e) => (
          <Pin
            key={e.id}
            event={e}
            selected={selectedEventId === e.id}
            dimmed={!matchesFilter(e, activeFilter)}
            onClick={() => selectEvent(e.id)}
          />
        ))}

        {/* Zoom controls */}
        <div className="absolute right-4 top-4 z-20 flex flex-col overflow-hidden rounded-[10px] border border-border-warm-2 bg-white shadow-card-subtle">
          <button className="grid h-9 w-9 place-items-center text-ink hover:bg-surface-alt" aria-label="Zoom in">
            <Plus size={17} />
          </button>
          <span className="h-px w-full bg-border-warm-2" />
          <button className="grid h-9 w-9 place-items-center text-ink hover:bg-surface-alt" aria-label="Zoom out">
            <Minus size={17} />
          </button>
        </div>

        {/* Filter toast */}
        {activeFilter !== "all" && (
          <FilterToast
            label={activeLabel}
            hiddenCount={hiddenCount}
            onClear={() => setFilter("all")}
          />
        )}

        {/* Floating detail card */}
        {selectedEvent && selectedMatches && (
          <EventDetailCard event={selectedEvent} />
        )}

        {/* Attribution */}
        <span className="absolute bottom-2 right-3 z-10 font-mono text-[10px] text-text-faint-2">
          © Mapbox · OpenStreetMap
        </span>
      </div>

      {/* Feed rail */}
      <FeedRail
        events={matching}
        totalActive={matching.length}
        emptyLabel={`No active ${activeLabel.toLowerCase()} events`}
      />
    </div>
  );
}
