import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/types/project";

// ⚠️ MOCK: reemplazar por fetch a Supabase/Typesense
const PROJECTS: Project[] = [
  {
    id: "1",
    slug: "neo-yungay-santiago",
    titulo: "Neo Yungay",
    comuna: "Santiago Centro",
    desdeUF: 2141,
    tipologias: ["1D", "2D"],
    entrega: "en_verde",
    arriendoGarantizado: true,
    creditoInterno: true,
    imagen: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    slug: "alto-nunoa",
    titulo: "Alto Ñuñoa",
    comuna: "Ñuñoa",
    desdeUF: 2950,
    tipologias: ["Studio", "1D", "2D"],
    entrega: "inmediata",
    imagen: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    slug: "providencia-hub",
    titulo: "Providencia Hub",
    comuna: "Providencia",
    desdeUF: 3320,
    tipologias: ["2D", "3D"],
    entrega: "en_blanco",
    imagen: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
  },
];

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
  const entrega = firstParam(params.entrega) as "inmediata" | "en_verde" | "en_blanco" | undefined;
  const arriendoGarantizado = firstParam(params.arriendoGarantizado);
  const view = firstParam(params.view) as "map" | undefined;

  // Filtro local con mocks. Reemplazar por query server-side luego.
  const filtered = PROJECTS.filter((p) => {
    if (comuna && p.comuna !== comuna) return false;
    if (tipologia && !p.tipologias.includes(tipologia)) return false;
    if (entrega && p.entrega !== entrega) return false;
    if (typeof ufMin !== "undefined" && ufMin !== "" && p.desdeUF < Number(ufMin)) return false;
    if (typeof ufMax !== "undefined" && ufMax !== "" && p.desdeUF > Number(ufMax)) return false;
    if (arriendoGarantizado === "1" && !p.arriendoGarantizado) return false;
    return true;
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-navy">Proyectos</h1>
          <p className="text-sm text-brand-mute">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} {comuna ? `en ${comuna}` : ""}.
            {view === "map" ? " (vista mapa disponible en la siguiente fase)" : ""}
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
          No encontramos proyectos con esos filtros. Ajusta la comuna o el rango de UF.
        </div>
      )}
    </main>
  );
}
