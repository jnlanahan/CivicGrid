import type {
  CategoryDef,
  CategoryKey,
  FilterDef,
  FilterKey,
  StatusDef,
  StatusKey,
} from "./types";

// Design tokens — colors/labels/icons that carry meaning. Static, never in the DB.

export const statusModel: StatusDef[] = [
  { key: "reported", label: "Reported", color: "#B5791A", bg: "#F4EAD2", desc: "One source suggests the event may be happening." },
  { key: "corroborated", label: "Corroborated", color: "#356C9B", bg: "#DEEAF3", desc: "Multiple independent signals support the event." },
  { key: "confirmed", label: "Confirmed", color: "#3F8F5B", bg: "#DDEEE3", desc: "Official confirmation or highly reliable evidence." },
  { key: "resolved", label: "Resolved", color: "#6B7682", bg: "#E7EAED", desc: "The event appears to have concluded." },
  { key: "unsubstantiated", label: "Unsubstantiated", color: "#9A5A4C", bg: "#F0E3DF", desc: "Initial signal was weak, contradictory, or unsupported." },
];

export const categories: CategoryDef[] = [
  { key: "vehicle_accident", label: "Traffic / Collision", icon: "car", color: "#E8833A", tint: "#FBEAD9" },
  { key: "fire", label: "Fire", icon: "flame", color: "#D9534F", tint: "#F7E2E1" },
  { key: "ems", label: "EMS / Medical", icon: "cross", color: "#3E7CB1", tint: "#E2ECF4" },
  { key: "police", label: "Police", icon: "shield", color: "#C9503E", tint: "#F6E3DF" },
  { key: "hazard", label: "Hazard", icon: "alert", color: "#E0A526", tint: "#F8EFD6" },
  { key: "civic", label: "Other / civic", icon: "pin", color: "#7B8794", tint: "#EAEDF0" },
];

export const filters: FilterDef[] = [
  { key: "all", label: "All events" },
  { key: "major", label: "Major incidents" },
  { key: "police", label: "Police" },
  { key: "fire", label: "Fire" },
  { key: "ems", label: "EMS" },
  { key: "hazard", label: "Hazards" },
];

/** Static config for the personalized My Area view. Only the numbers come from the DB. */
export const MY_AREA_CONFIG = {
  name: "Short North",
  radius_mi: 1.2,
  alerts_on: true,
  /** Approximate center of the watched area, for distance calculations. */
  center: { lat: 39.991, lng: -83.003 },
};

const statusByKey = new Map<StatusKey, StatusDef>(statusModel.map((s) => [s.key, s]));
const categoryByKey = new Map<CategoryKey, CategoryDef>(categories.map((c) => [c.key, c]));

export function getStatus(key: StatusKey): StatusDef {
  return statusByKey.get(key) ?? statusModel[0];
}

export function getCategory(key: CategoryKey): CategoryDef {
  return categoryByKey.get(key) ?? categories[categories.length - 1];
}

/** Returns true when an event matches the active filter. */
export function matchesFilter(
  event: { category: CategoryKey; is_major: boolean },
  filter: FilterKey
): boolean {
  switch (filter) {
    case "all":
      return true;
    case "major":
      return event.is_major;
    case "police":
    case "fire":
    case "ems":
    case "hazard":
      return event.category === filter;
    default:
      return true;
  }
}

export function formatConfidence(confidence: number): number {
  return Math.round(confidence * 100);
}
