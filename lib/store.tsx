"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { FilterKey } from "./types";

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
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewKey>("map");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>("evt_456");
  const [openPanel, setOpenPanel] = useState<PanelKey>(null);

  const value = useMemo<AppContextValue>(
    () => ({
      view,
      setView,
      activeFilter,
      setFilter: setActiveFilter,
      selectedEventId,
      selectEvent: (id) => {
        setSelectedEventId(id);
      },
      openPanel,
      setPanel: setOpenPanel,
    }),
    [view, activeFilter, selectedEventId, openPanel]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
