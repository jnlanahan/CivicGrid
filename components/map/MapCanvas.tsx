/** Calm, warm-neutral styled map placeholder so the colored pins pop. */
export function MapCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-map-canvas">
      {/* Subtle grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #FBFAF6 1px, transparent 1px), linear-gradient(to bottom, #FBFAF6 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.7,
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Park blobs */}
        <ellipse cx="9" cy="34" rx="9" ry="9" fill="#D9E4CB" opacity="0.9" />
        <ellipse cx="62" cy="86" rx="8" ry="8" fill="#D9E4CB" opacity="0.9" />

        {/* River band */}
        <path
          d="M 36 -5 C 30 30, 40 55, 30 110"
          stroke="#C7D8E6"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Highway ribbons */}
        <line x1="-5" y1="62" x2="105" y2="40" stroke="#F2B27C" strokeWidth="1.7" strokeLinecap="round" />
        <line x1="-5" y1="40" x2="105" y2="58" stroke="#F4C79B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="40" y1="-5" x2="33" y2="105" stroke="#F2B27C" strokeWidth="1.6" strokeLinecap="round" />
      </svg>

      {/* City wordmark */}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[64px] font-bold tracking-display"
        style={{ color: "#B7AD98", opacity: 0.5 }}
      >
        Columbus
      </span>

      {/* Neighborhood labels */}
      <NeighborhoodLabel name="Short North" x="8%" y="22%" />
      <NeighborhoodLabel name="Italian Village" x="58%" y="18%" />
      <NeighborhoodLabel name="German Village" x="58%" y="80%" />
      <NeighborhoodLabel name="Victorian Village" x="14%" y="44%" />
      <NeighborhoodLabel name="Downtown" x="70%" y="54%" />
    </div>
  );
}

function NeighborhoodLabel({ name, x, y }: { name: string; x: string; y: string }) {
  return (
    <span
      className="label-mono absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10.5px]"
      style={{ left: x, top: y, color: "#9A8F7C" }}
    >
      {name}
    </span>
  );
}
