"use client";

import { TriangleAlert, X } from "lucide-react";

export function ErrorBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="flex items-center gap-2 border-b border-[#E9D6B8] bg-[#FBF1DD] px-5 py-2 text-[13px] text-[#8A6A1E]">
      <TriangleAlert size={15} className="shrink-0" />
      <span>Live feed unavailable — showing last known events.</span>
      <button
        onClick={onDismiss}
        className="ml-auto rounded p-0.5 hover:bg-[#F2E3C4]"
        aria-label="Dismiss"
      >
        <X size={15} />
      </button>
    </div>
  );
}
