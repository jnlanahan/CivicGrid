import { getStatus } from "@/lib/data";
import type { StatusKey } from "@/lib/types";

export function StatusChip({
  status,
  withDot = true,
  className = "",
  fixedWidth = false,
}: {
  status: StatusKey;
  withDot?: boolean;
  className?: string;
  fixedWidth?: boolean;
}) {
  const s = getStatus(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-chip px-2 py-0.5 text-[11.5px] font-semibold ${
        fixedWidth ? "w-[124px] justify-center" : ""
      } ${className}`}
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      {withDot && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: s.color }}
        />
      )}
      {s.label}
    </span>
  );
}
