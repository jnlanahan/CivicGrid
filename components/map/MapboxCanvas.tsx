"use client";

import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import { matchesFilter } from "@/lib/data";
import type { CivicEvent, FilterKey } from "@/lib/types";
import { PinBadge } from "@/components/map/Pin";
import { MapCanvas } from "@/components/map/MapCanvas";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const COLUMBUS = { longitude: -82.9988, latitude: 39.9612, zoom: 11.5 };

// Bounding box for projecting lat/lng → x/y% in the no-token fallback.
const BBOX = { minLng: -83.25, maxLng: -82.75, minLat: 39.8, maxLat: 40.2 };

export function MapboxCanvas({
  events,
  selectedEventId,
  activeFilter,
  onSelect,
}: {
  events: CivicEvent[];
  selectedEventId: string | null;
  activeFilter: FilterKey;
  onSelect: (id: string) => void;
}) {
  // Fallback: no Mapbox token → keep the warm styled SVG map with projected pins.
  if (!TOKEN) {
    return (
      <div className="absolute inset-0">
        <MapCanvas />
        {events.map((e) => {
          const x = ((e.coord.lng - BBOX.minLng) / (BBOX.maxLng - BBOX.minLng)) * 100;
          const y = ((BBOX.maxLat - e.coord.lat) / (BBOX.maxLat - BBOX.minLat)) * 100;
          return (
            <div
              key={e.id}
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-100%)" }}
            >
              <PinBadge
                event={e}
                selected={selectedEventId === e.id}
                dimmed={!matchesFilter(e, activeFilter)}
                onClick={() => onSelect(e.id)}
              />
            </div>
          );
        })}
        <span className="absolute bottom-2 left-3 z-10 rounded bg-white/80 px-2 py-0.5 font-mono text-[10px] text-text-muted">
          Set NEXT_PUBLIC_MAPBOX_TOKEN for the live map
        </span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Map
        mapboxAccessToken={TOKEN}
        initialViewState={COLUMBUS}
        mapStyle="mapbox://styles/mapbox/light-v11"
        style={{ width: "100%", height: "100%" }}
        attributionControl={true}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {events.map((e) => (
          <Marker
            key={e.id}
            longitude={e.coord.lng}
            latitude={e.coord.lat}
            anchor="bottom"
          >
            <PinBadge
              event={e}
              selected={selectedEventId === e.id}
              dimmed={!matchesFilter(e, activeFilter)}
              onClick={() => onSelect(e.id)}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
}
