import { createClient } from "@supabase/supabase-js";
import { FALLBACK_IMAGE_DATA } from "@/lib/fallbackImage";
import { getProjectExtras } from "@/lib/projectExtras";
import { buildProjectSlug } from "@/lib/projectSlug";
import { resolveImageAsset } from "@/lib/projectAssets";
import type { Project } from "@/types/project";
import FeaturedProjectCard from "@/components/FeaturedProjectCard";

type ShowcaseTarget = {
  name: string;
  comuna: string;
  fallback: {
    descripcion: string;
    tipologias: string[];
    desdeUF: number;
    entrega: Project["entrega"];
    arriendoGarantizado?: boolean;
    creditoInterno?: boolean;
    imagen?: string;
  };
};

const SHOWCASE_TARGETS: ShowcaseTarget[] = [
  {
    name: "Carvajal",
    comuna: "La Cisterna",
    fallback: {
      descripcion:
        "Departamentos de autor con subsidio DS19 y terminaciones cálidas para familias emergentes.",
      tipologias: ["1D", "2D"],
      desdeUF: 2600,
      entrega: "en_verde",
      creditoInterno: true,
      imagen: "la-cisterna/carvajal/portada.jpg",
    },
  },
  {
    name: "Plaza Quilicura",
    comuna: "Quilicura",
    fallback: {
      descripcion:
        "Condominio conectado a polos industriales y a la futura Línea 3. Ideal para renta segura.",
      tipologias: ["2D", "3D"],
      desdeUF: 2300,
      entrega: "en_verde",
      creditoInterno: true,
    },
  },
  {
    name: "Urban La Florida",
    comuna: "La Florida",
    fallback: {
      descripcion:
        "Programa mixto de oficinas, locales y viviendas junto a Vespucio Sur y Mall Plaza.",
      tipologias: ["Studio", "1D", "2D"],
      desdeUF: 2700,
      entrega: "en_blanco",
      arriendoGarantizado: false,
      creditoInterno: true,
    },
  },
  {
    name: "Mood",
    comuna: "Ñuñoa",
    fallback: {
      descripcion:
        "Amenities completos, rooftop y unidades compactas pensadas para arriendo flexible o primera vivienda.",
      tipologias: ["Studio", "1D", "2D"],
      desdeUF: 3100,
      entrega: "en_verde",
      imagen:
        "https://twixglfzfcdtwklpstvr.supabase.co/storage/v1/object/public/projects/nunoa/mood/portada.jpg",
    },
  },
  {
    name: "Liverpool",
    comuna: "La Florida",
    fallback: {
      descripcion:
        "Edificio compacto cercano a Metro Macul con programas de 1 a 3 dormitorios.",
      tipologias: ["1D", "2D", "3D"],
      desdeUF: 2550,
      entrega: "en_verde",
      creditoInterno: true,
    },
  },
  {
    name: "Conecta Huechuraba",
    comuna: "Huechuraba",
    fallback: {
      descripcion:
        "Proyecto corporativo-residencial en Ciudad Empresarial, perfecto para renta estable.",
      tipologias: ["Studio", "1D", "2D"],
      desdeUF: 2950,
      entrega: "en_verde",
      arriendoGarantizado: true,
      imagen: "supabase:conecta-huechuraba/cover.jpg",
    },
  },
];

async function fetchShowcaseProjects(): Promise<Project[]> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;

  const client =
    url && key
      ? createClient(url, key, { auth: { persistSession: false } })
      : null;

  const mapEntrega = (value: unknown): Project["entrega"] => {
    if (typeof value !== "string") return "en_verde";
    const normalized = value.toLowerCase();
    if (normalized.includes("inmediata")) return "inmediata";
    if (normalized.includes("blanco")) return "en_blanco";
    return "en_verde";
  };

  const projects: Project[] = [];

  for (const target of SHOWCASE_TARGETS) {
    let project: Project | null = null;

    if (client) {
      const { data } = await client
        .from("projects")
        .select("id,name,comuna,uf_min,status,cover_url,description")
        .eq("name", target.name)
        .eq("comuna", target.comuna)
        .maybeSingle();

      if (data) {
        const extras = getProjectExtras(data.name ?? "", data.comuna ?? "");
        const tipologias =
          extras?.tipologias
            ?.split(/[;,|]/)
            .map((t) => t.trim())
            .filter(Boolean) ?? target.fallback.tipologias;
        const slug = buildProjectSlug(data.name, data.comuna);
        const resolvedCover =
          resolveImageAsset(data.cover_url) ??
          resolveImageAsset(target.fallback.imagen) ??
          FALLBACK_IMAGE_DATA;

        const ufMin =
          typeof data.uf_min === "number"
            ? data.uf_min
            : Number(
                typeof data.uf_min === "string"
                  ? data.uf_min.replace(/\./g, "").replace(",", ".")
                  : NaN,
              );

        project = {
          id: data.id ?? `showcase-${slug}`,
          slug,
          titulo: data.name ?? target.name,
          comuna: data.comuna ?? target.comuna,
          desdeUF: Number.isFinite(ufMin) ? ufMin : target.fallback.desdeUF,
          tipologias,
          entrega: mapEntrega(data.status) ?? target.fallback.entrega,
          arriendoGarantizado: target.fallback.arriendoGarantizado,
          creditoInterno: target.fallback.creditoInterno,
          descripcion: data.description?.trim() ?? target.fallback.descripcion,
          imagen: resolvedCover,
          imagenFallback: resolveImageAsset(target.fallback.imagen),
        };
      }
    }

    if (!project) {
      const slug = buildProjectSlug(target.name, target.comuna);
      project = {
        id: `showcase-${slug}`,
        slug,
        titulo: target.name,
        comuna: target.comuna,
        desdeUF: target.fallback.desdeUF,
        tipologias: target.fallback.tipologias,
        entrega: target.fallback.entrega,
        arriendoGarantizado: target.fallback.arriendoGarantizado,
        creditoInterno: target.fallback.creditoInterno,
        descripcion: target.fallback.descripcion,
        imagen:
          resolveImageAsset(target.fallback.imagen) ?? FALLBACK_IMAGE_DATA,
        imagenFallback: resolveImageAsset(target.fallback.imagen),
      };
    }

    projects.push(project);
  }

  return projects;
}

export default async function BrowseByComuna() {
  const projects = await fetchShowcaseProjects();

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="relative mx-auto mt-16 max-w-6xl overflow-hidden rounded-[28px] px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(237,201,103,0.16),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(14,33,73,0.14),transparent_60%)]" />
      <header className="relative mb-10 space-y-3 text-center md:space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-gold">
          Proyectos destacados
        </p>
        <h2 className="font-display text-[28px] font-semibold text-brand-navy md:text-[34px]">
          Vive donde crece tu estilo de vida.
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-brand-mute md:text-base">
          Seleccionamos lanzamientos reales desde nuestras carpetas en Supabase
          para que explores rápido qué inmobiliaria y comuna se ajusta a tu
          estrategia.
        </p>
      </header>

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <FeaturedProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
