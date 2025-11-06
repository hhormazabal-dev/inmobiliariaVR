import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { FALLBACK_IMAGE_DATA } from "@/lib/fallbackImage";
import { getProjectExtras } from "@/lib/projectExtras";
import { FEATURED_TARGETS } from "@/lib/featuredProjects";
import type { FeaturedTarget } from "@/lib/featuredProjects";
import { resolveImageAsset } from "@/lib/projectAssets";
import { buildProjectSlug } from "@/lib/projectSlug";
import type { Project } from "@/types/project";

export const revalidate = 180;

type PageParams = { slug: string };
type PageProps = {
  params: Promise<PageParams>;
};

type ProjectDetail = {
  id: string;
  slug: string;
  name: string;
  comuna: string;
  entrega: Project["entrega"];
  descripcion: string;
  cover: string;
  gallery: string[];
  tipologias: string[];
  ufMin: number | null;
  ufMax: number | null;
  bonoPie?: string | null;
  descuento?: string | null;
  creditoInternoInfo?: string | null;
  reserva?: string | null;
  arriendoGarantizado?: boolean;
  creditoInternoBadge?: boolean;
};

type ProjectRow = {
  id: string | number | null;
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

function formatUf(value: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return `UF ${new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;
}

function formatBenefit(value: string | number | null | undefined) {
  if (value === null || typeof value === "undefined") return null;

  if (typeof value === "number" && Number.isFinite(value)) {
    const percent = value > 1 ? value : value * 100;
    const formatted =
      percent % 1 === 0 ? percent.toFixed(0) : percent.toFixed(1);
    return `${formatted}%`;
  }

  const raw = value.toString().trim();
  if (!raw) return null;

  const normalized = raw.toLowerCase();
  if (normalized === "si" || normalized === "sí") {
    return "Disponible";
  }
  if (normalized === "no") {
    return "No disponible";
  }
  if (normalized === "consultar") {
    return "Consultar";
  }

  const numeric = Number(
    raw.replace(/\./g, "").replace(",", ".").replace(/%/g, ""),
  );
  if (Number.isFinite(numeric)) {
    const percent = numeric > 1 ? numeric : numeric * 100;
    const formatted =
      percent % 1 === 0 ? percent.toFixed(0) : percent.toFixed(1);
    return `${formatted}%`;
  }

  return raw;
}

function formatReserva(value: string | number | null | undefined) {
  if (value === null || typeof value === "undefined") return null;
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(value);
  }

  const raw = value.toString().trim();
  if (!raw) return null;

  const compact = raw.replace(/\s+/g, "");
  let normalized = compact;
  if (compact.includes(",")) {
    normalized = compact.replace(/\./g, "").replace(",", ".");
  } else if (/^\d+\.\d+$/.test(compact)) {
    normalized = compact;
  } else {
    normalized = compact.replace(/\./g, "");
  }

  const numeric = Number(normalized);
  if (Number.isFinite(numeric)) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(numeric);
  }

  return raw;
}

function parseTipologias(input?: string | null) {
  if (!input) return [];
  return input
    .split(/[;,|]/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function mapEntrega(status: unknown): Project["entrega"] {
  if (typeof status !== "string") return "en_verde";
  const normalized = status.toLowerCase();
  if (normalized.includes("inmediata")) return "inmediata";
  if (normalized.includes("blanco")) return "en_blanco";
  return "en_verde";
}

function imageOrFallback(value?: string | null, fallback?: string | null) {
  return (
    resolveImageAsset(value) ??
    resolveImageAsset(fallback) ??
    FALLBACK_IMAGE_DATA
  );
}

function composeGallery(
  cover: string,
  gallery?: string[] | null,
  fallback?: string | null,
) {
  const images = new Set<string>();
  if (cover) images.add(cover);
  for (const entry of gallery ?? []) {
    const resolved = resolveImageAsset(entry);
    if (resolved) images.add(resolved);
  }
  if (fallback) {
    const resolvedFallback = resolveImageAsset(fallback);
    if (resolvedFallback) images.add(resolvedFallback);
  }
  if (images.size === 0) {
    images.add(FALLBACK_IMAGE_DATA);
  }
  return Array.from(images);
}

function projectFromTarget(slug: string, target: FeaturedTarget) {
  const cover = imageOrFallback(target.fallback.imagenPath);
  return {
    id: `fallback-${slug}`,
    slug,
    name: target.name,
    comuna: target.comuna,
    entrega: target.fallback.entrega,
    descripcion: target.fallback.descripcion,
    cover,
    gallery: composeGallery(cover, undefined, target.fallback.imagenPath),
    tipologias: target.fallback.tipologias,
    ufMin: target.fallback.desdeUF,
    ufMax: null,
    bonoPie: null,
    descuento: null,
    creditoInternoInfo: null,
    reserva: null,
    arriendoGarantizado: target.fallback.arriendoGarantizado,
    creditoInternoBadge: target.fallback.creditoInterno,
  } satisfies ProjectDetail;
}

async function fetchProjectDetail(slug: string): Promise<ProjectDetail | null> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;

  const supabase =
    url && key
      ? createClient(url, key, { auth: { persistSession: false } })
      : null;

  let detail: ProjectDetail | null = null;
  const featuredSlugMatch = FEATURED_TARGETS.find(
    (target) => buildProjectSlug(target.name, target.comuna) === slug,
  );

  if (supabase) {
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, name, comuna, uf_min, uf_max, status, cover_url, description, gallery_urls, tipologias, bono_pie, descuento, credito_interno, reserva",
      )
      .order("updated_at", { ascending: false });

    if (!error) {
      for (const row of data ?? []) {
        const computedSlug = buildProjectSlug(row.name, row.comuna);
        if (computedSlug !== slug) continue;

        const extras = getProjectExtras(row.name ?? "", row.comuna ?? "");
        const fallbackTarget = FEATURED_TARGETS.find(
          (target) => target.name === row.name && target.comuna === row.comuna,
        );
        const cover = imageOrFallback(
          row.cover_url,
          fallbackTarget?.fallback.imagenPath,
        );
        const gallery = composeGallery(
          cover,
          row.gallery_urls,
          fallbackTarget?.fallback.imagenPath,
        );

        const ufMin =
          toNumber(row.uf_min) ?? fallbackTarget?.fallback.desdeUF ?? null;
        const ufMax = toNumber(row.uf_max);
        const descripcion =
          row.description?.trim() ?? fallbackTarget?.fallback.descripcion ?? "";

        const tipologias = parseTipologias(row.tipologias);
        const extraTipologias = parseTipologias(extras?.tipologias);
        const enrichedTipologias =
          tipologias.length > 0
            ? tipologias
            : extraTipologias.length > 0
              ? extraTipologias
              : (fallbackTarget?.fallback.tipologias ?? []);

        detail = {
          id:
            (typeof row.id === "string" && row.id) ||
            (typeof row.id === "number" ? String(row.id) : `project-${slug}`),
          slug,
          name: row.name ?? fallbackTarget?.name ?? "Proyecto destacado",
          comuna: row.comuna ?? fallbackTarget?.comuna ?? "",
          entrega:
            mapEntrega(row.status) ??
            fallbackTarget?.fallback.entrega ??
            "en_verde",
          descripcion,
          cover,
          gallery,
          tipologias: enrichedTipologias,
          ufMin,
          ufMax,
          bonoPie: formatBenefit(row.bono_pie ?? extras?.bono_pie ?? null),
          descuento: formatBenefit(row.descuento ?? extras?.descuento ?? null),
          creditoInternoInfo: formatBenefit(
            row.credito_interno ?? extras?.credito_interno ?? null,
          ),
          reserva: formatReserva(row.reserva ?? extras?.reserva ?? null),
          arriendoGarantizado: fallbackTarget?.fallback.arriendoGarantizado,
          creditoInternoBadge:
            fallbackTarget?.fallback.creditoInterno ||
            Boolean(
              formatBenefit(
                row.credito_interno ?? extras?.credito_interno ?? null,
              ),
            ),
        };
        break;
      }
    }
  }

  if (!detail && featuredSlugMatch) {
    const fallback = projectFromTarget(slug, featuredSlugMatch);
    if (fallback) {
      detail = fallback;
    }
  }

  return detail;
}

export async function generateStaticParams() {
  return FEATURED_TARGETS.map((target) => ({
    slug: buildProjectSlug(target.name, target.comuna),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProjectDetail(slug);
  if (!project) {
    return {
      title: "Proyecto no encontrado",
    };
  }

  return {
    title: `${project.name} en ${project.comuna} · VR Inmobiliaria`,
    description: project.descripcion.slice(0, 160),
    openGraph: {
      title: `${project.name} · VR Inmobiliaria`,
      description: project.descripcion,
      images: project.gallery.slice(0, 3).map((url) => ({
        url,
      })),
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await fetchProjectDetail(slug);
  if (!project) {
    notFound();
  }

  const primaryImage = project.gallery[0] ?? project.cover;
  const secondaryImages = project.gallery.slice(1);
  const primaryRequiresUnoptimized = primaryImage.startsWith("data:");
  const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const waText = `Hola, me interesa ${project.name} (${project.comuna}). ¿Podemos coordinar una asesoría?`;
  const waHref = waPhone
    ? `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`
    : null;
  const calLink =
    process.env.NEXT_PUBLIC_CAL_LINK ||
    "https://cal.com/tu-org/visita-proyecto";

  const priceLabel = (() => {
    const min = formatUf(project.ufMin);
    const max = formatUf(project.ufMax);
    if (min && max) {
      return `${min} – ${max}`;
    }
    if (min) return min;
    if (max) return max;
    return "Consulta precio";
  })();

  const highlights: { label: string; value: string }[] = [];
  if (project.bonoPie)
    highlights.push({ label: "Bono pie", value: project.bonoPie });
  if (project.descuento)
    highlights.push({ label: "Descuento", value: project.descuento });
  if (project.creditoInternoInfo)
    highlights.push({
      label: "Crédito interno",
      value: project.creditoInternoInfo,
    });
  if (project.reserva)
    highlights.push({ label: "Reserva", value: project.reserva });

  return (
    <div className="bg-[#f8f3ea] pb-16 pt-8">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          href="/proyectos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:opacity-80"
        >
          ← Volver a proyectos
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)] lg:items-start">
          <div>
            <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/70 shadow-[0_24px_80px_rgba(14,33,73,0.14)]">
              <div className="relative h-72 w-full overflow-hidden rounded-[36px] bg-brand-sand/40 sm:h-[420px]">
                <Image
                  src={primaryImage}
                  alt={project.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  unoptimized={primaryRequiresUnoptimized}
                />
              </div>
            </div>

            {secondaryImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {secondaryImages.slice(0, 6).map((image, idx) => (
                  <div
                    key={`${image}-${idx}`}
                    className="relative h-32 overflow-hidden rounded-2xl border border-white/60 bg-white/80"
                  >
                    <Image
                      src={image}
                      alt={`${project.name} imagen ${idx + 2}`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover"
                      unoptimized={image.startsWith("data:")}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-6 rounded-[36px] border border-white/60 bg-white/85 p-8 shadow-[0_26px_80px_rgba(14,33,73,0.12)] backdrop-blur-sm">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-brand-gold">
                Proyecto destacado
              </p>
              <h1 className="font-display text-3xl font-semibold text-brand-navy">
                {project.name}
              </h1>
              <p className="text-sm text-brand-mute">
                {project.comuna} ·{" "}
                {project.tipologias.length > 0
                  ? project.tipologias.join(" / ")
                  : "Tipologías a consultar"}
              </p>

              <div className="mt-2 inline-flex max-w-fit items-center gap-2 rounded-full border border-brand-navy/15 bg-brand-sand/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand-navy/70">
                {project.entrega === "inmediata"
                  ? "Entrega inmediata"
                  : project.entrega === "en_blanco"
                    ? "En blanco"
                    : "En verde"}
              </div>

              <div className="mt-4 rounded-3xl border border-brand-navy/10 bg-white px-4 py-3 text-brand-navy shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-navy/60">
                  Desde
                </p>
                <p className="mt-1 text-2xl font-semibold">{priceLabel}</p>
              </div>
            </div>

            {highlights.length > 0 && (
              <div className="space-y-3 rounded-3xl bg-brand-sand/60 p-4 text-sm text-brand-navy">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="font-medium text-brand-navy/70">
                      {item.label}
                    </span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={calLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(237,201,103,0.22)] transition hover:shadow-[0_22px_60px_rgba(237,201,103,0.28)]"
              >
                Agendar asesoría
              </a>

              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-4 py-2 text-sm font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </aside>
        </div>

        <section className="mt-10 rounded-[36px] border border-white/60 bg-white/85 p-8 shadow-[0_24px_70px_rgba(14,33,73,0.08)] backdrop-blur-sm">
          <h2 className="font-display text-2xl font-semibold text-brand-navy">
            Vive la experiencia {project.name}
          </h2>
          <p className="mt-3 text-base text-brand-mute">
            {project.descripcion}
          </p>

          {project.tipologias.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-navy/60">
                Tipologías disponibles
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tipologias.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-brand-navy/15 bg-brand-sand/50 px-3 py-1 text-sm font-medium text-brand-navy/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(project.arriendoGarantizado || project.creditoInternoBadge) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {project.arriendoGarantizado && (
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-navy/15 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">
                  Arriendo garantizado
                </span>
              )}
              {project.creditoInternoBadge && (
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-navy/15 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">
                  Crédito interno
                </span>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
