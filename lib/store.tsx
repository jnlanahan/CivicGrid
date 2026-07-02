"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CivicEvent, FilterKey } from "./types";
import { getEvents } from "./api";

export type ViewKey = "map" | "my-area";
export type PanelKey = null | "timeline" | "confidence";

interface AppContextValue {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  activeFilter: FilterKey;
  setFilter: (f: FilterKey) => void;
  selectedEventId: string | null;
  selectEvent: (id: string | null) => void;
  openPanel: PanelKey;
  setPanel: (p: PanelKey) => void;
  events: CivicEvent[];
  setEvents: (events: CivicEvent[]) => void;
  getEventById: (id: string | null) => CivicEvent | undefined;
  refresh: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewKey>("map");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [openPanel, setOpenPanel] = useState<PanelKey>(null);
  const [events, setEvents] = useState<CivicEvent[]>([]);

  const refresh = useCallback(async () => {
    const next = await getEvents();
    setEvents(next);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      view,
      setView,
      activeFilter,
      setFilter: setActiveFilter,
      selectedEventId,
      selectEvent: setSelectedEventId,
      openPanel,
      setPanel: setOpenPanel,
      events,
      setEvents,
      getEventById: (id) => (id ? events.find((e) => e.id === id) : undefined),
      refresh,
    }),
    [view, activeFilter, selectedEventId, openPanel, events, refresh]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
