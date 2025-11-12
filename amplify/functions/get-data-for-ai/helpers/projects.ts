import { SubsidaryData } from "./accounts";

/* ========= FUNCTIONS ========= */

export const mapProjectIds = (
  prev: string[],
  curr: NonNullable<SubsidaryData>["items"][number]
): string[] => [
  ...prev,
  ...(curr.projects?.items.map((p) => p.id) || []),
  ...(curr.subsidiaries?.items.reduce<string[]>(mapProjectIds, []) || []),
];

/* =========== TYPES =========== */
