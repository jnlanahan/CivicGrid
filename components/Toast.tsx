"use client";

import { Eye } from "lucide-react";

export function FilterToast({
  label,
  hiddenCount,
  onClear,
}: {
  label: string;
  hiddenCount: number;
  onClear: () => void;
}) {
  return (
    <div className="pointer-events-auto absolute left-1/2 top-4 z-30 flex -translate-x-1/2 animate-panel-in items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] text-white shadow-toast">
      <Eye size={15} className="text-white/80" />
      <span>
        Showing <strong className="font-semibold">{label}</strong> only · {hiddenCount} event
        {hiddenCount === 1 ? "" : "s"} hidden
      </span>
      <button
        onClick={onClear}
        className="ml-1 font-medium text-accent hover:underline"
      >
        Clear
      </button>
    </div>
  );
}
