const slugify = (input: string) =>
  (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const FOLDER_BY_NAME: Record<string, string> = {
  "All Ñuñoa": "All Nunoa",
  "All Ñuñoa II": "All Nunoa II",
  "Best Level Ñuñoa": "Best Level Nunoa",
  "Best Ñuñoa": "Best Nunoa",
  "Conecta Huechuraba": "huechuraba/conecta",
  "CONECTA HUECHURABA": "huechuraba/conecta",
  "Own Ñuñoa": "nunoa/own",
  "OWN Ñuñoa": "nunoa/own",
  OWN: "nunoa/own",
  Carvajal: "la-cisterna/carvajal",
  CARVAJAL: "la-cisterna/carvajal",
  MOOD: "la-florida/mood",
  Mood: "la-florida/mood",
  "Urban La Florida": "la-florida/urban-la-florida",
  "URBAN LA FLORIDA": "la-florida/urban-la-florida",
  Liverpool: "la-florida/liverpool",
  LIVERPOOL: "la-florida/liverpool",
  "Plaza Quilicura": "quilicura/plaza-quilicura",
  "PLAZA QUILICURA": "quilicura/plaza-quilicura",
  "Don Claudio": "la-cisterna/don-claudio",
  "DON CLAUDIO": "la-cisterna/don-claudio",
  "Parcelas Gorbea 5.000 m²": "parcelas",
  "Parcelas Gorbea 5000 m2": "parcelas",
  "Gorbea Parcelas 5000 MTS2": "parcelas",
  Parcelas: "parcelas",
};

export function resolveFolderName(projectName: string) {
  const trimmed = projectName?.trim();
  if (!trimmed) return "";
  return FOLDER_BY_NAME[trimmed] || slugify(trimmed);
}
