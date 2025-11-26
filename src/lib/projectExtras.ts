type ProjectExtras = {
  tipologias?: string;
  bono_pie?: string | number;
  descuento?: string | number;
  credito_interno?: string | number;
  reserva?: string | number;
};

const DATA: Array<
  {
    name: string;
    comuna: string;
  } & ProjectExtras
> = [
  {
    name: "Urban La Florida",
    comuna: "La Florida",
    tipologias: "1-2D / 1-2B; OF-LOCALES",
    bono_pie: "si",
    descuento: "si",
    reserva: 250000,
  },
  {
    name: "Mirador",
    comuna: "La Florida",
    tipologias: "1-2D / 1-2B",
    bono_pie: "0,1",
    descuento: "0,25",
    credito_interno: "0,1",
    reserva: 400000,
  },
  {
    name: "BW815",
    comuna: "La Florida",
    tipologias: "1-2-3D / 1-2B",
    bono_pie: "0,1",
    descuento: "0,3",
    credito_interno: "0,1",
    reserva: 400000,
  },
  {
    name: "MOOD",
    comuna: "La Florida",
    tipologias: "1-2D / 1-2B",
    bono_pie: "0,1",
    reserva: 400000,
  },
  {
    name: "Liverpool",
    comuna: "La Florida",
    tipologias: "1-2-3D / 1-2B",
    bono_pie: "0,1",
    descuento: "0,1",
    credito_interno: "0,1",
    reserva: 300000,
  },
  {
    name: "Trinidad III",
    comuna: "La Cisterna",
    tipologias: "2-3D / 1-2B",
    bono_pie: "0,1",
    credito_interno: "0,1",
    reserva: 250000,
  },
  {
    name: "Plaza Cervantes - B",
    comuna: "La Cisterna",
    tipologias: "2-3D / 1B",
    bono_pie: "0,1",
    credito_interno: "0,1",
    reserva: 250000,
  },
  {
    name: "Don Claudio",
    comuna: "La Cisterna",
    tipologias: "1-2D / 1-2B",
    bono_pie: "0,15",
    reserva: 350000,
  },
  {
    name: "Carvajal",
    comuna: "La Cisterna",
    tipologias: "1D / 1-2B",
    bono_pie: "0,15",
    reserva: 350000,
  },
  {
    name: "Alto Goycolea",
    comuna: "La Cisterna",
    bono_pie: "0,1",
    descuento: "0,1",
    credito_interno: "0,1",
    reserva: 200000,
  },
  {
    name: "Jardin de Alvarado",
    comuna: "Independencia",
    tipologias: "1-2-3D / 1B",
    bono_pie: "0,1",
    credito_interno: "0,1",
    reserva: 250000,
  },
  {
    name: "Bezanilla",
    comuna: "Independencia",
    tipologias: "2D / 2B",
    bono_pie: "consultar",
    descuento: "si",
    reserva: 350000,
  },
  {
    name: "Independencia Activa",
    comuna: "Independencia",
    tipologias: "2D / 2B",
    bono_pie: "0,1",
    descuento: "0,35",
    credito_interno: "0,1",
    reserva: 400000,
  },
  {
    name: "Plaza Chacabuco",
    comuna: "Independencia",
    tipologias: "2D / 2B",
    bono_pie: "0,1",
    descuento: "0,32",
    credito_interno: "0,1",
    reserva: 400000,
  },
  {
    name: "Hipodromo Plaza",
    comuna: "Independencia",
    tipologias: "1D / 1B",
    bono_pie: "0,1",
    descuento: "0,32",
    credito_interno: "0,1",
    reserva: 400000,
  },
  {
    name: "INDI",
    comuna: "Independencia",
    bono_pie: "0,1",
    credito_interno: "0,1",
    reserva: 400000,
  },
  {
    name: "Santa Maria",
    comuna: "Independencia",
    tipologias: "1-2-3D / 1-2B",
    bono_pie: "0,1",
    descuento: "0,1",
    credito_interno: "0,1",
    reserva: 200000,
  },
  {
    name: "Pintor Cicarelli",
    comuna: "San Joaquin",
    tipologias: "1-2-3D / 1B",
    bono_pie: "0,1",
    credito_interno: "0,1",
    reserva: 250000,
  },
  {
    name: "Alto Lazcano",
    comuna: "San Miguel",
    tipologias: "1-2-3D / 1-2B",
    bono_pie: "0,15",
    reserva: 350000,
  },
  {
    name: "Vista Costanera",
    comuna: "Renca",
    tipologias: "2-3D / 1B",
    bono_pie: "0,1",
    credito_interno: "0,1",
    reserva: 250000,
  },
  {
    name: "Apostol Santiago",
    comuna: "Renca",
    tipologias: "2-3D / 1-2B",
    bono_pie: "0,1",
    credito_interno: "0,1",
    reserva: 250000,
  },
  {
    name: "Plaza Quilicura",
    comuna: "Quilicura",
    tipologias: "2-3D / 1B",
    bono_pie: "0,1",
    descuento: "0,1",
    credito_interno: "0,1",
    reserva: 250000,
  },
  {
    name: "Santos",
    comuna: "Santiago Centro",
    tipologias: "1-2D / 1-2B",
    bono_pie: "0,1",
    reserva: 400000,
  },
  {
    name: "Argomedo",
    comuna: "Santiago Centro",
    tipologias: "1-2D / 1-2B",
    bono_pie: "0,1",
    reserva: 400000,
  },
  {
    name: "Barrio Zenteno",
    comuna: "Santiago Centro",
    tipologias: "1-2D / 1-2B",
    bono_pie: "0,1",
    descuento: "0,1",
    credito_interno: "0,1",
    reserva: 200000,
  },
  {
    name: "Mirador Mapocho",
    comuna: "Quinta Normal",
    tipologias: "1-2-3D / 1-2B",
    bono_pie: "0,1",
    credito_interno: "0,1",
    reserva: 250000,
  },
  {
    name: "Dominica",
    comuna: "Recoleta",
    tipologias: "1-2D",
    bono_pie: "0,1",
    descuento: "0,3",
    credito_interno: "0,1",
    reserva: 400000,
  },
  {
    name: "Conecta",
    comuna: "Huechuraba",
    tipologias: "2-3D / 1-2B",
    bono_pie: "Maximo 10%",
    descuento: "si",
    reserva: 250000,
  },
  {
    name: "Suecia",
    comuna: "Providencia",
    tipologias: "2-3D / 2-3B",
    bono_pie: "0,1",
    credito_interno: "0,1",
    reserva: 400000,
  },
  {
    name: "OWN",
    comuna: "Ñuñoa",
    tipologias: "1-2D / 1-2B",
    bono_pie: "0,1",
    credito_interno: "0,1",
    reserva: 400000,
  },
  {
    name: "Vista Reloncaví",
    comuna: "Puerto Montt",
    tipologias: "2-3D / 1B",
    bono_pie: "0,1",
    credito_interno: "0,1",
    reserva: 250000,
  },
  {
    name: "Aldunate",
    comuna: "Temuco",
    tipologias: "2-3D / 1B",
    bono_pie: "0,1",
    descuento: "si",
    credito_interno: "0,1",
    reserva: 250000,
  },
  {
    name: "Ferroparque",
    comuna: "Temuco",
    tipologias: "1-2-3D / 1-2B",
    reserva: 250000,
  },
  {
    name: "Cumbres de Peñuelas",
    comuna: "Coquimbo",
    tipologias: "2-3D / 2B",
    descuento: "si",
    reserva: 250000,
  },
  {
    name: "Edificio HA",
    comuna: "Coquimbo",
    tipologias: "STUDIO-1-2D; LOCALES - OF",
    reserva: 250000,
  },
  {
    name: "Caceres",
    comuna: "Rancagua",
    tipologias: "2-3D / 1B",
    bono_pie: "0,1",
    credito_interno: "0,1",
    reserva: 250000,
  },
  {
    name: "Neo Azapa",
    comuna: "Arica",
    tipologias: "1-2-3D / 1-2B",
    bono_pie: "si",
    descuento: "si",
    reserva: 250000,
  },
  {
    name: "Bosquemar",
    comuna: "Concón",
    tipologias: "2-3D / 2B",
    bono_pie: "si",
    descuento: "si",
    reserva: 250000,
  },
  {
    name: "Lomas de Puyai",
    comuna: "Papudo",
    tipologias: "2-3D / 1-2B",
    bono_pie: "si",
    descuento: "si",
    reserva: 250000,
  },
  {
    name: "Indigo",
    comuna: "Puerto Varas",
    tipologias: "2-3D / 2B",
    bono_pie: "0,1",
    credito_interno: "0,1",
    reserva: 400000,
  },
  {
    name: "Costa Pacifico 1",
    comuna: "La Serena",
    tipologias: "2-3D",
    descuento: "0,1",
    credito_interno: "0,1",
    reserva: 300000,
  },
  {
    name: "Vista Reñaca",
    comuna: "Viña del Mar",
    reserva: 200000,
  },
];

function normalizeComuna(comuna: string) {
  const s = comuna?.trim();
  if (!s) return "";
  const upper = s.toUpperCase();
  if (upper.startsWith("MUERTO")) return "Puerto Montt";
  if (upper.startsWith("STGO")) return "Santiago Centro";
  if (upper === "ÑUÑOA") return "Ñuñoa";
  return upper
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(" ");
}

const EXTRAS_MAP = new Map<string, ProjectExtras>();

for (const item of DATA) {
  const key = `${item.name.trim().toLowerCase()}::${normalizeComuna(
    item.comuna,
  ).toLowerCase()}`;
  if (!EXTRAS_MAP.has(key)) {
    EXTRAS_MAP.set(key, {
      tipologias: item.tipologias,
      bono_pie: item.bono_pie,
      descuento: item.descuento,
      credito_interno: item.credito_interno,
      reserva: item.reserva,
    });
  }
}

export function getProjectExtras(
  name: string,
  comuna: string | null | undefined,
) {
  if (!name) return null;
  const normalizedComuna = normalizeComuna(comuna ?? "");
  const key = `${name.trim().toLowerCase()}::${normalizedComuna.toLowerCase()}`;
  return EXTRAS_MAP.get(key) ?? null;
}
