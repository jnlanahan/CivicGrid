import {
  Car,
  Flame,
  SquarePlus,
  Shield,
  TriangleAlert,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import type { CategoryKey } from "@/lib/types";

const ICON_MAP: Record<CategoryKey, LucideIcon> = {
  vehicle_accident: Car,
  fire: Flame,
  ems: SquarePlus,
  police: Shield,
  hazard: TriangleAlert,
  civic: MapPin,
};

export function categoryIcon(key: CategoryKey): LucideIcon {
  return ICON_MAP[key] ?? MapPin;
}

export function CategoryIcon({
  category,
  size = 18,
  color,
  className,
}: {
  category: CategoryKey;
  size?: number;
  color?: string;
  className?: string;
}) {
  const Icon = categoryIcon(category);
  return <Icon size={size} strokeWidth={2} color={color} className={className} />;
}
