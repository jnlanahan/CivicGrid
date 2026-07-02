"use client";

import { useEffect, useState } from "react";
import { AppProvider, useApp } from "@/lib/store";
import { getEvents } from "@/lib/api";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { MapView } from "@/components/MapView";
import { MyAreaView } from "@/components/MyAreaView";
import { ConfidencePanel } from "@/components/ConfidencePanel";
import { TimelinePanel } from "@/components/TimelinePanel";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorBanner } from "@/components/ErrorBanner";

function Shell() {
  const { view, openPanel, setEvents, selectEvent } = useApp();
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);

  // Load the live feed on mount, then poll every 15s.
  useEffect(() => {
    let cancelled = false;

    async function load(initial: boolean) {
      try {
        const next = await getEvents();
        if (cancelled) return;
        setEvents(next);
        setShowError(false);
        if (initial && next.length > 0) selectEvent(next[0].id);
      } catch {
        if (!cancelled) setShowError(true);
      } finally {
        if (initial && !cancelled) setLoading(false);
      }
    }

    load(true);
    const timer = setInterval(() => load(false), 15000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col overflow-hidden rounded-shell bg-app shadow-detail sm:my-4 sm:min-h-[calc(100vh-2rem)]">
      <Header />
      {showError && <ErrorBanner onDismiss={() => setShowError(false)} />}
      {view === "map" && <FilterBar />}

      <main className="flex-1">
        {loading ? (
          <LoadingSkeleton />
        ) : view === "map" ? (
          <MapView />
        ) : (
          <MyAreaView />
        )}
      </main>

      {openPanel === "confidence" && <ConfidencePanel />}
      {openPanel === "timeline" && <TimelinePanel />}
    </div>
  );
}

export function AppRoot() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
