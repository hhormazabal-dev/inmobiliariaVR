import { createClient } from "@supabase/supabase-js";
import { FALLBACK_IMAGE_DATA } from "@/lib/fallbackImage";
import { getProjectExtras } from "@/lib/projectExtras";
import { resolveImageAsset } from "@/lib/projectAssets";
import type { Project } from "@/types/project";
import { buildProjectSlug } from "@/lib/projectSlug";

export type FeaturedTarget = {
  name: string;
  comuna: string;
  fallback: {
    desdeUF: number;
    tipologias: string[];
    entrega: Project["entrega"];
    descripcion: string;
    imagenPath?: string;
    arriendoGarantizado?: boolean;
    creditoInterno?: boolean;
  };
};

export const FEATURED_TARGETS: FeaturedTarget[] = [
  {
    name: "Sky Providencia",
    comuna: "Providencia",
    fallback: {
      desdeUF: 4320,
      tipologias: ["1D", "2D", "3D"],
      entrega: "en_blanco" as const,
      arriendoGarantizado: false,
      creditoInterno: true,
      descripcion:
        "Departamentos con vistas al Parque Metropolitano, amenities exclusivos y conectividad sobresaliente.",
      imagenPath:
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    name: "Own Ñuñoa",
    comuna: "Ñuñoa",
    fallback: {
      desdeUF: 3050,
      tipologias: ["Studio", "1D", "2D"],
      entrega: "inmediata" as const,
      arriendoGarantizado: false,
      creditoInterno: true,
      descripcion:
        "Terminaciones modernas, rooftop panorámico y espacios ideales para renta corta o primera vivienda.",
      imagenPath:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    name: "Don Claudio",
    comuna: "La Cisterna",
    fallback: {
      desdeUF: 2850,
      tipologias: ["1D", "2D"],
      entrega: "en_verde" as const,
      arriendoGarantizado: true,
      creditoInterno: true,
      descripcion:
        "Proyecto familiar con conectividad a Metro, beneficios de pie flexible y espacios comunitarios equipados.",
      imagenPath: "/RM.jpeg",
    },
  },
];

export async function fetchFeaturedProjects(): Promise<Project[]> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;

  const supabase =
    url && key
      ? createClient(url, key, {
          auth: { persistSession: false },
        })
      : null;

  const mapEntrega = (status: unknown): Project["entrega"] => {
    if (typeof status !== "string") return "en_verde";
    const normalized = status.toLowerCase();
    if (normalized.includes("inmediata")) return "inmediata";
    if (normalized.includes("blanco")) return "en_blanco";
    return "en_verde";
  };

  const results: Project[] = [];

  for (const target of FEATURED_TARGETS) {
    let project: Project | null = null;

    if (supabase) {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, comuna, uf_min, status, cover_url, description")
        .eq("name", target.name)
        .eq("comuna", target.comuna)
        .maybeSingle();

      if (!error && data) {
        const rawUf = data.uf_min;
        let ufValue: number | null = null;
        if (typeof rawUf === "number" && Number.isFinite(rawUf)) {
          ufValue = rawUf;
        } else if (typeof rawUf === "string") {
          const parsed = Number(rawUf.replace(/\./g, "").replace(",", "."));
          if (Number.isFinite(parsed)) {
            ufValue = parsed;
          }
        }

        const extras = getProjectExtras(data.name ?? "", data.comuna ?? "");
        const tipologias =
          extras?.tipologias
            ?.split(/[;,|]/)
            .map((t) => t.trim())
            .filter(Boolean) ?? target.fallback.tipologias;

        const slug = buildProjectSlug(data.name, data.comuna);
        const fallbackImage =
          resolveImageAsset(target.fallback.imagenPath) ?? undefined;
        const coverUrl = resolveImageAsset(
          typeof data.cover_url === "string" ? data.cover_url : null,
        );

        project = {
          id: (typeof data.id === "string" && data.id) || `featured-${slug}`,
          slug,
          titulo: data.name ?? target.name,
          comuna: data.comuna ?? target.comuna,
          desdeUF: ufValue ?? target.fallback.desdeUF,
          tipologias,
          entrega: mapEntrega(data.status) ?? target.fallback.entrega,
          imagen: coverUrl ?? fallbackImage ?? FALLBACK_IMAGE_DATA,
          imagenFallback: fallbackImage,
          descripcion: data.description?.trim() ?? target.fallback.descripcion,
          arriendoGarantizado: target.fallback.arriendoGarantizado,
          creditoInterno: target.fallback.creditoInterno,
        } satisfies Project;
      }
    }

    if (!project) {
      const slug = buildProjectSlug(target.name, target.comuna);
      const fallbackImage =
        resolveImageAsset(target.fallback.imagenPath) ?? undefined;
      project = {
        id: `fallback-${slug}`,
        slug,
        titulo: target.name,
        comuna: target.comuna,
        desdeUF: target.fallback.desdeUF,
        tipologias: target.fallback.tipologias,
        entrega: target.fallback.entrega,
        imagen: fallbackImage ?? FALLBACK_IMAGE_DATA,
        imagenFallback: fallbackImage,
        descripcion: target.fallback.descripcion,
        arriendoGarantizado: target.fallback.arriendoGarantizado,
        creditoInterno: target.fallback.creditoInterno,
      } satisfies Project;
    }

    results.push(project);
  }

  return results;
}
