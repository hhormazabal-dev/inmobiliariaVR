import HeroPortal from "@/components/HeroPortal";
import FeaturedProjectCard from "@/components/FeaturedProjectCard";
import BrowseByComuna from "@/components/BrowseByComuna";
import TrustStrip from "@/components/TrustStrip";
import SignaturePillars from "@/components/SignaturePillars";
import TestimonialsShowcase from "@/components/TestimonialsShowcase";
import ContactBanner from "@/components/ContactBanner";
import type { Project } from "@/types/project";
import { toPublicStorageUrl } from "@/lib/supabaseImages";
import { FALLBACK_IMAGE_DATA } from "@/lib/fallbackImage";
import { getProjectExtras } from "@/lib/projectExtras";
import { createClient } from "@supabase/supabase-js";
import AnimatedCounter from "@/components/AnimatedCounter";

function buildProjectSlug(
  name: string | null | undefined,
  comuna: string | null | undefined,
) {
  const segments = [comuna, name]
    .filter((segment): segment is string => Boolean(segment && segment.trim()))
    .map((segment) =>
      segment
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-"),
    )
    .filter(Boolean);

  const slug = segments
    .join("-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `proyecto-${Math.random().toString(36).slice(2, 8)}`;
}

function resolveImageAsset(input?: string | null) {
  if (!input) return null;
  if (/^(\/|data:)/.test(input)) {
    return input;
  }
  const fromStorage = toPublicStorageUrl(input);
  if (fromStorage) {
    return fromStorage;
  }
  if (/^https?:\/\//i.test(input)) {
    return input;
  }
  return null;
}

type FeaturedTarget = {
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

const FEATURED_TARGETS: FeaturedTarget[] = [
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
        "Departamentos con vistas al Parque Metropolitano, amenities boutique y conectividad premium.",
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

async function fetchFeaturedProjects(): Promise<Project[]> {
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

const INSIGHTS = [
  {
    categoria: "Guía 2025",
    titulo: "Cómo invertir en renta residencial con UF estabilizada",
    descripcion:
      "Revisa escenarios de dividendo versus arriendo y descubre estrategias para asegurar cashflow positivo.",
  },
  {
    categoria: "Tendencia",
    titulo: "Cinco comunas que lideran el desarrollo urbano mixto",
    descripcion:
      "Providencia, Ñuñoa y más zonas están atrayendo proyectos que mezclan vivienda, servicios y amenities premium.",
  },
  {
    categoria: "Checklist Legal",
    titulo: "Documentos clave antes de firmar promesa",
    descripcion:
      "Desde estados de pago hasta permisos de edificación. Repasamos lo que revisamos en cada proyecto recomendado.",
  },
];

export default async function HomePage() {
  const destacados = await fetchFeaturedProjects();

  return (
    <>
      {/* HERO */}
      <HeroPortal />

      {/* SECCIÓN: PROYECTOS DESTACADOS */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-12">
        <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
              Selección personalizado
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-brand-navy md:text-4xl">
              PROYECTOS SELECCIONADOS POR SU VALOR, DISEÑO Y PROYECCIÓN
            </h2>
            <p className="mt-3 text-sm text-brand-mute md:text-base">
              Te presentamos opciones con excelente ubicación, financiamiento
              flexible y respaldo profesional, para invertir o vivir con
              tranquilidad.
            </p>
          </div>
          <a
            href="/proyectos"
            className="inline-flex items-center justify-center rounded-full border border-brand-navy/15 bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(237,201,103,0.2)] transition hover:shadow-[0_22px_60px_rgba(237,201,103,0.28)]"
          >
            Explorar proyectos
          </a>
        </header>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {destacados.map((p) => (
            <FeaturedProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* FRANJA DE CONFIANZA */}
      <TrustStrip />

      {/* SECCIÓN: PROPÓSITO */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="relative overflow-hidden rounded-[48px] border border-brand-gold/25 bg-white/70 px-8 py-16 shadow-[0_36px_110px_rgba(14,33,73,0.14)] backdrop-blur-2xl md:px-20">
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-[48px] bg-[radial-gradient(140%_140%_at_-10%_-15%,rgba(237,201,103,0.22)_0%,rgba(250,242,224,0.55)_45%,rgba(255,255,255,0)_75%),radial-gradient(120%_120%_at_110%_120%,rgba(209,174,76,0.18)_0%,rgba(255,255,255,0)_55%)]" />
          <span className="pointer-events-none absolute inset-x-16 top-0 h-[3px] rounded-full bg-[linear-gradient(90deg,rgba(168,120,24,0)_0%,rgba(237,201,103,0.95)_22%,rgba(255,242,210,1)_50%,rgba(237,201,103,0.95)_78%,rgba(168,120,24,0)_100%)] [background-size:220%_100%] animate-goldenPulse" />
          <span className="pointer-events-none absolute -left-[18%] top-1/2 h-[160%] w-[55%] -translate-y-1/2 rotate-[12deg] rounded-full bg-[linear-gradient(120deg,rgba(255,245,225,0)_0%,rgba(255,250,235,0.75)_55%,rgba(255,250,235,0)_100%)] blur-3xl opacity-70" />
          <span className="pointer-events-none absolute -right-[20%] top-0 h-[150%] w-[60%] rounded-full bg-[linear-gradient(130deg,rgba(185,137,29,0)_0%,rgba(237,201,103,0.36)_45%,rgba(185,137,29,0)_100%)] blur-3xl opacity-50" />
          <div className="relative z-10 mx-auto max-w-3xl space-y-4 text-center">
            <h3 className="font-display text-[34px] font-semibold uppercase tracking-[0.12em] text-brand-navy md:text-[42px]">
              INVIERTE CON PROPÓSITO, VIVE CON ESTILO
            </h3>
            <p className="text-base font-medium tracking-[0.08em] text-brand-navy/65 md:text-lg">
              Proyectos únicos, beneficios exclusivos.
            </p>
          </div>
        </div>
      </section>

      {/* Pilares */}
      <SignaturePillars />

      {/* SECCIÓN: ESTADÍSTICAS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-[44px] border border-brand-gold/25 bg-white/70 px-8 py-12 shadow-[0_34px_90px_rgba(14,33,73,0.08)] backdrop-blur-xl md:px-16">
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-[44px] bg-[radial-gradient(120%_120%_at_0%_0%,rgba(237,201,103,0.18)_0%,rgba(255,245,228,0.42)_45%,rgba(242,232,206,0.4)_65%,rgba(247,245,238,0)_100%)]" />
          <span className="pointer-events-none absolute inset-x-10 top-0 h-[2px] rounded-full bg-[linear-gradient(90deg,rgba(168,120,24,0)_0%,rgba(237,201,103,0.85)_20%,rgba(255,236,210,0.9)_50%,rgba(237,201,103,0.85)_80%,rgba(168,120,24,0)_100%)] animate-goldenPulse" />
          <div className="relative grid gap-10 md:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)] md:items-center">
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-brand-gold/80">
                Confianza
              </p>
              <h3 className="text-2xl font-semibold text-brand-navy md:text-[32px] md:leading-[1.2]">
                Cada número representa una historia de confianza auténtica.
              </h3>
              <p className="text-sm text-brand-mute">
                Métricas que reflejan la experiencia de quienes nos eligen para
                gestionar sus inversiones y nuevos hogares.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="group relative overflow-hidden rounded-[28px] border border-white/50 bg-white/90 p-6 shadow-[0_22px_60px_rgba(14,33,73,0.07)] transition hover:-translate-y-1 hover:shadow-[0_32px_70px_rgba(14,33,73,0.09)]">
                <span className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(120%_95%_at_0%_0%,rgba(237,201,103,0.18),rgba(255,255,255,0))]" />
                <div className="relative space-y-3">
                  <AnimatedCounter
                    value={180}
                    suffix="+"
                    className="block text-4xl font-semibold text-brand-navy md:text-[42px]"
                  />
                  <p className="text-sm text-brand-mute">
                    Familias e inversionistas concretaron su proyecto con VR
                    Inmobiliaria.
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-[28px] border border-white/50 bg-white/90 p-6 shadow-[0_22px_60px_rgba(14,33,73,0.07)] transition hover:-translate-y-1 hover:shadow-[0_32px_70px_rgba(14,33,73,0.09)]">
                <span className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(120%_95%_at_0%_0%,rgba(237,201,103,0.18),rgba(255,255,255,0))]" />
                <div className="relative space-y-3">
                  <AnimatedCounter
                    value={96}
                    suffix="%"
                    className="block text-4xl font-semibold text-brand-navy md:text-[42px]"
                  />
                  <p className="text-sm text-brand-mute">
                    Califican nuestra atención como excepcional por su cercanía
                    y personalización.
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-[28px] border border-white/50 bg-white/90 p-6 shadow-[0_22px_60px_rgba(14,33,73,0.07)] transition hover:-translate-y-1 hover:shadow-[0_32px_70px_rgba(14,33,73,0.09)]">
                <span className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(120%_95%_at_0%_0%,rgba(237,201,103,0.18),rgba(255,255,255,0))]" />
                <div className="relative space-y-3">
                  <span className="flex items-baseline gap-1 text-4xl font-semibold text-brand-navy md:text-[42px]">
                    <AnimatedCounter value={24} className="leading-none" />
                    <span className="text-base font-medium uppercase tracking-[0.3em] text-brand-navy/70 md:text-lg">
                      hrs
                    </span>
                  </span>
                  <p className="text-sm text-brand-mute">
                    Tiempo máximo para recibir respuesta de un asesor
                    especializado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: EXPLORA POR COMUNA */}
      <BrowseByComuna />

      {/* Insights */}
      <section
        className="hidden mx-auto max-w-7xl px-6 py-20"
        aria-hidden="true"
      >
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
            Insights y guías
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-brand-navy md:text-4xl">
            Decisiones informadas con el Observatorio VR Inmobiliaria.
          </h2>
          <p className="mt-4 text-base text-brand-mute">
            Accede a análisis exclusivos del mercado inmobiliario de Santiago,
            pensados para inversionistas y compradores exigentes.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {INSIGHTS.map((insight) => (
            <article
              key={insight.titulo}
              className="flex h-full flex-col gap-4 rounded-3xl border border-brand-navy/10 bg-white/85 p-6 shadow-[0_18px_50px_rgba(14,33,73,0.07)] transition hover:-translate-y-1 hover:border-brand-gold/25"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                {insight.categoria}
              </span>
              <h3 className="text-lg font-semibold text-brand-navy">
                {insight.titulo}
              </h3>
              <p className="text-sm text-brand-mute">{insight.descripcion}</p>
              <button className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:opacity-80">
                Leer artículo →
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <TestimonialsShowcase />

      {/* CTA final */}
      <ContactBanner />
    </>
  );
}
