import { formatConfidence } from "@/lib/data";

/**
 * Semicircular confidence gauge drawn as an SVG arc.
 * track = warm neutral, fill = category color, big % in the center.
 */
export function ConfidenceGauge({
  value,
  color,
  size = 88,
  showLabel = true,
}: {
  value: number; // 0–1
  color: string;
  size?: number;
  showLabel?: boolean;
}) {
  const stroke = Math.max(4, Math.round(size * 0.1));
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const pct = formatConfidence(value);

  const point = (angleDeg: number) => {
    const a = (angleDeg * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  };

  const [lx, ly] = point(180);
  const [rx, ry] = point(0);
  const fillAngle = 180 * (1 - Math.min(Math.max(value, 0), 1));
  const [fx, fy] = point(fillAngle);

  const height = cy + stroke / 2 + 2;
  const fontSize = Math.round(size * 0.26);

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height }}
      aria-label={`Confidence ${pct} percent — unverified estimate`}
    >
      <svg width={size} height={height} className="overflow-visible">
        <path
          d={`M ${lx} ${ly} A ${r} ${r} 0 0 1 ${rx} ${ry}`}
          fill="none"
          stroke="#EBE0CC"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${lx} ${ly} A ${r} ${r} 0 0 1 ${fx} ${fy}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </svg>
      <div
        className="absolute inset-x-0 flex flex-col items-center"
        style={{ top: cy - fontSize * 0.78 }}
      >
        <span
          className="font-mono font-semibold leading-none text-ink"
          style={{ fontSize }}
        >
          {pct}%
        </span>
        {showLabel && (
          <span className="label-mono mt-1 text-[9px] text-text-muted-2">
            Confidence
          </span>
        )}
      </div>
    </div>
  );
}
