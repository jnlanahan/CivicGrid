import type { SignalTrend } from "@/lib/types";

const TREND_POINTS: Record<SignalTrend, number[]> = {
  rising: [7, 6, 7, 5, 6, 4, 5, 3, 2, 1],
  steady: [5, 4, 6, 5, 4, 5, 4, 5, 4, 5],
  falling: [1, 2, 2, 3, 4, 4, 5, 6, 6, 7],
};

/** Tiny inline sparkline; y values are "height from top" (smaller = higher). */
export function Sparkline({
  trend,
  color,
  width = 64,
  height = 18,
  opacity = 1,
}: {
  trend: SignalTrend;
  color: string;
  width?: number;
  height?: number;
  opacity?: number;
}) {
  const pts = TREND_POINTS[trend];
  const max = 7;
  const stepX = width / (pts.length - 1);
  const d = pts
    .map((p, i) => {
      const x = i * stepX;
      const y = 2 + (p / max) * (height - 4);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} style={{ opacity }} className="block">
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
