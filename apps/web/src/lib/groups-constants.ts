export type GroupType = "region" | "sector" | "theme";

export const GROUP_TYPES: { value: GroupType; label: string }[] = [
  { value: "region", label: "Région / Ville" },
  { value: "sector", label: "Secteur d'activité" },
  { value: "theme", label: "Thème transversal" },
];
