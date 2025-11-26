import { createClient } from "@supabase/supabase-js";
import { getProjectExtras } from "@/lib/projectExtras";
import ProjectCard from "@/components/ProjectCard";
import { prettifyName } from "@/lib/territoryMeta";
import type { CatalogProject } from "@/types/catalogProject";
import { buildProjectSlug } from "@/lib/projectSlug";

export const revalidate = 0;

const BLOCKED_SLUGS = new Set([
  buildProjectSlug("Parque Germania", "Puerto Montt"),
  buildProjectSlug("Parque Germania", "Muerto Montt"),
]);

const NAME_OVERRIDES = new Map<string, string>([
  [buildProjectSlug("Barrio Centeno", "Santiago Centro"), "Barrio Zenteno"],
]);

type ProjectRow = {
  id: string;
  name: string | null;
  comuna: string | null;
  uf_min: number | string | null;
  uf_max: number | string | null;
  status: string | null;
  cover_url: string | null;
  description: string | null;
  gallery_urls: string[] | null;
  tipologias?: string | null;
  bono_pie?: string | number | null;
  descuento?: string | number | null;
  credito_interno?: string | number | null;
  reserva?: string | number | null;
};

const MANUAL_PROJECTS: CatalogProject[] = [
  {
    id: "gorbea-parcelas-5000",
    name: "Parcelas Gorbea 5000 m2",
    comuna: "Gorbea",
    uf_min: 703,
    uf_max: 703,
    status: "Entrega inmediata",
    cover_url: "parcelas/portada.jpg",
    description:
      "Parcelas exclusivas de 5.000 m² a minutos del Lago Villarrica, con rol y escritura, pozo de 10.000 litros, proyecto de luz/agua y cierres listos para construir. Precio $26.000.000; paga 50% al contado y 50% en 12 cuotas.",
    gallery_urls: null,
    tipologias: "Parcelas 5.000 m²",
    bono_pie: "50% al contado",
    descuento: null,
    credito_interno: "50% en 12 cuotas",
    reserva: null,
  },
];

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    console.error(`[projects] Falta configurar la variable ${name}`);
  }
  return value ?? "";
}

function toNumber(value: ProjectRow["uf_min"]) {
  if (value === null || typeof value === "undefined") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  const raw = value.toString().trim();
  if (!raw) return null;
  const compact = raw.replace(/\s+/g, "");

  let normalized: string;
  if (compact.includes(",")) {
    normalized = compact.replace(/\./g, "").replace(",", ".");
  } else if (/^\d+\.\d{1,2}$/.test(compact)) {
    normalized = compact;
  } else {
    normalized = compact.replace(/\./g, "");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchCatalog(): Promise<{
  comunas: string[];
  projects: CatalogProject[];
}> {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  const manualComunas = Array.from(
    new Set(MANUAL_PROJECTS.map((project) => project.comuna)),
  ).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

  if (!url || !key) {
    return { comunas: manualComunas, projects: [...MANUAL_PROJECTS] };
  }

  const supabase = createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });

  const comunasSet = new Set<string>();
  const comunas: string[] = [];

  const { data: comunasData } = await supabase
    .from("projects")
    .select("comuna")
    .order("comuna", { ascending: true });

  for (const row of comunasData ?? []) {
    const name = row.comuna?.trim();
    if (!name) continue;
    if (!comunasSet.has(name)) {
      comunasSet.add(name);
      comunas.push(name);
    }
  }

  const { data: projectsData } = await supabase
    .from("projects")
    .select("*")
    .order("comuna", { ascending: true })
    .order("updated_at", { ascending: false });

  const projectsList: CatalogProject[] = [];

  for (const row of projectsData ?? []) {
    if (!row.id || !row.name || !row.comuna) continue;

    const baseSlug = buildProjectSlug(row.name, row.comuna);
    const overrideName = NAME_OVERRIDES.get(baseSlug);
    const name = (overrideName ?? row.name).trim();
    const blockedSlug = buildProjectSlug(name, row.comuna);
    if (BLOCKED_SLUGS.has(blockedSlug)) continue;

    const comuna = row.comuna.trim();
    const extras = getProjectExtras(name, comuna);
    const rowAny = row as Record<string, unknown>;
    const project: CatalogProject = {
      id: row.id,
      name,
      comuna,
      uf_min: toNumber(row.uf_min),
      uf_max: toNumber(row.uf_max),
      status: row.status,
      cover_url: row.cover_url,
      description: row.description,
      gallery_urls: row.gallery_urls,
      tipologias:
        (row.tipologias as string | null) ??
        (rowAny.tipologia as string | null) ??
        (rowAny.TIPOLOGIAS as string | null) ??
        (rowAny.TIPOLOGIA as string | null) ??
        extras?.tipologias ??
        null,
      bono_pie:
        (row.bono_pie as string | number | null) ??
        (rowAny.bonoPie as string | number | null) ??
        (rowAny.BONO_PIE as string | number | null) ??
        extras?.bono_pie ??
        null,
      descuento:
        (row.descuento as string | number | null) ??
        (rowAny.DESCUENTO as string | number | null) ??
        extras?.descuento ??
        null,
      credito_interno:
        (row.credito_interno as string | number | null) ??
        (rowAny.creditoInterno as string | number | null) ??
        (rowAny.CREDITO_INTERNO as string | number | null) ??
        extras?.credito_interno ??
        null,
      reserva:
        (row.reserva as string | number | null) ??
        (rowAny.RESERVA as string | number | null) ??
        extras?.reserva ??
        null,
    };

    projectsList.push(project);
  }

  for (const project of MANUAL_PROJECTS) {
    const manualSlug = buildProjectSlug(project.name, project.comuna);
    const exists = projectsList.some(
      (item) => buildProjectSlug(item.name, item.comuna) === manualSlug,
    );
    if (exists) continue;

    projectsList.push(project);
    if (!comunasSet.has(project.comuna)) {
      comunasSet.add(project.comuna);
      comunas.push(project.comuna);
    }
  }

  comunas.sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

  return { comunas, projects: projectsList };
}

type SearchParams = Record<string, string | string[] | undefined>;

type ProjectsPageProps = {
  searchParams?: Promise<SearchParams>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseUfQuery(raw?: string) {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.includes(",")) {
    const parsed = Number(trimmed.replace(/\./g, "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }
  const parsed = Number(trimmed.replace(/\./g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const { comunas, projects } = await fetchCatalog();
  const params = (await searchParams) ?? {};
  const selectedComuna = firstParam(params.comuna)?.trim();
  const ufMinFilter = parseUfQuery(firstParam(params.ufMin));
  const ufMaxFilter = parseUfQuery(firstParam(params.ufMax));

  const filteredProjects = projects.filter((project) => {
    if (selectedComuna && project.comuna !== selectedComuna) {
      return false;
    }

    const projectMin = project.uf_min ?? project.uf_max;
    const projectMax = project.uf_max ?? project.uf_min;

    if (
      ufMinFilter !== null &&
      (projectMin === null || projectMin < ufMinFilter)
    ) {
      return false;
    }
    if (
      ufMaxFilter !== null &&
      (projectMax === null || projectMax > ufMaxFilter)
    ) {
      return false;
    }

    return true;
  });

  const hasResults = filteredProjects.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-12 flex flex-col gap-6 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-brand-gold">
            Catálogo
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-brand-navy md:text-4xl">
            Departamentos disponibles
          </h1>
          <p className="mt-3 text-sm text-brand-mute md:text-base">
            Recorre las opciones vigentes y encuentra tu próximo proyecto en
            Santiago y regiones. Información actualizada en tiempo real.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <a
            href="/projects"
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
              !selectedComuna
                ? "bg-brand-navy text-white shadow-[0_12px_28px_rgba(14,33,73,0.18)]"
                : "bg-white text-brand-navy shadow-[0_12px_28px_rgba(14,33,73,0.08)] hover:bg-brand-navy/5"
            }`}
          >
            Todas
          </a>
          {comunas.map((comuna) => {
            const isActive = selectedComuna === comuna;
            return (
              <a
                key={comuna}
                href={`/projects?comuna=${encodeURIComponent(comuna)}`}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                  isActive
                    ? "bg-brand-navy text-white shadow-[0_12px_28px_rgba(14,33,73,0.18)]"
                    : "bg-white text-brand-navy shadow-[0_12px_28px_rgba(14,33,73,0.08)] hover:bg-brand-navy/5"
                }`}
              >
                {prettifyName(comuna)}
              </a>
            );
          })}
        </div>
      </header>

      {hasResults ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="rounded-3xl border border-brand-navy/10 bg-white p-10 text-center text-brand-mute">
          No encontramos proyectos que coincidan con los filtros seleccionados.
          Ajusta la comuna o el rango de UF e inténtalo nuevamente.
        </p>
      )}
    </div>
  );
}
