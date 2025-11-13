export const FOLDER_BY_NAME: Record<string, string> = {
  "All Ñuñoa": "All Nunoa",
  "All Ñuñoa II": "All Nunoa II",
  "Best Level Ñuñoa": "Best Level Nunoa",
  "Best Ñuñoa": "Best Nunoa",
  "Conecta Huechuraba": "huechuraba/conecta",
};

export function resolveFolderName(projectName: string) {
  const trimmed = projectName?.trim();
  if (!trimmed) return "";
  return FOLDER_BY_NAME[trimmed] || trimmed;
}
