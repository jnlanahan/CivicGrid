"use client";

import { useState } from "react";
import { ChevronDown, Grid3x3, Home, Map as MapIcon, Search, User } from "lucide-react";
import { useApp } from "@/lib/store";

export function Header() {
  const { view, setView } = useApp();
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header className="flex items-center gap-4 border-b border-border-warm-2 bg-surface px-5 py-3">
      {/* Logo lockup */}
      <button
        onClick={() => setView("map")}
        className="flex shrink-0 items-center gap-2"
        aria-label="CivicGrid home"
      >
        <span className="grid h-7 w-7 place-items-center rounded-[7px] bg-accent-tint">
          <Grid3x3 size={17} strokeWidth={2.4} className="text-accent" />
        </span>
        <span className="font-display text-[21px] font-bold tracking-display text-ink">
          CivicGrid
        </span>
      </button>

      {/* Search field */}
      <div className="relative flex-1" style={{ maxWidth: 560 }}>
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint"
        />
        <input
          type="text"
          placeholder="Search Columbus events, neighborhoods, addresses…"
          className="w-full rounded-[11px] border border-border-warm-2 bg-white py-2.5 pl-10 pr-3 text-[13.5px] text-ink placeholder:text-text-faint focus:border-accent focus:outline-none"
        />
      </div>

      {/* Top-level nav */}
      <nav className="hidden items-center gap-1 rounded-[11px] bg-app p-1 sm:flex">
        <NavTab
          active={view === "map"}
          onClick={() => setView("map")}
          icon={<MapIcon size={15} strokeWidth={2.2} />}
          label="Live Map"
        />
        <NavTab
          active={view === "my-area"}
          onClick={() => setView("my-area")}
          icon={<Home size={15} strokeWidth={2.2} />}
          label="My Area"
        />
      </nav>

      {/* Account */}
      <div className="relative shrink-0">
        <button
          onClick={() => setAccountOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-full border border-border-warm-2 bg-white py-2 pl-3 pr-2.5 text-[13px] font-medium text-ink hover:bg-surface-alt"
        >
          <User size={15} strokeWidth={2.2} className="text-accent" />
          Account
          <ChevronDown size={14} className="text-text-muted" />
        </button>
        {accountOpen && (
          <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-44 animate-fade-in rounded-card border border-border-warm-2 bg-white py-1.5 shadow-detail">
            {["Watched areas", "Alert settings", "About CivicGrid"].map((item) => (
              <button
                key={item}
                onClick={() => setAccountOpen(false)}
                className="block w-full px-3.5 py-2 text-left text-[13px] text-text-secondary hover:bg-surface-alt"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function NavTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[13px] font-medium transition-colors ${
        active
          ? "bg-white text-ink shadow-card-subtle"
          : "text-text-muted hover:text-ink"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
