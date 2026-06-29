"use client";

import { useEffect, type ReactNode } from "react";

export function Modal({
  onClose,
  children,
  width = 560,
}: {
  onClose: () => void;
  children: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-start justify-center overflow-y-auto bg-ink/30 p-4 py-10 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className="animate-panel-in rounded-panel bg-white shadow-detail"
        style={{ width, maxWidth: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
