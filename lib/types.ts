export type StatusKey =
  | "reported"
  | "corroborated"
  | "confirmed"
  | "resolved"
  | "unsubstantiated";

export type CategoryKey =
  | "vehicle_accident"
  | "fire"
  | "ems"
  | "police"
  | "hazard"
  | "civic";

export type FilterKey = "all" | "major" | "police" | "fire" | "ems" | "hazard";

export type SignalTrend = "rising" | "steady" | "falling";

export interface StatusDef {
  key: StatusKey;
  label: string;
  color: string;
  bg: string;
  desc: string;
}

export interface CategoryDef {
  key: CategoryKey;
  label: string;
  icon: string;
  color: string;
  tint: string;
}

export interface FilterDef {
  key: FilterKey;
  label: string;
}

export interface CivicEvent {
  id: string;
  title: string;
  event_type: string;
  category: CategoryKey;
  status: StatusKey;
  confidence: number;
  source_count: number;
  location_label: string;
  neighborhood: string;
  detected_ago: string;
  coord: { lat: number; lng: number };
  map_pos_pct: { x: number; y: number };
  signal_trend: SignalTrend;
  is_major: boolean;
}

export interface ConfidenceFactor {
  name: string;
  value: string;
  pct: number;
  note: string;
}

export interface TimelineEntry {
  time: string;
  status: StatusKey;
  head: string;
  body: string;
  sources: string;
}

export interface MyAreaStat {
  label: string;
  value: string;
  sub: string;
  tone: string;
}

export interface MyAreaNearby {
  id: string;
  title: string;
  category: CategoryKey;
  status: StatusKey;
  distance_mi: number;
  location_label: string;
  confidence: number;
}

export interface MyArea {
  name: string;
  radius_mi: number;
  alerts_on: boolean;
  stats: MyAreaStat[];
  nearby: MyAreaNearby[];
}

export interface DummyData {
  statusModel: StatusDef[];
  categories: CategoryDef[];
  filters: FilterDef[];
  events: CivicEvent[];
  confidenceFactors: { _for_event: string; factors: ConfidenceFactor[] };
  timeline: { _for_event: string; entries: TimelineEntry[] };
  myArea: MyArea;
}
