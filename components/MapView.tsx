"use client";

import { filters, matchesFilter } from "@/lib/data";
import { useApp } from "@/lib/store";
import { MapboxCanvas } from "@/components/map/MapboxCanvas";
import { EventDetailCard } from "@/components/EventDetailCard";
import { FeedRail } from "@/components/FeedRail";
import { FilterToast } from "@/components/Toast";

export function MapView() {
  const { activeFilter, setFilter, selectedEventId, selectEvent, events, getEventById } =
    useApp();

  const matching = events.filter((e) => matchesFilter(e, activeFilter));
  const hiddenCount = events.length - matching.length;
  const activeLabel = filters.find((f) => f.key === activeFilter)?.label ?? "";

  const selectedEvent = getEventById(selectedEventId);
  const selectedMatches = selectedEvent && matchesFilter(selectedEvent, activeFilter);

  return (
    <div className="grid h-[660px] grid-cols-1 lg:grid-cols-[1fr_350px]">
      {/* Map area */}
      <div className="relative overflow-hidden">
        <MapboxCanvas
          events={events}
          selectedEventId={selectedEventId}
          activeFilter={activeFilter}
          onSelect={selectEvent}
        />

        {/* Filter toast */}
        {activeFilter !== "all" && (
          <FilterToast
            label={activeLabel}
            hiddenCount={hiddenCount}
            onClear={() => setFilter("all")}
          />
        )}

        {/* Floating detail card */}
        {selectedEvent && selectedMatches && <EventDetailCard event={selectedEvent} />}
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
