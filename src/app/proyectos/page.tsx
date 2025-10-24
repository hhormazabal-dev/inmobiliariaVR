import { createClient } from "@supabase/supabase-js";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/types/project";

export const revalidate = 60;

const STORAGE_BASE_URL =
  "https://twixglfzfcdtwklpstvr.supabase.co/storage/v1/object/public/projects/";
const STORAGE_HOSTNAME = new URL(STORAGE_BASE_URL).hostname;

type SupabaseProject = {
  id: string;
  name: string | null;
  comuna: string | null;
  description: string | null;
  cover_url: string | null;
  uf_min: string | number | null;
  uf_max: string | number | null;
  status: string | null;
  featured: boolean | null;
};

type ProjectMetadata = {
  slug: string;
  tipologias: string[];
  entrega: Project["entrega"];
  arriendoGarantizado?: boolean;
  creditoInterno?: boolean;
  folder?: string;
  fallbackDescription?: string;
  fallbackCoverCandidates?: string[];
};

const PROJECT_METADATA: Record<string, ProjectMetadata> = {
  "All Ñuñoa": {
    slug: "all-nunoa",
    tipologias: ["Studios", "1D", "2D"],
    entrega: "en_verde",
    arriendoGarantizado: true,
    creditoInterno: true,
    folder: "All Nunoa",
    fallbackDescription:
      "Departamentos con terminaciones premium, espacios comunes modernos y conectividad total.",
    fallbackCoverCandidates: [
      "All Nunoa/portada.jpg",
      "All Nunoa/cover.jpg",
      "All Nunoa/1.jpg",
      "All Nunoa/01.jpg",
    ],
  },
  "All Ñuñoa II": {
    slug: "all-nunoa-ii",
    tipologias: ["1D", "2D"],
    entrega: "en_blanco",
    arriendoGarantizado: true,
    folder: "All Nunoa II",
    fallbackDescription:
      "Un nuevo proyecto pensado para quienes buscan comodidad, diseño y plusvalía asegurada.",
    fallbackCoverCandidates: [
      "All Nunoa II/portada.jpg",
      "All Nunoa II/cover.jpg",
      "All Nunoa II/1.jpg",
      "All Nunoa II/01.jpg",
    ],
  },
  "Best Level Ñuñoa": {
    slug: "best-level-nunoa",
    tipologias: ["Studios", "1D", "2D"],
    entrega: "inmediata",
    creditoInterno: true,
    folder: "Best Level Nunoa",
    fallbackDescription:
      "Vive en el corazón de Ñuñoa, con amenities únicos y arquitectura de vanguardia.",
    fallbackCoverCandidates: [
      "Best Level Nunoa/portada.jpg",
      "Best Level Nunoa/cover.jpg",
      "Best Level Nunoa/1.jpg",
      "Best Level Nunoa/01.jpg",
    ],
  },
  "Best Ñuñoa": {
    slug: "best-nunoa",
    tipologias: ["1D", "2D", "3D"],
    entrega: "en_verde",
    folder: "Best Nunoa",
    fallbackDescription:
      "Tu nuevo hogar a pasos del metro, con áreas verdes y un estilo de vida urbano y tranquilo.",
    fallbackCoverCandidates: [
      "Best Nunoa/portada.jpg",
      "Best Nunoa/cover.jpg",
      "Best Nunoa/1.jpg",
      "Best Nunoa/01.jpg",
    ],
  },
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    console.error(
      `[proyectos] Falta configurar la variable de entorno ${name}`,
    );
  }
  return value;
}

function toAbsoluteStorageUrl(
  path: string | null | undefined,
  fallback?: string,
) {
  const candidates = [path, fallback].filter(Boolean) as string[];

  for (const raw of candidates) {
    if (/^https?:\/\//i.test(raw)) {
      try {
        const url = new URL(raw);
        if (url.hostname === STORAGE_HOSTNAME) {
          return url.toString();
        }
        const rebased = rebaseStorageUrl(url);
        if (rebased) {
          return rebased;
        }
        console.warn(
          `[proyectos] URL de imagen descartada por hostname distinto: ${url.hostname}`,
        );
        continue;
      } catch (error) {
        console.warn(
          `[proyectos] URL de imagen inválida (${raw}). Intentando fallback.`,
          error,
        );
        continue;
      }
    }

    try {
      const sanitized = raw.replace(/^\/+/, "");
      return new URL(sanitized, STORAGE_BASE_URL).toString();
    } catch (error) {
      console.error(
        `[proyectos] No se pudo formar la URL de imagen para ${raw}`,
        error,
      );
    }
  }

  return "";
}

function rebaseStorageUrl(url: URL) {
  const host = url.hostname.toLowerCase();
  if (host === STORAGE_HOSTNAME.toLowerCase()) {
    return url.toString();
  }

  const cleaned = url.pathname
    .replace(/^\/+/, "")
    .replace(/^storage\/v1\/object\/public\/projects\/?/i, "")
    .replace(/^projects\/?/i, "");

  if (!cleaned) {
    return null;
  }

  try {
    return new URL(cleaned, STORAGE_BASE_URL).toString();
  } catch (error) {
    console.error(
      "[proyectos] No se pudo rearmar la URL de almacenamiento",
      error,
    );
    return null;
  }
}

function parseNumeric(value: SupabaseProject["uf_min"]) {
  if (value === null || typeof value === "undefined") {
    return undefined;
  }

  const num = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(num) ? num : undefined;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchProjects(): Promise<Project[]> {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !key) {
    return [];
  }

  const supabase = createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("comuna", "Ñuñoa");

  if (error) {
    console.error("[proyectos] Error consultando Supabase:", error);
    return [];
  }

  const uniqueRows = dedupeByName(data ?? []);
  const mapped = uniqueRows.map((row) => mapSupabaseProject(row));

  return dedupeBySlug(mapped.filter((proj): proj is Project => proj !== null));
}

function dedupeByName(rows: SupabaseProject[]) {
  const seen = new Set<string>();
  const result: SupabaseProject[] = [];

  for (const row of rows) {
    if (!row.name) continue;
    const key = slugify(row.name);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(row);
    }
  }

  return result;
}

function dedupeBySlug(projects: Project[]) {
  const seen = new Set<string>();
  const result: Project[] = [];

  for (const project of projects) {
    if (seen.has(project.slug)) continue;
    seen.add(project.slug);
    result.push(project);
  }

  return result;
}

function mapSupabaseProject(row: SupabaseProject): Project | null {
  if (!row.name) {
    return null;
  }

  const meta = PROJECT_METADATA[row.name];
  if (!meta) {
    console.warn(
      `[proyectos] Proyecto sin metadata local: ${row.name}. Se omite en la grilla.`,
    );
    return null;
  }

  const titulo = row.name;
  const slug = meta.slug || slugify(row.name);
  const comuna = row.comuna ?? "Ñuñoa";
  const desdeUF = parseNumeric(row.uf_min) ?? 0;
  console.info(
    `[proyectos] Registro Supabase -> name: ${row.name}, cover_url: ${row.cover_url}`,
  );
  const imagen = resolveCoverUrl(row, meta);
  const descripcion =
    (typeof row.description === "string" && row.description.trim().length > 0
      ? row.description.trim()
      : meta.fallbackDescription) ?? "";

  if (!descripcion) {
    console.warn(
      `[proyectos] Proyecto ${row.name} sin descripción. Se usará copy por defecto.`,
    );
  }

  if (!imagen) {
    console.warn(
      `[proyectos] Proyecto ${row.name} sin imagen válida. Se omite en la grilla.`,
    );
    return null;
  }

  const project: Project = {
    id: row.id ?? slug,
    slug,
    titulo,
    comuna,
    desdeUF,
    tipologias: meta.tipologias,
    entrega: meta.entrega,
    imagen,
    descripcion,
  };

  if (typeof meta.arriendoGarantizado === "boolean") {
    project.arriendoGarantizado = meta.arriendoGarantizado;
  }

  if (typeof meta.creditoInterno === "boolean") {
    project.creditoInterno = meta.creditoInterno;
  }

  return project;
}

function resolveCoverUrl(row: SupabaseProject, meta: ProjectMetadata) {
  const direct = toAbsoluteStorageUrl(row.cover_url);
  if (direct) {
    console.info(
      `[proyectos] Portada directa usada para ${row.name}: ${direct}`,
    );
    return direct;
  }

  const fallback = pickFallbackCandidate(meta);
  if (fallback) {
    console.warn(
      `[proyectos] Uso de fallback manual para ${row.name}: ${fallback}`,
    );
    return fallback;
  }

  console.error(`[proyectos] No fue posible resolver imagen para ${row.name}`);
  return "";
}

function pickFallbackCandidate(meta: ProjectMetadata) {
  const candidates =
    meta.fallbackCoverCandidates && meta.fallbackCoverCandidates.length > 0
      ? meta.fallbackCoverCandidates
      : meta.folder
        ? [`${meta.folder}/portada.jpg`]
        : [];

  for (const candidate of candidates) {
    const url = toAbsoluteStorageUrl(candidate);
    if (url) {
      return url;
    }
  }

  return "";
}

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProyectosPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const comuna = firstParam(params.comuna);
  const ufMin = firstParam(params.ufMin);
  const ufMax = firstParam(params.ufMax);
  const tipologia = firstParam(params.tipologia);
  const entrega = firstParam(params.entrega) as
    | "inmediata"
    | "en_verde"
    | "en_blanco"
    | undefined;
  const arriendoGarantizado = firstParam(params.arriendoGarantizado);
  const view = firstParam(params.view) as "map" | undefined;

  const projects = await fetchProjects();

  const filtered = projects.filter((p) => {
    if (comuna && p.comuna !== comuna) return false;
    if (tipologia && !p.tipologias.includes(tipologia)) return false;
    if (entrega && p.entrega !== entrega) return false;
    if (
      typeof ufMin !== "undefined" &&
      ufMin !== "" &&
      p.desdeUF < Number(ufMin)
    )
      return false;
    if (
      typeof ufMax !== "undefined" &&
      ufMax !== "" &&
      p.desdeUF > Number(ufMax)
    )
      return false;
    if (arriendoGarantizado === "1" && !p.arriendoGarantizado) return false;
    return true;
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-navy">
            Proyectos
          </h1>
          <p className="text-sm text-brand-mute">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}{" "}
            {comuna ? `en ${comuna}` : ""}.
            {view === "map"
              ? " (vista mapa disponible en la siguiente fase)"
              : ""}
          </p>
        </div>
        {/* placeholder para botón "Ver mapa" si viene desde Hero */}
        {view === "map" && (
          <button
            className="rounded-lg border border-brand-navy/15 bg-white/90 px-4 py-2 text-sm font-semibold text-brand-navy shadow-sm transition hover:border-brand-navy/30"
            title="Mapa en desarrollo"
          >
            Mapa (próxima fase)
          </button>
        )}
      </header>

      {/* Grid */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </section>

      {/* Estado vacío */}
      {filtered.length === 0 && (
        <div className="mt-12 rounded-2xl border border-brand-navy/10 bg-white/80 p-10 text-center text-brand-mute shadow-sm">
          No encontramos proyectos con esos filtros. Ajusta la comuna o el rango
          de UF.
        </div>
      )}
    </main>
  );
}
