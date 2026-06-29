import { RadioTower } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="grid h-[660px] grid-cols-1 lg:grid-cols-[1fr_350px]">
      <div className="relative grid place-items-center bg-map-canvas">
        <div className="flex items-center gap-2 text-text-muted">
          <RadioTower size={16} className="animate-pulse text-accent" />
          <span className="font-mono text-[12.5px]">Connecting to live feed…</span>
        </div>
      </div>
      <aside className="border-l border-border-warm-2 bg-surface-alt p-3">
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-[92px] animate-pulse rounded-card border border-border-warm-3 bg-white"
            />
          ))}
        </div>
      </aside>
    </div>
  );
}
