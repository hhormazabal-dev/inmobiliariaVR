export const FOLDER_BY_NAME: Record<string, string> = {
  "All Ñuñoa": "All Nunoa",
  "All Ñuñoa II": "All Nunoa II",
  "Best Level Ñuñoa": "Best Level Nunoa",
  "Best Ñuñoa": "Best Nunoa",
  "Conecta Huechuraba": "huechuraba/conecta",
  "Own Ñuñoa": "nunoa/own",
  "OWN Ñuñoa": "nunoa/own",
  OWN: "nunoa/own",
  "Parcelas Gorbea 5.000 m²": "parcelas",
  "Parcelas Gorbea 5000 m2": "parcelas",
  "Gorbea Parcelas 5000 MTS2": "parcelas",
  Parcelas: "parcelas",
};

export function resolveFolderName(projectName: string) {
  const trimmed = projectName?.trim();
  if (!trimmed) return "";
  return FOLDER_BY_NAME[trimmed] || trimmed;
}
