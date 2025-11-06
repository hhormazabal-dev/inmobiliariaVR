"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import SafeImage from "@/components/SafeImage";
import { FALLBACK_IMAGE_DATA } from "@/lib/fallbackImage";
import { toPublicStorageUrl } from "@/lib/supabaseImages";
import { listProjectImages } from "@/lib/gallery";

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

const FALLBACK_COVER = FALLBACK_IMAGE_DATA;

function resolveCoverUrl(coverUrl: string | null | undefined): string {
  return toPublicStorageUrl(coverUrl) ?? FALLBACK_COVER;
}

function formatUf(value: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "UF —";
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

function formatBenefitSentence(label: string, value: string | null) {
  if (!value) return null;
  const lower = value.toLowerCase();
  if (lower === "disponible") {
    return `${label} disponible`;
  }
  if (lower === "no disponible") {
    return `${label} no disponible`;
  }
  if (lower === "consultar") {
    return `${label}: consultar`;
  }
  return `${label} ${value}`;
}

function formatList(items: string[], conjunction = "y") {
  const filtered = items.filter((item) => item && item.trim().length > 0);
  if (filtered.length === 0) return "";
  if (filtered.length === 1) return filtered[0]!;
  if (filtered.length === 2) {
    return `${filtered[0]} ${conjunction} ${filtered[1]}`;
  }
  const head = filtered.slice(0, -1).join(", ");
  const tail = filtered[filtered.length - 1];
  return `${head} ${conjunction} ${tail}`;
}

function buildRangeLabel(
  numbers: Set<number>,
  singular: string,
  plural: string,
) {
  const values = Array.from(numbers).filter((n) => Number.isFinite(n));
  if (values.length === 0) return null;
  values.sort((a, b) => a - b);
  const first = values[0];
  const last = values[values.length - 1];
  if (first === last) {
    return `${first} ${first === 1 ? singular : plural}`;
  }
  return `${first} - ${last} ${plural}`;
}

type TipologiaInfo = {
  dormitorios?: string | null;
  banos?: string | null;
  extras: string[];
  raw: string;
};

function parseTipologias(value: string | null | undefined): TipologiaInfo {
  if (!value) {
    return { raw: "", extras: [] };
  }

  const cleanOriginal = value.replace(/\s+/g, " ").trim();
  const normalized = cleanOriginal
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[•·]/g, " ")
    .toUpperCase();

  const dormNumbers = new Set<number>();
  const bathNumbers = new Set<number>();
  const extras = new Set<string>();

  if (/\bSTUDIO\S*\b/.test(normalized)) {
    extras.add("Studios");
  }
  if (/\bLOFTS?\b/.test(normalized)) {
    extras.add("Lofts");
  }
  if (/\bDUPLEX\b/.test(normalized)) {
    extras.add("Dúplex");
  }
  if (/\bOF\b|\bLOCALES\b|\bOFICINAS\b/.test(normalized)) {
    extras.add("Locales / Oficinas");
  }

  const dormMatches = normalized.matchAll(
    /((?:\d+\s*(?:[-Y\/]\s*)?)+)\s*(?:D(?:\b|$)|DORMS?|DORMITORIOS?)/g,
  );
  for (const match of dormMatches) {
    const digits = match[1]?.match(/\d+/g);
    if (digits) {
      digits.map(Number).forEach((n) => dormNumbers.add(n));
    }
  }

  const bathMatches = normalized.matchAll(
    /((?:\d+\s*(?:[-Y\/]\s*)?)+)\s*(?:B(?:\b|$)|BANOS?|BAÑOS?)/g,
  );
  for (const match of bathMatches) {
    const digits = match[1]?.match(/\d+/g);
    if (digits) {
      digits.map(Number).forEach((n) => bathNumbers.add(n));
    }
  }

  const dormitorios = buildRangeLabel(dormNumbers, "dormitorio", "dormitorios");
  const banos = buildRangeLabel(bathNumbers, "baño", "baños");

  return {
    dormitorios,
    banos,
    extras: Array.from(extras),
    raw: cleanOriginal,
  };
}

type CardHighlightArgs = {
  tipologias: TipologiaInfo;
  bonoPie: string | null;
  descuento: string | null;
  creditoInterno: string | null;
  reserva: string | null;
  priceRange: string | null;
};

function buildCardHighlights({
  tipologias,
  bonoPie,
  descuento,
  creditoInterno,
  reserva,
  priceRange,
}: CardHighlightArgs) {
  const highlights: string[] = [];

  const distributionParts: string[] = [];
  if (tipologias.dormitorios) {
    distributionParts.push(tipologias.dormitorios);
  }
  if (tipologias.banos) {
    distributionParts.push(tipologias.banos);
  }
  if (tipologias.extras.length > 0) {
    const extrasList = formatList(tipologias.extras);
    distributionParts.push(`variantes ${extrasList.toLowerCase()}`);
  } else if (!tipologias.dormitorios && !tipologias.banos && tipologias.raw) {
    distributionParts.push(tipologias.raw);
  }
  if (distributionParts.length > 0) {
    highlights.push(`Distribuciones: ${formatList(distributionParts)}.`);
  }

  const financingParts: string[] = [];
  if (bonoPie) financingParts.push(`bono pie ${bonoPie.toLowerCase()}`);
  if (creditoInterno) {
    financingParts.push(`crédito interno ${creditoInterno.toLowerCase()}`);
  }
  if (descuento) financingParts.push(`descuento ${descuento.toLowerCase()}`);
  if (reserva) financingParts.push(`reserva referencial ${reserva}`);

  if (financingParts.length > 0) {
    highlights.push(`Financiamiento: ${formatList(financingParts)}.`);
  }

  if (priceRange) {
    highlights.push(`Valores referenciales ${priceRange}.`);
  }

  return highlights.slice(0, 3);
}

type Props = {
  project: CatalogProject;
};

export default function ProjectCard({ project }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      setGalleryOpen(false);
      setGalleryIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (galleryOpen) {
          setGalleryOpen(false);
          return;
        }
        closeModal();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, galleryOpen, closeModal]);
  const coverSrc = useMemo(
    () => resolveCoverUrl(project.cover_url),
    [project.cover_url],
  );

  const initialGallery = useMemo(() => {
    const raw = [project.cover_url, ...(project.gallery_urls ?? [])];
    const urls = raw
      .map((item) => toPublicStorageUrl(item))
      .filter((url): url is string => Boolean(url));
    const unique = Array.from(new Set([coverSrc, ...urls]));
    return unique.length > 0 ? unique : [coverSrc];
  }, [coverSrc, project.cover_url, project.gallery_urls]);

  const [galleryImages, setGalleryImages] = useState<string[]>(initialGallery);

  useEffect(() => {
    setGalleryImages(initialGallery);
  }, [initialGallery]);

  useEffect(() => {
    if (!open) return;
    let active = true;

    async function loadGallery() {
      try {
        const urls = await listProjectImages(
          project.name,
          project.cover_url ?? undefined,
          project.comuna,
        );
        const normalized = (urls ?? [])
          .map((url) => toPublicStorageUrl(url))
          .filter((url): url is string => Boolean(url));
        const merged = Array.from(new Set([...initialGallery, ...normalized]));
        if (active && merged.length > 0) {
          setGalleryImages(merged);
        }
      } catch (error) {
        console.error("[ProjectCard] Error cargando galería:", error);
      }
    }

    loadGallery();
    return () => {
      active = false;
    };
  }, [open, project.name, project.cover_url, project.comuna, initialGallery]);

  const rawStatus = project.status?.trim();
  const normalizedStatus = rawStatus?.toLowerCase() ?? null;
  const statusLabel = (() => {
    if (normalizedStatus) {
      if (normalizedStatus.includes("inmediata")) return "Entrega inmediata";
      if (normalizedStatus.includes("dispon")) return "Entrega inmediata";
      if (
        normalizedStatus.includes("próxim") ||
        normalizedStatus.includes("proxim")
      ) {
        return "Próximamente";
      }
      return rawStatus ?? "Entrega inmediata";
    }
    return project.uf_min ? "Entrega inmediata" : "Próximamente";
  })();
  const priceRange =
    project.uf_min && project.uf_max && project.uf_max > project.uf_min
      ? `${formatUf(project.uf_min)} - ${formatUf(project.uf_max)}`
      : formatUf(project.uf_min);
  const tipologiaInfo = parseTipologias(project.tipologias);
  const bonoPie = formatBenefit(project.bono_pie);
  const descuento = formatBenefit(project.descuento);
  const creditoInterno = formatBenefit(project.credito_interno);
  const reserva = formatReserva(project.reserva);

  const benefitSentences = [
    formatBenefitSentence("Te apoyamos con el pie", bonoPie),
    formatBenefitSentence("Descuento", descuento),
    formatBenefitSentence("Crédito interno", creditoInterno),
    reserva ? `Reserva desde ${reserva}` : null,
  ].filter((item): item is string => Boolean(item));

  const fallbackSummaryParts = [
    tipologiaInfo.dormitorios,
    tipologiaInfo.banos,
    ...tipologiaInfo.extras,
    ...benefitSentences,
  ].filter((item): item is string => Boolean(item));

  const description = project.description?.trim();
  const summary =
    description ||
    (fallbackSummaryParts.length > 0
      ? fallbackSummaryParts.join(" • ")
      : "Pronto agregaremos más información para este proyecto.");
  const modalSummary = description;
  const hasPriceInfo =
    (typeof project.uf_min === "number" && Number.isFinite(project.uf_min)) ||
    (typeof project.uf_max === "number" && Number.isFinite(project.uf_max));
  const cardHighlights = buildCardHighlights({
    tipologias: tipologiaInfo,
    bonoPie,
    descuento,
    creditoInterno,
    reserva,
    priceRange: hasPriceInfo ? priceRange : null,
  });
  const totalGallery = galleryImages.length;
  const displayedGallery = galleryImages.slice(0, 6);
  const extraGallery = Math.max(totalGallery - displayedGallery.length, 0);
  const currentGalleryImage =
    galleryImages[galleryIndex] ?? galleryImages[0] ?? coverSrc;
  const closeGallery = useCallback(() => setGalleryOpen(false), []);
  const openGalleryAt = useCallback(
    (index: number) => {
      if (totalGallery === 0) return;
      setGalleryIndex(index);
      setGalleryOpen(true);
    },
    [totalGallery],
  );
  const goNextImage = useCallback(() => {
    if (totalGallery < 2) return;
    setGalleryIndex((prev) => (prev + 1) % totalGallery);
  }, [totalGallery]);
  const goPrevImage = useCallback(() => {
    if (totalGallery < 2) return;
    setGalleryIndex((prev) => (prev - 1 + totalGallery) % totalGallery);
  }, [totalGallery]);
  useEffect(() => {
    if (!galleryOpen) return;
    const handleArrows = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNextImage();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevImage();
      }
    };
    window.addEventListener("keydown", handleArrows);
    return () => window.removeEventListener("keydown", handleArrows);
  }, [galleryOpen, goNextImage, goPrevImage]);
  const calLink =
    process.env.NEXT_PUBLIC_CAL_LINK ||
    "https://cal.com/tu-org/visita-proyecto";
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "mtbollmann@vreyes.cl";

  const infoBadges = [
    tipologiaInfo.dormitorios && {
      label: "Dormitorios",
      value: tipologiaInfo.dormitorios,
    },
    tipologiaInfo.banos && { label: "Baños", value: tipologiaInfo.banos },
    ...tipologiaInfo.extras.map((extra) => ({
      label: "Tipologías",
      value: extra,
    })),
    !tipologiaInfo.dormitorios &&
      !tipologiaInfo.banos &&
      tipologiaInfo.extras.length === 0 &&
      tipologiaInfo.raw && {
        label: "Tipologías",
        value: tipologiaInfo.raw,
      },
    bonoPie && { label: "Te apoyamos con el pie", value: bonoPie },
    descuento && { label: "Descuento", value: descuento },
    creditoInterno && { label: "Crédito interno", value: creditoInterno },
    reserva && { label: "Reserva", value: reserva },
  ].filter(
    (
      item,
    ): item is {
      label: string;
      value: string;
    } =>
      typeof item === "object" &&
      item !== null &&
      "value" in item &&
      typeof item.value === "string" &&
      item.value.trim().length > 0,
  );

  const modalContent =
    mounted && open
      ? createPortal(
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-white/20 backdrop-blur-md p-4"
            role="dialog"
            aria-modal="true"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-[0_40px_110px_rgba(14,33,73,0.2)] backdrop-blur-xl">
              <div className="relative h-60 w-full overflow-hidden bg-brand-sand/80">
                <SafeImage
                  src={coverSrc}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                <span className="absolute left-6 top-6 inline-flex items-center rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-brand-mute/80 shadow-sm">
                  {statusLabel}
                </span>
              </div>
              <div className="grid gap-6 p-8 md:grid-cols-[1.1fr_0.9fr] md:gap-10">
                <div className="space-y-5">
                  <div>
                    <h3 className="text-2xl font-semibold text-brand-navy">
                      {project.name}
                    </h3>
                    <p className="text-sm uppercase tracking-[0.18em] text-brand-mute/70">
                      {project.comuna}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-brand-navy/80">
                    {infoBadges.map((detail) => (
                      <span
                        key={`${detail.label}-${detail.value}`}
                        className="inline-flex items-center gap-1 rounded-full bg-brand-sand/70 px-3 py-1 font-medium"
                      >
                        {detail.label}: {detail.value}
                      </span>
                    ))}
                  </div>
                  {modalSummary && (
                    <p className="text-sm leading-relaxed text-brand-mute">
                      {modalSummary}
                    </p>
                  )}
                  <div className="rounded-2xl border border-brand-navy/10 bg-brand-sand/50 p-5 text-sm text-brand-navy">
                    <span className="block text-xs uppercase tracking-[0.3em] text-brand-mute/70">
                      Valor estimado
                    </span>
                    <div className="mt-2 text-xl font-semibold text-brand-navy">
                      {priceRange}
                    </div>
                    <p className="mt-3 text-xs text-brand-mute/80">
                      Valores referenciales en UF; solicita asesoría para
                      confirmar stock y promociones vigentes.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-brand-navy/10 bg-white/70 backdrop-blur-sm p-5 shadow-inner">
                    <p className="text-sm font-semibold text-brand-navy">
                      ¿Quieres más información?
                    </p>
                    <p className="mt-2 text-sm text-brand-mute">
                      Agenda con nuestro equipo para revisar tipologías,
                      beneficios y financiamiento a medida.
                    </p>
                    <div className="mt-4 flex flex-col gap-2 text-sm">
                      <a
                        href={`mailto:${contactEmail}`}
                        className="rounded-full border border-brand-navy/15 bg-brand-navy px-4 py-2 text-center font-semibold text-white transition hover:opacity-90"
                      >
                        Escribir a un asesor
                      </a>
                      <a
                        href={calLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-brand-navy/15 bg-white px-4 py-2 text-center font-semibold text-brand-navy transition hover:bg-brand-navy hover:text-white"
                      >
                        Agendar reunión
                      </a>
                    </div>
                  </div>
                  {totalGallery > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-brand-navy">
                        Galería
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {displayedGallery.map((url, index) => {
                          const globalIndex = index;
                          const showOverlay =
                            extraGallery > 0 &&
                            index === displayedGallery.length - 1;
                          return (
                            <button
                              type="button"
                              key={`${url}-${index}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                openGalleryAt(globalIndex);
                              }}
                              className="group relative flex h-20 overflow-hidden rounded-xl border border-brand-navy/10 bg-white/60 shadow-inner transition hover:border-brand-gold/40"
                            >
                              <SafeImage
                                src={url}
                                alt={`${project.name} gallery`}
                                fill
                                className="object-cover transition duration-500 group-hover:scale-[1.05]"
                                sizes="120px"
                              />
                              {showOverlay && (
                                <span className="absolute inset-0 flex items-center justify-center bg-brand-navy/65 text-xs font-semibold uppercase tracking-[0.32em] text-white">
                                  +{extraGallery} fotos
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {totalGallery > displayedGallery.length && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openGalleryAt(0);
                          }}
                          className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-navy/60 underline-offset-4 hover:underline"
                        >
                          Ver galería completa
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end border-t border-brand-navy/10 bg-white/60 px-8 py-4 backdrop-blur">
                <button
                  className="rounded-full border border-brand-navy/20 px-5 py-2 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy hover:text-white"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeModal();
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;
  const galleryContent =
    mounted && open && galleryOpen && totalGallery > 0
      ? createPortal(
          <div
            className="fixed inset-0 z-[1001] flex items-center justify-center bg-[#040815]/80 backdrop-blur-md px-4 py-10 md:px-8"
            role="dialog"
            aria-modal="true"
            aria-label={`Galería de ${project.name}`}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeGallery();
              }
            }}
          >
            <div className="relative w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/20 bg-white/92 shadow-[0_50px_140px_rgba(8,16,40,0.45)] backdrop-blur-xl">
              <header className="flex items-center justify-between gap-4 border-b border-brand-navy/10 px-6 py-4 md:px-8">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-navy/40">
                    Galería
                  </p>
                  <h4 className="text-lg font-semibold text-brand-navy">
                    {project.name}
                  </h4>
                </div>
                <div className="flex items-center gap-4">
                  {totalGallery > 1 && (
                    <span className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-navy/50">
                      {String(galleryIndex + 1).padStart(2, "0")}/
                      {String(totalGallery).padStart(2, "0")}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={closeGallery}
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-navy/10 bg-white/90 text-brand-navy transition hover:bg-brand-navy hover:text-white"
                    aria-label="Cerrar galería"
                  >
                    <span className="text-lg leading-none transition group-hover:rotate-90">
                      ×
                    </span>
                  </button>
                </div>
              </header>
              <div className="relative bg-brand-navy/5">
                <div className="relative h-[55vh] min-h-[320px] w-full">
                  <SafeImage
                    src={currentGalleryImage}
                    alt={`${project.name} imagen ${galleryIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 900px) 100vw, 900px"
                    priority
                  />
                </div>
                {totalGallery > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        goPrevImage();
                      }}
                      className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/90 text-brand-navy shadow-md transition hover:bg-brand-navy hover:text-white"
                      aria-label="Imagen anterior"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        goNextImage();
                      }}
                      className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/90 text-brand-navy shadow-md transition hover:bg-brand-navy hover:text-white"
                      aria-label="Imagen siguiente"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              {totalGallery > 1 && (
                <div className="flex gap-3 overflow-x-auto px-6 py-6 md:px-8">
                  {galleryImages.map((url, index) => {
                    const isActive = index === galleryIndex;
                    return (
                      <button
                        key={`${url}-${index}`}
                        type="button"
                        onClick={() => setGalleryIndex(index)}
                        className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-2xl border ${
                          isActive
                            ? "border-brand-gold/60 ring-2 ring-brand-gold/40"
                            : "border-brand-navy/10"
                        }`}
                      >
                        <SafeImage
                          src={url}
                          alt={`${project.name} miniatura ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <article
        className="group flex cursor-pointer flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white/80 text-brand-navy shadow-[0_24px_70px_rgba(14,33,73,0.08)] backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_32px_80px_rgba(14,33,73,0.14)]"
        onClick={() => setOpen(true)}
      >
        <div className="relative h-48 w-full overflow-hidden">
          <SafeImage
            src={coverSrc}
            alt={project.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-brand-mute/80 shadow-sm">
            {statusLabel}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-brand-navy">
              {project.name}
            </h3>
            <p className="text-sm uppercase tracking-[0.18em] text-brand-mute/70">
              {project.comuna}
            </p>
          </div>
          <p className="line-clamp-3 text-sm text-brand-mute/90">{summary}</p>
          {cardHighlights.length > 0 && (
            <div className="space-y-1 text-xs text-brand-navy/80">
              {cardHighlights.map((highlight) => (
                <p
                  key={highlight}
                  className="flex items-start gap-1 leading-snug"
                >
                  <span className="mt-0.5 text-brand-gold">•</span>
                  <span>{highlight}</span>
                </p>
              ))}
            </div>
          )}
          <div className="mt-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-brand-mute/60">
              Valor referencial
            </span>
            <div className="text-lg font-semibold text-brand-navy">
              {priceRange}
            </div>
          </div>
        </div>
      </article>
      {modalContent}
      {galleryContent}
    </>
  );
}
