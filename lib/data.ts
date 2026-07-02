// Design tokens live in lib/tokens.ts (static). This module re-exports them so
// existing imports like `import { getCategory } from "@/lib/data"` keep working.
// Runtime event data now comes from the API (lib/api.ts) + database, not dummy JSON.
export {
  statusModel,
  categories,
  filters,
  MY_AREA_CONFIG,
  getStatus,
  getCategory,
  matchesFilter,
  formatConfidence,
} from "./tokens";
