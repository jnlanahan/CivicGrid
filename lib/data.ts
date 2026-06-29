import raw from "@/data/dummy-data.json";
import type {
  CategoryDef,
  CategoryKey,
  DummyData,
  FilterKey,
  StatusDef,
  StatusKey,
} from "./types";

export const data = raw as unknown as DummyData;

export const events = data.events;
export const statusModel = data.statusModel;
export const categories = data.categories;
export const filters = data.filters;
export const confidenceFactors = data.confidenceFactors;
export const timeline = data.timeline;
export const myArea = data.myArea;

const statusByKey = new Map<StatusKey, StatusDef>(
  statusModel.map((s) => [s.key, s])
);
const categoryByKey = new Map<CategoryKey, CategoryDef>(
  categories.map((c) => [c.key, c])
);

export function getStatus(key: StatusKey): StatusDef {
  return statusByKey.get(key) ?? statusModel[0];
}

export function getCategory(key: CategoryKey): CategoryDef {
  return categoryByKey.get(key) ?? categories[categories.length - 1];
}

export function getEvent(id: string) {
  return events.find((e) => e.id === id);
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
