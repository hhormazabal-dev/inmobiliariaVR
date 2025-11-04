import { FALLBACK_IMAGE_DATA } from "@/lib/fallbackImage";
import { toPublicStorageUrl } from "@/lib/supabaseImages";

const regionImage = (...candidates: string[]) => {
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (candidate.startsWith("http")) {
      return candidate;
    }
    if (candidate.startsWith("/")) {
      return candidate;
    }
    const url = toPublicStorageUrl(candidate);
    if (url) {
      return url;
    }
  }
  return FALLBACK_IMAGE_DATA;
};

const SANTIAGO_IMAGE_PRIMARY = regionImage(
  "santiago-centro/santos/portada.jpg",
  "santiago-centro/neo-yungay/portada.jpg",
  "/RM.jpeg",
);
const SANTIAGO_IMAGE_SECONDARY = regionImage(
  "nunoa/own/portada.jpg",
  "santiago-centro/argomedo/portada.jpg",
  "/RM.jpeg",
);
const VALPARAISO_IMAGE = regionImage(
  "vina-del-mar/vista-renaca/portada.jpg",
  "concon/bosquemar/Captura de pantalla 2022-11-11 171118.png",
  "/valpo.jpeg",
);
const COAST_IMAGE = regionImage(
  "coquimbo/cumbres-de-penuelas/portada.jpg",
  "la-serena/costa-pacifico-1/portada.jpg",
  "/coquimbo.jpeg",
);
const LAKE_DISTRICT_IMAGE = regionImage(
  "puerto-montt/vista-reloncavi/portada.jpg",
  "puerto-montt/parque-germania/portada.jpg",
  "/los-lagos.jpeg",
);
const ARAUCANIA_IMAGE = regionImage(
  "temuco/aldunate/portada.jpg",
  "temuco/ferroparque/portada.jpg",
  "/araucania.png",
);
const DESERT_NORTH_IMAGE = regionImage(
  "arica/neo-azapa/portada.jpg",
  "/arica.jpeg",
);
const VINEYARD_IMAGE = regionImage(
  "rancagua/caceres/portada.jpg",
  "/ohiggins.jpg",
);
const PATAGONIA_IMAGE = regionImage(
  "puerto-montt/vista-reloncavi/portada.jpg",
  "puerto-varas/indigo/portada.jpg",
  "/los-lagos.jpeg",
);

type BaseMeta = {
  highlight: string;
  detail: string;
  image: string;
};

export type CommuneMeta = BaseMeta & {
  displayName?: string;
};

export type RegionMeta = BaseMeta;

export const COMMUNE_META: Record<string, CommuneMeta> = {
  "Santiago Centro": {
    highlight: "CORAZÓN CULTURAL Y CORPORATIVO",
    detail:
      "Departamentos compactos, full conectividad y alta demanda de arriendo.",
    image: SANTIAGO_IMAGE_PRIMARY,
  },
  Ñuñoa: {
    highlight: "BARRIO CREATIVO + VIDA DE BARRIO",
    detail:
      "Plazas, cafés y ciclorutas con valorización sostenida los últimos años.",
    image: SANTIAGO_IMAGE_SECONDARY,
  },
  Providencia: {
    highlight: "EJE PREMIUM Y SERVICIOS",
    detail:
      "Un mix de oficinas, retail y residencias con ticket alto y liquidez.",
    image: SANTIAGO_IMAGE_PRIMARY,
  },
  "La Florida": {
    highlight: "CRECIMIENTO AL SURORIENTE",
    detail:
      "Proyectos familiares cerca de estaciones de metro y polos comerciales.",
    image: SANTIAGO_IMAGE_SECONDARY,
  },
  "San Miguel": {
    highlight: "MIX RESIDENCIAL & CONECTIVIDAD",
    detail:
      "Unidades de inversión con plusvalía y acceso directo a Línea 2 del Metro.",
    image: SANTIAGO_IMAGE_PRIMARY,
  },
  Independencia: {
    highlight: "RENOVACIÓN URBANA",
    detail:
      "Departamentos nuevos, cercanías universitarias y tickets accesibles.",
    image: SANTIAGO_IMAGE_SECONDARY,
  },
  "La Cisterna": {
    highlight: "PUERTA SUR METROPOLITANA",
    detail:
      "Conectividad con líneas 2 y 6 del Metro y proyectos pensados para familias emergentes.",
    image: SANTIAGO_IMAGE_SECONDARY,
  },
  "San Joaquin": {
    displayName: "San Joaquín",
    highlight: "NODO UNIVERSITARIO",
    detail:
      "Departamentos prácticos para estudiantes y profesionales a pasos de ejes educativos.",
    image: SANTIAGO_IMAGE_PRIMARY,
  },
  Renca: {
    highlight: "CONEXIÓN NORTE + PARQUES",
    detail:
      "Proyectos con vista a cerros isla y salidas rápidas hacia Vespucio y Costanera Norte.",
    image: SANTIAGO_IMAGE_SECONDARY,
  },
  Quilicura: {
    highlight: "POLO LOGÍSTICO Y RESIDENCIAL",
    detail:
      "Nuevas vialidades y parques empresariales impulsan la demanda habitacional.",
    image: SANTIAGO_IMAGE_PRIMARY,
  },
  "Quinta Normal": {
    highlight: "VIDA DE PARQUES Y MUSEOS",
    detail:
      "Áreas verdes patrimoniales y conectividad con Santiago Centro en minutos.",
    image: SANTIAGO_IMAGE_SECONDARY,
  },
  Recoleta: {
    highlight: "RUTA PATRIMONIAL + INFRAESTRUCTURA",
    detail:
      "Cultura, comercio mayorista y accesos directos a estaciones de Metro.",
    image: SANTIAGO_IMAGE_PRIMARY,
  },
  Huechuraba: {
    highlight: "CITY + NATURE MIX",
    detail:
      "Centros empresariales y barrios residenciales con vista a cerros y parques.",
    image: SANTIAGO_IMAGE_SECONDARY,
  },
  "Estacion Central": {
    displayName: "Estación Central",
    highlight: "CONEXIÓN INTERMODAL",
    detail:
      "A pasos de terminales, metro y arterias clave para moverse por Santiago.",
    image: SANTIAGO_IMAGE_PRIMARY,
  },
  "Puerto Montt": {
    highlight: "CAPITAL PATAGÓNICA",
    detail:
      "Proyectos con vista a fiordos y demanda corporativa y turística durante todo el año.",
    image: LAKE_DISTRICT_IMAGE,
  },
  Temuco: {
    highlight: "ENLACE SUR-AUSTRAL",
    detail:
      "Plusvalía estable gracias a universidades, servicios y conectividad aérea.",
    image: ARAUCANIA_IMAGE,
  },
  Coquimbo: {
    highlight: "COSTA CON PROYECCIÓN",
    detail:
      "Departamentos con vistas al mar y demanda estacional para arriendo turístico.",
    image: COAST_IMAGE,
  },
  Rancagua: {
    highlight: "CAPITAL REGIONAL EN EXPANSIÓN",
    detail:
      "Infraestructura consolidada y proyectos ideales para familias y profesionales.",
    image: VINEYARD_IMAGE,
  },
  Arica: {
    highlight: "CLIMA PRIVILEGIADO",
    detail:
      "Inversiones con renta mixta gracias a turismo todo el año y frontera activa.",
    image: DESERT_NORTH_IMAGE,
  },
  Concon: {
    displayName: "Concón",
    highlight: "COSTA GOURMET",
    detail:
      "Vista privilegiada al Pacífico, gastronomía y proyectos con amenities premium.",
    image: VALPARAISO_IMAGE,
  },
  Papudo: {
    highlight: "REFUGIO COSTERO",
    detail:
      "Departamentos con acceso a playas, marinas y actividades náuticas.",
    image: COAST_IMAGE,
  },
  "Puerto Varas": {
    highlight: "LAGO + TURISMO PREMIUM",
    detail:
      "Inversión que combina lifestyle, naturaleza y alta ocupación turística.",
    image: LAKE_DISTRICT_IMAGE,
  },
  "La Serena": {
    highlight: "DOBLE RESIDENCIA",
    detail:
      "Departamentos para vivir o veranear con servicios consolidados y playas extensas.",
    image: COAST_IMAGE,
  },
  "Viña Del Mar": {
    displayName: "Viña del Mar",
    highlight: "LIFESTYLE COSTERO",
    detail:
      "Departamentos con amenities, conectividad y demanda constante de arriendo.",
    image: VALPARAISO_IMAGE,
  },
};

export const REGION_META: Record<string, RegionMeta> = {
  "Región Metropolitana": {
    highlight: "Capital dinámica",
    detail:
      "Barrios consolidados, acceso a metro y polos corporativos que mantienen la demanda de arriendo activa.",
    image: SANTIAGO_IMAGE_PRIMARY,
  },
  "Región de Valparaíso": {
    highlight: "Costa vibrante",
    detail:
      "Ciudadanía costera, turismo todo el año y proyectos con amenities que elevan la experiencia.",
    image: VALPARAISO_IMAGE.replace("w=1400", "w=1600"),
  },
  "Región de Los Lagos": {
    highlight: "Patagonia urbana",
    detail:
      "Naturaleza, turismo corporativo y conexiones aéreas que sostienen la ocupación todo el año.",
    image: LAKE_DISTRICT_IMAGE.replace("w=1400", "w=1600"),
  },
  "Región de La Araucanía": {
    highlight: "Hub sur-austral",
    detail:
      "Universidades, servicios de salud y logística conectan la región con el resto del país.",
    image: ARAUCANIA_IMAGE.replace("w=1400", "w=1600"),
  },
  "Región de Coquimbo": {
    highlight: "Doble residencia",
    detail:
      "Segundas viviendas y arriendo temporal potencian la rentabilidad en la costa norte.",
    image: COAST_IMAGE.replace("w=1400", "w=1600"),
  },
  "Región de O'Higgins": {
    highlight: "Capital regional en expansión",
    detail:
      "Crecimiento inmobiliario respaldado por el agro, la minería y servicios profesionales.",
    image: VINEYARD_IMAGE.replace("w=1400", "w=1600"),
  },
  "Región de Arica y Parinacota": {
    highlight: "Norte estratégico",
    detail:
      "Turismo, comercio exterior y clima privilegiado generan ingresos mixtos y ocupación constante.",
    image: DESERT_NORTH_IMAGE.replace("w=1400", "w=1600"),
  },
  "Otras regiones": {
    highlight: "Nuevos polos",
    detail:
      "Ciudades en crecimiento con oportunidades frescas para diversificar tu portafolio inmobiliario.",
    image: PATAGONIA_IMAGE.replace("w=1400", "w=1600"),
  },
};

const FALLBACK_COMMUNE_THEMES: Array<Omit<CommuneMeta, "displayName">> = [
  {
    highlight: "POTENCIAL EN CRECIMIENTO",
    detail:
      "Proyectos nuevos en {name} con conectividad y servicios listos para potenciar tu inversión.",
    image: SANTIAGO_IMAGE_PRIMARY,
  },
  {
    highlight: "VIDA URBANA ACTIVA",
    detail:
      "Departamentos modernos en {name} con amenities, transporte cercano y alta demanda de arriendo.",
    image: COAST_IMAGE,
  },
  {
    highlight: "ENTORNO NATURAL Y RENTABLE",
    detail:
      "Combina lifestyle y rentabilidad en {name} con proyectos pensados para segunda vivienda.",
    image: PATAGONIA_IMAGE,
  },
];

const FALLBACK_REGION_THEMES: Array<RegionMeta> = [
  {
    highlight: "Visión regional",
    detail:
      "Analiza las tendencias de {name} para anticipar oportunidades en barrios emergentes.",
    image: SANTIAGO_IMAGE_PRIMARY.replace("w=1400", "w=1600"),
  },
  {
    highlight: "Experiencias integrales",
    detail:
      "Naturaleza, servicios y conectividad conviven en {name} para atraer residentes y turistas.",
    image: PATAGONIA_IMAGE.replace("w=1400", "w=1600"),
  },
];

const COMUNA_REGION_MAP: Record<string, string> = {
  "santiago centro": "Región Metropolitana",
  nunoa: "Región Metropolitana",
  providencia: "Región Metropolitana",
  "la florida": "Región Metropolitana",
  "san miguel": "Región Metropolitana",
  independencia: "Región Metropolitana",
  "la cisterna": "Región Metropolitana",
  "san joaquin": "Región Metropolitana",
  renca: "Región Metropolitana",
  quilicura: "Región Metropolitana",
  "quinta normal": "Región Metropolitana",
  recoleta: "Región Metropolitana",
  huechuraba: "Región Metropolitana",
  "estacion central": "Región Metropolitana",
  "puerto montt": "Región de Los Lagos",
  "puerto varas": "Región de Los Lagos",
  temuco: "Región de La Araucanía",
  coquimbo: "Región de Coquimbo",
  "la serena": "Región de Coquimbo",
  rancagua: "Región de O'Higgins",
  arica: "Región de Arica y Parinacota",
  concon: "Región de Valparaíso",
  papudo: "Región de Valparaíso",
  "vina del mar": "Región de Valparaíso",
};

export function prettifyName(raw: string) {
  const lower = raw.toLowerCase();
  const smallWords = new Set(["de", "del", "la", "las", "los", "y", "el"]);

  return lower
    .split(" ")
    .filter(Boolean)
    .map((word, index) => {
      if (index === 0 || !smallWords.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" ");
}

export function normalizeComuna(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

export function resolveRegion(comuna: string) {
  const normalized = normalizeComuna(comuna);
  return COMUNA_REGION_MAP[normalized] ?? "Otras regiones";
}

export function buildCommuneMeta(name: string, index: number): CommuneMeta {
  const meta = COMMUNE_META[name];
  if (meta) return meta;

  const theme = FALLBACK_COMMUNE_THEMES[index % FALLBACK_COMMUNE_THEMES.length];
  const displayName = prettifyName(name);
  return {
    ...theme,
    detail: theme.detail.replace(/{name}/g, displayName),
    displayName,
  };
}

export function getRegionMeta(name: string, index: number): RegionMeta {
  const meta = REGION_META[name];
  if (meta) return meta;

  const theme = FALLBACK_REGION_THEMES[index % FALLBACK_REGION_THEMES.length];
  const prettyName = prettifyName(name);
  return {
    highlight: theme.highlight.replace(/{name}/g, prettyName),
    detail: theme.detail.replace(/{name}/g, prettyName),
    image: theme.image,
  };
}
