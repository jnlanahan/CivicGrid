"use client";

import { useEffect, useState } from "react";
import { AppProvider, useApp } from "@/lib/store";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { MapView } from "@/components/MapView";
import { MyAreaView } from "@/components/MyAreaView";
import { ConfidencePanel } from "@/components/ConfidencePanel";
import { TimelinePanel } from "@/components/TimelinePanel";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorBanner } from "@/components/ErrorBanner";

function Shell() {
  const { view, openPanel } = useApp();
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);

  // Simulate connecting to the live feed.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(t);
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
