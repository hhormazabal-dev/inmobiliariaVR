import type { ReactElement } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { getProjectExtras } from "@/lib/projectExtras";
import ProjectCard from "@/components/ProjectCard";
import { buildCommuneMeta, prettifyName } from "@/lib/territoryMeta";

export const revalidate = 120;

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

type CatalogProject = {
  id: string;
  name: string;
  comuna: string;
  uf_min: number | null;
  uf_max: number | null;
  status: string | null;
  cover_url: string | null;
  description: string | null;
  gallery_urls: string[] | null;
  tipologias: string | null;
  bono_pie: string | number | null;
  descuento: string | number | null;
  credito_interno: string | number | null;
  reserva: string | number | null;
};

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

async function fetchCatalog() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !key) {
    return { comunas: [], grouped: new Map<string, CatalogProject[]>() };
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

  const grouped = new Map<string, CatalogProject[]>();

  for (const row of projectsData ?? []) {
    if (!row.id || !row.name || !row.comuna) continue;

    const comuna = row.comuna.trim();
    const extras = getProjectExtras(row.name.trim(), comuna);
    const rowAny = row as Record<string, unknown>;
    const project: CatalogProject = {
      id: row.id,
      name: row.name.trim(),
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

    if (!grouped.has(comuna)) {
      grouped.set(comuna, []);
    }
    grouped.get(comuna)!.push(project);
  }

  return { comunas, grouped };
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
  const { comunas, grouped } = await fetchCatalog();
  const params = (await searchParams) ?? {};
  const selectedComuna = firstParam(params.comuna)?.trim();
  const ufMinFilter = parseUfQuery(firstParam(params.ufMin));
  const ufMaxFilter = parseUfQuery(firstParam(params.ufMax));

  const filteredComunas =
    selectedComuna && comunas.includes(selectedComuna)
      ? comunas.filter((name) => name === selectedComuna)
      : comunas;

  let hasResults = false;

  const sections = filteredComunas
    .map((comuna, index) => {
      const projects = grouped.get(comuna) ?? [];
      const filteredProjects = projects.filter((project) => {
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

      if (filteredProjects.length === 0) {
        return null;
      }

      hasResults = true;
      const meta = buildCommuneMeta(comuna, index);
      const displayName = meta.displayName ?? prettifyName(comuna);

      return (
        <section
          key={comuna}
          className="relative overflow-hidden rounded-[44px] border border-white/45 bg-white/10 shadow-[0_32px_90px_rgba(14,33,73,0.16)] backdrop-blur-md"
        >
          <div className="absolute inset-0">
            <Image
              src={meta.image}
              alt={displayName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 60vw"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b1633]/82 via-[#10234c]/55 to-[#081427]/82" />
          </div>
          <div className="relative space-y-8 px-6 py-10 md:px-12 md:py-12">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3 text-white">
                <span className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
                  Comuna
                </span>
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight md:text-[34px]">
                    {displayName}
                  </h2>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.32em] text-white/65">
                    {meta.highlight}
                  </p>
                </div>
                <p className="max-w-xl text-sm text-white/85 md:text-base">
                  {meta.detail}
                </p>
              </div>
              <div className="self-start rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/75">
                {filteredProjects.length} proyecto
                {filteredProjects.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="rounded-[34px] border border-white/25 bg-white/82 p-6 shadow-[0_26px_80px_rgba(14,33,73,0.12)] backdrop-blur-xl">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    })
    .filter((section): section is ReactElement => Boolean(section));

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-16 space-y-4 text-center md:space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.45em] text-brand-gold">
          Catálogo
        </p>
        <h1 className="font-display text-3xl font-semibold text-brand-navy md:text-4xl">
          Proyectos disponibles por comuna
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-brand-mute md:text-base">
          Explora los proyectos activos y descubre las oportunidades más
          recientes en cada zona. Actualizamos esta información de forma
          recurrente.
        </p>
      </header>

      <div className="space-y-16">
        {hasResults ? (
          sections
        ) : (
          <p className="rounded-3xl border border-brand-navy/10 bg-white/70 p-10 text-center text-brand-mute">
            No encontramos proyectos que coincidan con los filtros
            seleccionados. Ajusta la comuna o el rango de UF e inténtalo
            nuevamente.
          </p>
        )}
      </div>
    </div>
  );
}
